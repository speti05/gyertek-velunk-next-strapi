import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
import type { Attachment } from "nodemailer/lib/mailer";
import { getStrapiTexts } from "../../../i18n/get-strapi-texts";
import {
  NEWSLETTER_IMAGE_FETCH_TIMEOUT_MS,
  NEWSLETTER_IMAGE_JPEG_QUALITY,
  NEWSLETTER_IMAGE_MAX_HEIGHT,
  NEWSLETTER_IMAGE_MAX_WIDTH,
  NewsletterBuildError,
} from "./newsletter-limits";

/** The fields of a Strapi upload entry the newsletter needs. */
export interface StrapiMedia {
  url: string;
  name?: string | null;
  alternativeText?: string | null;
}

export interface EmbeddedImage {
  /** `cid:` URL to put into the `src` attribute. */
  src: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Collects every image of one newsletter, downscales and re-encodes it, and hands back
 * the inline attachments that the rendered HTML refers to by CID.
 *
 * The same image used twice at the same size is embedded only once.
 */
export class NewsletterImageEmbedder {
  private readonly cache = new Map<string, Promise<EmbeddedImage>>();
  private readonly files: Attachment[] = [];

  get attachments(): Attachment[] {
    return this.files;
  }

  /**
   * Embeds a Strapi media entry. A failing image aborts the whole newsletter, because an
   * editor-picked picture silently missing from a mail that has already gone out cannot
   * be fixed afterwards.
   */
  embed(media: StrapiMedia, maxWidth: number = NEWSLETTER_IMAGE_MAX_WIDTH): Promise<EmbeddedImage> {
    const key = `${media.url}@${maxWidth}`;
    let pending = this.cache.get(key);
    if (!pending) {
      pending = this.process(media, maxWidth);
      this.cache.set(key, pending);
    }
    return pending;
  }

  /** Same as `embed`, but a failure only drops the image (used for decorative, non-editor images). */
  async tryEmbed(media: StrapiMedia, maxWidth?: number): Promise<EmbeddedImage | null> {
    try {
      return await this.embed(media, maxWidth);
    } catch (err) {
      console.warn(`Newsletter: optional image skipped (${media.url}):`, (err as Error).message);
      return null;
    }
  }

  private async process(media: StrapiMedia, maxWidth: number): Promise<EmbeddedImage> {
    const displayName = media.name || path.basename(media.url);

    let output: { data: Buffer; info: sharp.OutputInfo };
    let hasAlpha: boolean;
    try {
      const source = await readMedia(media.url);
      hasAlpha = (await sharp(source).metadata()).hasAlpha ?? false;

      const pipeline = sharp(source, { failOn: "none" })
        // Applies the EXIF orientation, which most mail clients ignore.
        .rotate()
        .resize({
          width: maxWidth,
          height: NEWSLETTER_IMAGE_MAX_HEIGHT,
          fit: "inside",
          withoutEnlargement: true,
        });

      // Transparent images stay PNG; everything else (including WebP/AVIF, which several
      // mail clients cannot display) becomes a JPEG.
      output = await (hasAlpha
        ? pipeline.png({ compressionLevel: 9, palette: true })
        : pipeline.jpeg({ quality: NEWSLETTER_IMAGE_JPEG_QUALITY, mozjpeg: true })
      ).toBuffer({ resolveWithObject: true });
    } catch (err) {
      console.error(`Newsletter: image "${displayName}" could not be processed:`, err);
      throw new NewsletterBuildError(getStrapiTexts().NEWSLETTER_IMAGE_LOAD_ERROR(displayName));
    }

    const cid = `newsletter-image-${this.files.length + 1}`;
    const extension = hasAlpha ? "png" : "jpg";
    this.files.push({
      filename: `${path.parse(displayName).name}.${extension}`,
      content: output.data,
      contentType: hasAlpha ? "image/png" : "image/jpeg",
      cid,
    });

    return {
      src: `cid:${cid}`,
      width: output.info.width,
      height: output.info.height,
      alt: media.alternativeText ?? "",
    };
  }
}

/** Reads an upload from the local provider's folder, or downloads it when the URL is absolute. */
async function readMedia(url: string): Promise<Buffer> {
  if (/^https?:\/\//i.test(url)) {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(NEWSLETTER_IMAGE_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    return Buffer.from(await response.arrayBuffer());
  }

  const publicDir = strapi.dirs.static.public;
  const filePath = path.resolve(publicDir, url.replace(/^\/+/, ""));
  // Relative upload URLs always point into the public folder; refuse anything else.
  if (!filePath.startsWith(path.resolve(publicDir) + path.sep)) {
    throw new Error(`Media URL outside the public folder: ${url}`);
  }
  return fs.readFile(filePath);
}
