import path from "path";
import { statSync } from "fs";
import type { Attachment } from "nodemailer/lib/mailer";
import { newsletterEmailWrapper } from "../templates/newsletter";
import { blocksToHtml } from "../../../api/newsletter/services/blocks-to-html";
import { buildUnsubscribeUrl } from "../../../api/newsletter/services/unsubscribe-token";
import { getStrapiTexts, type StrapiTexts } from "../../../i18n/get-strapi-texts";
import { NewsletterImageEmbedder, type StrapiMedia } from "./newsletter-images";
import { newsletterBlocksToHtml, newsletterCoverToHtml } from "./newsletter-blocks-to-html";
import {
  NEWSLETTER_MAX_EMAIL_BYTES,
  NEWSLETTER_MAX_HTML_BYTES,
  NewsletterBuildError,
} from "./newsletter-limits";

export const NEWSLETTER_UID = "api::newsletter.newsletter";

/** Everything the e-mail needs; the lifecycle result carries no components or media. */
export const NEWSLETTER_POPULATE = {
  image: true,
  blocks: {
    on: {
      "blocks.paragraph": true,
      "blocks.heading": true,
      "blocks.youtube-video": true,
      "blocks.full-image": { populate: { image: true } },
      "blocks.paragraph-with-image": { populate: { image: true } },
      "blocks.hero-section": { populate: { image: true, cta: true } },
    },
  },
} as const;

export interface NewsletterContent {
  subject: string;
  image?: StrapiMedia | null;
  /** Legacy rich-text field from before the newsletter was built from blocks. */
  body?: unknown;
  blocks?: { __component: string; [key: string]: any }[] | null;
}

export interface BuiltNewsletter {
  subject: string;
  bodyHtml: string;
  attachments: Attachment[];
}

export const NEWSLETTER_HEADER_ATTACHMENT: Attachment = {
  filename: "hirlevel-fejlec-1100.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/hirlevel-fejlec-1100.jpg"),
  cid: "hirlevel-fejlec",
};

/** Loads a newsletter with everything the e-mail renders. */
export const loadNewsletter = async (
  documentId: string,
  status: "draft" | "published"
): Promise<NewsletterContent | null> =>
  (await strapi.documents(NEWSLETTER_UID).findOne({
    documentId,
    status,
    populate: NEWSLETTER_POPULATE as any,
  })) as unknown as NewsletterContent | null;

/** Legacy `body` field: embeds its image nodes too, so no image is linked from the server. */
async function renderLegacyBody(body: unknown, images: NewsletterImageEmbedder): Promise<string> {
  if (!Array.isArray(body) || body.length === 0) return "";
  const nodes = structuredClone(body) as any[];
  for (const node of nodes) {
    if (node?.type === "image" && node.image?.url) {
      const embedded = await images.embed({
        url: node.image.url,
        name: node.image.name,
        alternativeText: node.image.alternativeText,
      });
      node.image = { url: embedded.src, alternativeText: embedded.alt };
    }
  }
  return blocksToHtml(nodes);
}

/** Size of an attachment once it is base64-encoded into the message (76 chars + CRLF per line). */
function encodedSize(bytes: number): number {
  return Math.ceil(bytes / 57) * 78;
}

function attachmentBytes(attachment: Attachment): number {
  if (Buffer.isBuffer(attachment.content)) return attachment.content.length;
  if (typeof attachment.path === "string") return statSync(attachment.path).size;
  return 0;
}

const toMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);
const toKb = (bytes: number) => Math.ceil(bytes / 1024);

/**
 * Throws a NewsletterBuildError when the finished mail would be clipped or rejected.
 * `sampleHtml` is one recipient's full HTML; the recipients differ only in the unsubscribe token.
 */
function assertWithinSizeLimits(sampleHtml: string, attachments: Attachment[], texts: StrapiTexts) {
  const htmlBytes = Buffer.byteLength(sampleHtml, "utf8");
  if (htmlBytes > NEWSLETTER_MAX_HTML_BYTES) {
    throw new NewsletterBuildError(
      texts.NEWSLETTER_HTML_TOO_LARGE_ERROR(toKb(NEWSLETTER_MAX_HTML_BYTES), toKb(htmlBytes))
    );
  }

  const totalBytes =
    encodedSize(htmlBytes) +
    attachments.reduce((sum, attachment) => sum + encodedSize(attachmentBytes(attachment)), 0);
  if (totalBytes > NEWSLETTER_MAX_EMAIL_BYTES) {
    throw new NewsletterBuildError(
      texts.NEWSLETTER_TOO_LARGE_ERROR(toMb(NEWSLETTER_MAX_EMAIL_BYTES), toMb(totalBytes))
    );
  }

  console.info(
    `Newsletter size: HTML ${toKb(htmlBytes)} KB, whole mail ~${toMb(totalBytes)} MB, ${attachments.length} attachment(s)`
  );
}

/**
 * Renders a newsletter into the body HTML and inline attachments shared by every
 * recipient, and verifies that the result is small enough to be delivered.
 */
export const buildNewsletterEmail = async (
  newsletter: NewsletterContent,
  organizationName: string
): Promise<BuiltNewsletter> => {
  // A newsletter signup stores only an e-mail address, so the recipient's language is
  // unknown here. The broadcast goes out in the default locale.
  const texts = getStrapiTexts();
  const images = new NewsletterImageEmbedder();

  const bodyHtml = [
    await newsletterCoverToHtml(newsletter.image, images),
    await renderLegacyBody(newsletter.body, images),
    await newsletterBlocksToHtml(newsletter.blocks, images, texts),
  ]
    .filter(Boolean)
    .join("\n");

  if (!bodyHtml.trim()) throw new NewsletterBuildError(texts.NEWSLETTER_EMPTY_ERROR);

  const attachments = [NEWSLETTER_HEADER_ATTACHMENT, ...images.attachments];
  const sampleHtml = newsletterEmailWrapper(
    texts,
    newsletter.subject,
    bodyHtml,
    buildUnsubscribeUrl("size-check@example.com"),
    organizationName
  );
  assertWithinSizeLimits(sampleHtml, attachments, texts);

  return { subject: newsletter.subject, bodyHtml, attachments };
};
