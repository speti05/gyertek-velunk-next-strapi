import path from "path";
import type { Core } from "@strapi/strapi";
import { sendNewsletterBroadcast } from "./lib/email/newsletter";
import { getTransporter } from "./lib/email/mailer";

async function grantPermission(strapi: Core.Strapi, roleId: number, action: string) {
  const existing = await strapi.db.query("plugin::users-permissions.permission").findOne({
    where: { action, role: roleId },
  });
  if (!existing) {
    await strapi.db.query("plugin::users-permissions.permission").create({
      data: { action, role: roleId, enabled: true },
    });
  } else if (!existing.enabled) {
    await strapi.db.query("plugin::users-permissions.permission").update({
      where: { id: existing.id },
      data: { enabled: true },
    });
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    getTransporter().catch((err) => console.error("Mailer init failed:", err));

    // Inject header image as CID inline attachment into every Strapi system email
    const headerImagePath = path.join(
      strapi.dirs.app.root,
      "src/lib/email/templates/email-fejlec-600.jpg"
    );
    const emailService = strapi.plugin("email").service("email") as any;
    const _originalSend = emailService.send.bind(emailService);
    emailService.send = async (options: any) => {
      options.attachments = [
        ...(options.attachments ?? []),
        { filename: "email-fejlec-600.jpg", path: headerImagePath, cid: "email-fejlec" },
      ];
      return _originalSend(options);
    };

    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";

    const pluginStore = strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    const existing = (await pluginStore.get({ key: "advanced" })) as Record<string, unknown> | null;

    await pluginStore.set({
      key: "advanced",
      value: {
        ...existing,
        email_confirmation: true,
        email_confirmation_redirection: `${clientUrl}/confirm-email`,
        email_reset_password: `${clientUrl}/reset-password`,
      },
    });

    // Grant authenticated role necessary permissions
    const authenticatedRole = await strapi.db.query("plugin::users-permissions.role").findOne({
      where: { type: "authenticated" },
    });

    if (authenticatedRole) {
      const id = authenticatedRole.id;
      await grantPermission(strapi, id, "plugin::users-permissions.user.me");
      await grantPermission(strapi, id, "plugin::users-permissions.user.update");
      await grantPermission(strapi, id, "api::event-signup.event-signup.create");
      await grantPermission(strapi, id, "api::event-signup.event-signup.find");
      await grantPermission(strapi, id, "api::event.event.find");
    }

    // Newsletter: send on first publish
    const handleNewsletterPublish = async (result: any) => {
      if (!result.publishedAt || result.sentAt) return;

      console.info(`Newsletter lifecycle triggered for "${result.subject}"`);

      try {
        const subscribers = (await strapi
          .documents("api::newsletter-signup.newsletter-signup")
          .findMany({ status: "published", fields: ["email"] })) as { email: string }[];

        const emails = subscribers.map((s) => s.email).filter(Boolean);

        if (emails.length === 0) {
          console.info("Newsletter: no subscribers found");
          return;
        }

        const sentCount = await sendNewsletterBroadcast(result.subject, result.body, emails);

        await strapi.db.query("api::newsletter.newsletter").update({
          where: { id: result.id },
          data: { sentAt: new Date() },
        });

        console.info(
          `Newsletter "${result.subject}" sent to ${sentCount}/${emails.length} subscribers`
        );
      } catch (err) {
        console.error("Newsletter send failed:", err);
      }
    };

    strapi.db.lifecycles.subscribe({
      models: ["api::newsletter.newsletter"],
      async afterCreate(event: any) {
        await handleNewsletterPublish(event.result);
      },
      async afterUpdate(event: any) {
        await handleNewsletterPublish(event.result);
      },
    });

    // Auto-subscribe new users to the newsletter on registration
    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"],
      async afterCreate(event: any) {
        const email = event.result?.email;
        if (!email) return;
        try {
          const existing = await strapi
            .documents("api::newsletter-signup.newsletter-signup")
            .findFirst({ filters: { email: email.toLowerCase() } });
          if (!existing) {
            const created = await strapi
              .documents("api::newsletter-signup.newsletter-signup")
              .create({ data: { email: email.toLowerCase() } });
            await strapi
              .documents("api::newsletter-signup.newsletter-signup")
              .publish({ documentId: created.documentId });
          }
        } catch (err) {
          console.error("Failed to auto-subscribe new user to newsletter:", err);
        }
      },
    });
  },
};
