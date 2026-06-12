/**
 * newsletter-signup controller
 */

import { factories } from "@strapi/strapi";
import { verifyUnsubscribeToken } from "../../newsletter/services/unsubscribe-token";

const UID = "api::newsletter-signup.newsletter-signup" as const;

async function resolveEmailFromJwt(ctx: any, strapi: any): Promise<string | null> {
  try {
    const authHeader = ctx.request.headers["authorization"] as string;
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    const payload = await strapi.plugin("users-permissions").service("jwt").verify(token);
    const user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { id: payload.id },
      select: ["email"],
    });
    console.info(`Resolved email from JWT for newsletter signup: ${user?.email ?? null}`);
    return user?.email ?? null;
  } catch {
    console.warn("Failed to resolve email from JWT in newsletter signup controller");
    return null;
  }
}

export default factories.createCoreController(UID, ({ strapi }) => ({
  async findMySubscription(ctx) {
    const email = await resolveEmailFromJwt(ctx, strapi);
    if (!email) {
      console.warn("Failed to resolve email from JWT in newsletter signup controller");
      return ctx.unauthorized();
    }

    const entry = await strapi.documents(UID).findFirst({
      filters: { email: email.toLowerCase() },
      status: "published",
    });
    ctx.body = { subscribed: !!entry };
    console.info(`Newsletter subscription status for ${email.toLowerCase()}: ${!!entry}`);
  },

  async subscribeMe(ctx) {
    const email = await resolveEmailFromJwt(ctx, strapi);
    if (!email) {
      console.warn("Failed to resolve email from JWT in newsletter signup controller");
      return ctx.unauthorized();
    }
    const normalized = email.toLowerCase();

    const existing = await strapi.documents(UID).findFirst({
      filters: { email: normalized },
    });

    if (!existing) {
      const created = await strapi.documents(UID).create({ data: { email: normalized } });
      await strapi.documents(UID).publish({ documentId: created.documentId });
    } else {
      console.info(`Newsletter signup already exists for ${normalized}, ensuring it's published`);
      await strapi.documents(UID).publish({ documentId: existing.documentId });
    }
    ctx.body = { subscribed: true };
  },

  async unsubscribeMe(ctx) {
    const email = await resolveEmailFromJwt(ctx, strapi);
    if (!email) return ctx.unauthorized();

    const existing = await strapi.documents(UID).findFirst({
      filters: { email: email.toLowerCase() },
    });
    if (existing) {
      console.info(`Unsubscribing ${email.toLowerCase()}`);
      await strapi.documents(UID).delete({ documentId: existing.documentId });
    }
    ctx.body = { subscribed: false };
    console.info(`Newsletter unsubscription successful for ${email.toLowerCase()}`);
  },

  async unsubscribe(ctx) {
    const { email, token } = ctx.query as { email?: string; token?: string };

    const fail = (message: string) => {
      ctx.type = "html";
      ctx.status = 400;
      ctx.body = unsubscribePage("Hiba", message, false);
    };

    if (!email || !token) return fail("Hiányos leiratkozási link.");
    if (!verifyUnsubscribeToken(email, token)) return fail("Érvénytelen vagy lejárt link.");

    const existing = await strapi.documents(UID).findFirst({
      filters: { email: email.toLowerCase() },
    });
    if (existing) {
      await strapi.documents(UID).delete({ documentId: existing.documentId });
    }

    ctx.type = "html";
    ctx.body = unsubscribePage(
      "Sikeres leiratkozás",
      "Sikeresen leiratkoztál a hírlevelünkről.",
      true
    );
  },
}));

function unsubscribePage(title: string, message: string, success: boolean): string {
  const color = success ? "#377F76" : "#c0392b";
  const siteUrl = process.env.SITE_URL ?? "#";
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Source+Sans+3:wght@300;400;600&display=swap');</style>
</head>
<body style="margin:0;padding:0;background:#F1E8D9;font-family:'Source Sans 3',Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);text-align:center;">
    <div style="background:${color};padding:32px 40px;">
      <h1 style="font-family:'Luckiest Guy',cursive;color:#fff;margin:0;font-size:28px;letter-spacing:2px;font-weight:400;">Gyertek velünk</h1>
    </div>
    <div style="padding:48px 40px;">
      <h2 style="font-family:'Luckiest Guy',cursive;color:${color};font-size:24px;margin:0 0 16px;font-weight:400;">${title}</h2>
      <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 32px;">${message}</p>
      <a href="${siteUrl}" style="background:${color};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">Vissza a főoldalra</a>
    </div>
    <div style="background:#70634C;padding:20px 40px;text-align:center;">
      <p style="color:#F1E8D9;font-size:13px;margin:0;">&copy; ${new Date().getFullYear()} Gyertek velünk</p>
    </div>
  </div>
</body>
</html>`;
}
