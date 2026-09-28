import { readFileSync } from "fs";
import type { Attachment } from "nodemailer/lib/mailer";
import { newsletterEmailWrapper } from "../templates/newsletter";
import { buildUnsubscribeUrl } from "../../../api/newsletter/services/unsubscribe-token";
import { getStrapiTexts } from "../../../i18n/get-strapi-texts";
import { getSiteSettings } from "../get-site-settings";
import { buildNewsletterEmail, loadNewsletter } from "./build-newsletter";
import { escapeHtml } from "./newsletter-blocks-to-html";
import { NewsletterBuildError } from "./newsletter-limits";

/**
 * Renders a newsletter for the Strapi admin's preview panel: the exact HTML the subscribers
 * get, with the inline (CID) images swapped for data URIs a browser can display.
 */

const PREVIEW_RECIPIENT = "preview@example.com";

export interface NewsletterPreview {
  status: number;
  html: string;
}

function attachmentToDataUri(attachment: Attachment): string {
  const content = Buffer.isBuffer(attachment.content)
    ? attachment.content
    : readFileSync(attachment.path as string);
  const contentType = attachment.contentType ?? "image/jpeg";
  return `data:${contentType};base64,${content.toString("base64")}`;
}

function inlineAttachments(html: string, attachments: Attachment[]): string {
  return attachments.reduce(
    (result, attachment) =>
      attachment.cid ? result.split(`cid:${attachment.cid}`).join(attachmentToDataUri(attachment)) : result,
    html
  );
}

function messagePage(title: string, message: string): string {
  const font = "font-family:'Source Sans 3',Arial,Helvetica,sans-serif;";
  return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:48px 24px;background:#F1E8D9;${font}">
  <div style="max-width:640px;margin:0 auto;padding:32px;background:#ffffff;border-radius:12px;border-left:6px solid #C0392B;">
    <h1 style="${font}color:#C0392B;font-size:22px;font-weight:600;margin:0 0 12px;">${escapeHtml(title)}</h1>
    <p style="${font}color:#333333;font-size:16px;line-height:26px;margin:0;">${escapeHtml(message)}</p>
  </div>
</body>
</html>`;
}

export async function renderNewsletterPreview(
  documentId: string,
  status: "draft" | "published"
): Promise<NewsletterPreview> {
  const texts = getStrapiTexts();

  const newsletter = await loadNewsletter(documentId, status);
  if (!newsletter) {
    return {
      status: 404,
      html: messagePage(texts.NEWSLETTER_PREVIEW_ERROR_TITLE, texts.NEWSLETTER_PREVIEW_NOT_FOUND),
    };
  }

  try {
    const { organizationName } = await getSiteSettings();
    // Same build as the real send, so a preview also surfaces the errors publishing would hit.
    const { subject, bodyHtml, attachments } = await buildNewsletterEmail(newsletter, organizationName);
    const html = newsletterEmailWrapper(
      texts,
      subject,
      bodyHtml,
      buildUnsubscribeUrl(PREVIEW_RECIPIENT),
      organizationName
    );
    return { status: 200, html: inlineAttachments(html, attachments) };
  } catch (err) {
    if (err instanceof NewsletterBuildError) {
      return { status: 200, html: messagePage(texts.NEWSLETTER_PREVIEW_ERROR_TITLE, err.message) };
    }
    throw err;
  }
}
