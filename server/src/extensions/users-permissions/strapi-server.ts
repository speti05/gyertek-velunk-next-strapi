// --- In-memory rate limiter (no extra dependencies) ---
interface RateEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateEntry>();

// Clean up expired entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }
}, 10 * 60 * 1000);

function getClientIp(ctx: any): string {
  return (
    ctx.request.headers['cf-connecting-ip'] ||
    ctx.request.headers['x-forwarded-for']?.split(',')[0].trim() ||
    ctx.request.ip ||
    'unknown'
  );
}

/**
 * @param ctx       Koa context
 * @param key       Unique key (e.g. "login:1.2.3.4")
 * @param limit     Max attempts within the window
 * @param windowMs  Time window in milliseconds
 * @returns true if the request is blocked
 */
function isRateLimited(ctx: any, key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    ctx.set('Retry-After', String(retryAfter));
    ctx.tooManyRequests(`Too many attempts. Please try again in ${retryAfter} seconds.`);
    return true;
  }

  return false;
}

// -------------------------------------------------------

export default (plugin: any) => {
  const originalCallback = plugin.controllers.auth.callback;
  const originalRegister = plugin.controllers.auth.register;
  const originalForgotPassword = plugin.controllers.auth.forgotPassword;
  const originalEmailConfirmation = plugin.controllers.auth.emailConfirmation;
  const originalResetPassword = plugin.controllers.auth.resetPassword;

  // Login — 10 attempts / 15 minutes / IP
  plugin.controllers.auth.callback = async (ctx: any) => {
    const ip = getClientIp(ctx);
    if (isRateLimited(ctx, `login:${ip}`, 10, 15 * 60 * 1000)) return;
    await originalCallback(ctx);
  };

  // Register — 5 attempts / hour / IP
  plugin.controllers.auth.register = async (ctx: any) => {
    const ip = getClientIp(ctx);
    if (isRateLimited(ctx, `register:${ip}`, 5, 60 * 60 * 1000)) return;
    await originalRegister(ctx);
  };

  // Forgot password — 5 attempts / hour / IP
  plugin.controllers.auth.forgotPassword = async (ctx: any) => {
    const ip = getClientIp(ctx);
    if (isRateLimited(ctx, `forgot:${ip}`, 5, 60 * 60 * 1000)) return;
    await originalForgotPassword(ctx);
  };

  plugin.controllers.auth.emailConfirmation = async (ctx: any) => {
    try {
      await originalEmailConfirmation(ctx);
    } catch {
      const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
      const settings = (await pluginStore.get({ key: 'advanced' })) as Record<string, string> | null;
      const redirectUrl = settings?.email_confirmation_redirection;

      if (redirectUrl) {
        ctx.redirect(`${redirectUrl}?error=invalid`);
      } else {
        ctx.badRequest('Invalid confirmation token');
      }
    }
  };

  plugin.controllers.auth.resetPassword = async (ctx: any) => {
    const code = ctx.request.body?.code;
    const userBeforeReset = code
      ? await strapi.db.query('plugin::users-permissions.user').findOne({ where: { resetPasswordToken: code } })
      : null;

    await originalResetPassword(ctx);

    // Password reset proves email ownership — confirm the user if not already confirmed.
    // We use the pre-fetched user because ctx.body.user may be sanitized (no id exposed).
    if (ctx.status === 200 && userBeforeReset?.id) {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userBeforeReset.id },
        data: { confirmed: true },
      });
    }
  };

  return plugin;
};
