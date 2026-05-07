import type { Core } from '@strapi/strapi';

async function grantPermission(strapi: Core.Strapi, roleId: number, action: string) {
  const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
    where: { action, role: roleId },
  });
  if (!existing) {
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: roleId, enabled: true },
    });
  } else if (!existing.enabled) {
    await strapi.db.query('plugin::users-permissions.permission').update({
      where: { id: existing.id },
      data: { enabled: true },
    });
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:3000';

    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const existing = (await pluginStore.get({ key: 'advanced' })) as Record<string, unknown> | null;

    await pluginStore.set({
      key: 'advanced',
      value: {
        ...existing,
        email_confirmation: true,
        email_confirmation_redirection: `${clientUrl}/confirm-email`,
        email_reset_password: `${clientUrl}/reset-password`,
      },
    });

    // Grant authenticated role necessary permissions
    const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'authenticated' },
    });

    if (authenticatedRole) {
      const id = authenticatedRole.id;
      // Users-permissions: GET /api/users/me and PUT /api/users/me
      await grantPermission(strapi, id, 'plugin::users-permissions.user.me');
      await grantPermission(strapi, id, 'plugin::users-permissions.user.update');
      // Event signups: create and find
      await grantPermission(strapi, id, 'api::event-signup.event-signup.create');
      await grantPermission(strapi, id, 'api::event-signup.event-signup.find');
      // Events: find (needed for the event relation validation when creating event-signups)
      await grantPermission(strapi, id, 'api::event.event.find');
    }
  },
};
