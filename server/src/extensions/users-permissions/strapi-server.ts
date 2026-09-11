/**
 * users-permissions extension.
 *
 * - `role` decides whether a user may read disabled entries (see the
 *   hide-disabled-content middleware), so it must never be settable through the public
 *   auth/user endpoints: those pass the request body straight to the user service, and
 *   the Authenticated role holds `user.update`. Without this, anyone could move
 *   themselves into the TestUser role.
 * - `/api/users/me` does not populate the role, so the front-end cannot tell a test user
 *   apart. It is added back to the response here.
 */

type Role = { id: number; name: string; type: string };
type Context = {
  request: { body?: unknown };
  state?: { user?: { role?: Role } };
  body?: unknown;
};
type Handler = (ctx: Context) => Promise<unknown>;

const PROTECTED_FIELDS = ["role"] as const;

const stripProtectedFields = (ctx: Context) => {
  const body = ctx.request?.body;
  if (!body || typeof body !== "object") return;
  for (const field of PROTECTED_FIELDS) {
    delete (body as Record<string, unknown>)[field];
  }
};

const guard = (handler: Handler): Handler =>
  async function (this: unknown, ctx: Context) {
    stripProtectedFields(ctx);
    return handler.call(this, ctx);
  };

const withRole = (handler: Handler): Handler =>
  async function (this: unknown, ctx: Context) {
    const result = await handler.call(this, ctx);
    const role = ctx.state?.user?.role;
    if (role && ctx.body && typeof ctx.body === "object" && !Array.isArray(ctx.body)) {
      (ctx.body as Record<string, unknown>).role = {
        id: role.id,
        name: role.name,
        type: role.type,
      };
    }
    return result;
  };

export default (plugin: {
  controllers: {
    auth: Record<string, Handler>;
    user: Record<string, Handler>;
  };
}) => {
  plugin.controllers.auth.register = guard(plugin.controllers.auth.register);
  plugin.controllers.user.create = guard(plugin.controllers.user.create);
  plugin.controllers.user.update = guard(plugin.controllers.user.update);
  plugin.controllers.user.me = withRole(plugin.controllers.user.me);

  return plugin;
};
