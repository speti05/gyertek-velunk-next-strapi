import crypto from "crypto";
import { factories } from "@strapi/strapi";
import { renderNewsletterPreview } from "../../../lib/email/newsletter/newsletter-preview";

function isValidPreviewSecret(secret: unknown): boolean {
  const expected = process.env.PREVIEW_SECRET;
  if (!expected || typeof secret !== "string") return false;
  const given = Buffer.from(secret);
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && crypto.timingSafeEqual(given, wanted);
}

/**
 * Reloads the page when the admin's preview panel reports a saved change. The admin is
 * served from this same origin, so messages from anywhere else are ignored.
 */
const reloadOnUpdateScript = (nonce: string) =>
  `<script nonce="${nonce}">window.addEventListener("message",function(e){if(e.origin===location.origin&&e.data&&e.data.type==="strapiUpdate")location.reload();});</script>`;

export default factories.createCoreController("api::newsletter.newsletter", () => ({
  /** Shown in the admin's preview panel; see the preview handler in config/admin.ts. */
  async preview(ctx) {
    if (!isValidPreviewSecret(ctx.query.secret)) return ctx.unauthorized();

    const status = ctx.query.status === "published" ? "published" : "draft";
    const { status: httpStatus, html } = await renderNewsletterPreview(ctx.params.documentId, status);

    const nonce = crypto.randomBytes(16).toString("base64");
    // Replaces the global CSP for this page only: images are inlined as data URIs and the
    // one script is the reload listener above.
    ctx.set(
      "Content-Security-Policy",
      [
        "default-src 'none'",
        "img-src data:",
        "style-src 'unsafe-inline' https://fonts.googleapis.com",
        "font-src https://fonts.gstatic.com",
        `script-src 'nonce-${nonce}'`,
        "frame-ancestors 'self'",
      ].join("; ")
    );
    ctx.set("Cache-Control", "no-store");
    ctx.status = httpStatus;
    ctx.type = "text/html; charset=utf-8";
    ctx.body = html.replace("</body>", `${reloadOnUpdateScript(nonce)}</body>`);
  },
}));
