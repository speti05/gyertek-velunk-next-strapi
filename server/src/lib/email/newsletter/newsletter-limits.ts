/**
 * Size limits for the newsletter e-mail.
 *
 * Every image in a newsletter is embedded into the mail as an inline (CID) attachment, so
 * the recipient sees it without the mail client having to reach the Strapi server. That
 * makes the mail itself carry the image bytes, hence the caps below.
 */

/** Width of the white content cell in the newsletter template (1100px table - 2 x 48px padding). */
export const NEWSLETTER_CONTENT_WIDTH = 1000;

/** Widest an embedded image is ever sent. Full-width images are downscaled to this. */
export const NEWSLETTER_IMAGE_MAX_WIDTH = NEWSLETTER_CONTENT_WIDTH;

/** Images shown in half a row (gallery grid, paragraph with image) are downscaled to this. */
export const NEWSLETTER_IMAGE_HALF_WIDTH = 480;

/** Tall portrait images are capped in height as well, so one photo cannot fill several screens. */
export const NEWSLETTER_IMAGE_MAX_HEIGHT = 1400;

/** JPEG quality of the re-encoded images. */
export const NEWSLETTER_IMAGE_JPEG_QUALITY = 78;

/**
 * Upper bound of the whole encoded message (HTML + base64-encoded attachments).
 * Gmail refuses anything above 25 MB, but plenty of receiving servers cut off at 10 MB,
 * and a newsletter that heavy is slow to open anyway.
 */
export const NEWSLETTER_MAX_EMAIL_BYTES = 10 * 1024 * 1024;

/**
 * Upper bound of the HTML part. Gmail clips messages whose HTML exceeds ~102 KB behind a
 * "View entire message" link, which would also hide the unsubscribe link in the footer.
 */
export const NEWSLETTER_MAX_HTML_BYTES = 100 * 1024;

/** How long a remote image download may take before it counts as failed. */
export const NEWSLETTER_IMAGE_FETCH_TIMEOUT_MS = 15_000;

/** Thrown when a newsletter cannot be turned into a sendable e-mail. The message is editor-facing. */
export class NewsletterBuildError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NewsletterBuildError";
  }
}
