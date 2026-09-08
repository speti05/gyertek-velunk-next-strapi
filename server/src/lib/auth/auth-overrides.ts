import type { Core } from "@strapi/strapi";

// --- In-memory rate limiter (no extra dependencies) ---
interface RateEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateEntry>();

// Clean up expired entries every 10 minutes to prevent memory leaks
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(key);
    }
  },
  10 * 60 * 1000
);

function getClientIp(ctx: any): string {
  return (
    ctx.request.headers["cf-connecting-ip"] ||
    ctx.request.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    ctx.request.ip ||
    "unknown"
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
    ctx.set("Retry-After", String(retryAfter));
    ctx.tooManyRequests(`Too many attempts. Please try again in ${retryAfter} seconds.`);
    return true;
  }

  return false;
}

// -------------------------------------------------------

// Kept in sync with the client (client/src/data/auth-actions.ts), which matches on this
// message to offer the "resend confirmation email" link.
const EMAIL_NOT_CONFIRMED_ERROR = "Email is registered but not confirmed";

/**
 * Rate limiting and custom error handling on the users-permissions auth controller.
 *
 * This lives here instead of src/extensions/users-permissions/strapi-server.ts because
 * that extension is never applied in the compiled production build — the file ends up in
 * dist/src/extensions but the plugin loader does not pick it up, so both the rate limits
 * and the custom errors silently did nothing in production.
 *
 * Must be called from the register() lifecycle: Strapi composes its routes during
 * bootstrap() (server.initRouting) and binds controller methods there, so patching any
 * later would have no effect.
 */
export function applyAuthOverrides(strapi: Core.Strapi) {
  const auth = strapi.plugin("users-permissions").controller("auth") as any;

  const originalCallback = auth.callback;
  const originalRegister = auth.register;
  const originalForgotPassword = auth.forgotPassword;
  const originalEmailConfirmation = auth.emailConfirmation;
  const originalResetPassword = auth.resetPassword;
  const originalSendEmailConfirmation = auth.sendEmailConfirmation;

  // Login — 10 attempts / 15 minutes / IP
  auth.callback = async (ctx: any) => {
    const ip = getClientIp(ctx);
    if (isRateLimited(ctx, `login:${ip}`, 10, 15 * 60 * 1000)) return;
    await originalCallback(ctx);
  };

  // Register — 5 attempts / hour / IP
  auth.register = async (ctx: any) => {
    const ip = getClientIp(ctx);
    if (isRateLimited(ctx, `register:${ip}`, 5, 60 * 60 * 1000)) return;

    // The core controller answers "Email or Username are already taken" for every
    // duplicate. We answer with a distinct message when the existing account is still
    // waiting for its email confirmation, so the client can offer to resend that email.
    const email = ctx.request.body?.email;
    if (typeof email === "string" && email.trim()) {
      const existingUser = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: { email: email.trim().toLowerCase() },
      });

      if (existingUser && !existingUser.confirmed && !existingUser.blocked) {
        return ctx.badRequest(EMAIL_NOT_CONFIRMED_ERROR);
      }
    }

    await originalRegister(ctx);
  };

  // Resend confirmation email — 3 attempts / hour / IP
  auth.sendEmailConfirmation = async (ctx: any) => {
    const ip = getClientIp(ctx);
    if (isRateLimited(ctx, `send-email-confirmation:${ip}`, 3, 60 * 60 * 1000)) return;
    await originalSendEmailConfirmation(ctx);
  };

  // Forgot password — 5 attempts / hour / IP
  auth.forgotPassword = async (ctx: any) => {
    const ip = getClientIp(ctx);
    if (isRateLimited(ctx, `forgot:${ip}`, 5, 60 * 60 * 1000)) return;
    await originalForgotPassword(ctx);
  };

  auth.emailConfirmation = async (ctx: any) => {
    try {
      await originalEmailConfirmation(ctx);
    } catch {
      const pluginStore = strapi.store({ type: "plugin", name: "users-permissions" });
      const settings = (await pluginStore.get({ key: "advanced" })) as Record<
        string,
        string
      > | null;
      const redirectUrl = settings?.email_confirmation_redirection;

      if (redirectUrl) {
        ctx.redirect(`${redirectUrl}?error=invalid`);
      } else {
        ctx.badRequest("Invalid confirmation token");
      }
    }
  };

  auth.resetPassword = async (ctx: any) => {
    const code = ctx.request.body?.code;
    const userBeforeReset = code
      ? await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({ where: { resetPasswordToken: code } })
      : null;

    await originalResetPassword(ctx);

    // Password reset proves email ownership — confirm the user if not already confirmed.
    // We use the pre-fetched user because ctx.body.user may be sanitized (no id exposed).
    if (ctx.status === 200 && userBeforeReset?.id) {
      await strapi.db.query("plugin::users-permissions.user").update({
        where: { id: userBeforeReset.id },
        data: { confirmed: true },
      });
    }
  };
}
