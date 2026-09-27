import MarkdownIt from "markdown-it";
import { getClientUrl } from "../../config/client-url";
import type { StrapiTexts } from "../../../i18n/get-strapi-texts";
import { NEWSLETTER_IMAGE_HALF_WIDTH, NEWSLETTER_IMAGE_MAX_WIDTH } from "./newsletter-limits";
import type { EmbeddedImage, NewsletterImageEmbedder, StrapiMedia } from "./newsletter-images";

/**
 * Renders the newsletter's dynamic zone - the same blocks an article is built from - into
 * e-mail HTML. Mail clients ignore most stylesheets, so every element carries inline styles
 * and layouts are tables.
 */

const FONT = "font-family:'Source Sans 3',Arial,sans-serif;";
const HEADING_FONT = "font-family:'Luckiest Guy',cursive;";
const TEXT_STYLE = `${FONT}color:#333333;font-size:16px;line-height:26px;`;
const LINK_STYLE = "color:#377F76;text-decoration:underline;";

const HEADING_SIZES: Record<string, string> = {
  h1: "28px",
  h2: "24px",
  h3: "20px",
  h4: "18px",
  h5: "16px",
  h6: "14px",
};

const HERO_THEME_COLORS: Record<string, string> = {
  turquoise: "#377F76",
  orange: "#70634C",
};

/** Inline style of each tag markdown-it can produce (raw HTML input is disabled). */
const MARKDOWN_TAG_STYLES: Record<string, string> = {
  p: `${TEXT_STYLE}margin:0 0 16px;`,
  ul: "margin:0 0 16px;padding-left:24px;",
  ol: "margin:0 0 16px;padding-left:24px;",
  li: `${TEXT_STYLE}margin-bottom:6px;`,
  a: LINK_STYLE,
  blockquote: `border-left:4px solid #377F76;margin:16px 0;padding:12px 20px;background:#F1E8D9;${FONT}color:#70634C;font-size:16px;font-style:italic;`,
  pre: "background:#f4f4f4;padding:16px;border-radius:6px;font-size:14px;margin:0 0 16px;font-family:monospace;white-space:pre-wrap;",
  code: "background:#f4f4f4;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:14px;",
  hr: "border:0;border-top:1px solid #E4CBA1;margin:24px 0;",
  table: "border-collapse:collapse;margin:0 0 16px;",
  th: `${TEXT_STYLE}border:1px solid #E4CBA1;padding:6px 10px;text-align:left;`,
  td: `${TEXT_STYLE}border:1px solid #E4CBA1;padding:6px 10px;`,
  img: "display:block;max-width:100%;height:auto;margin:16px 0;border:0;",
  ...Object.fromEntries(
    Object.entries(HEADING_SIZES).map(([tag, size]) => [
      tag,
      `${HEADING_FONT}color:#377F76;font-size:${size};margin:24px 0 12px;font-weight:400;letter-spacing:1px;`,
    ])
  ),
};

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

interface DynamicZoneBlock {
  __component: string;
  [key: string]: any;
}

interface RenderContext {
  images: NewsletterImageEmbedder;
  texts: StrapiTexts;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Links in the CMS are often site-relative ("/turaink"); a mail needs absolute ones. */
function absoluteHref(href: string): string {
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  return `${getClientUrl()}${href.startsWith("/") ? "" : "/"}${href}`;
}

function imageTag(image: EmbeddedImage, style = ""): string {
  return `<img src="${image.src}" width="${image.width}" alt="${escapeHtml(image.alt)}" style="display:block;width:100%;max-width:${image.width}px;height:auto;border:0;${style}" />`;
}

function button(href: string, label: string, background = "#377F76"): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td bgcolor="${background}" style="border-radius:6px;"><a href="${escapeHtml(absoluteHref(href))}" style="display:inline-block;padding:12px 28px;${FONT}color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a></td></tr></table>`;
}

/** Renders Strapi rich text (markdown), embedding the images it contains. */
async function renderMarkdown(content: string | undefined, ctx: RenderContext): Promise<string> {
  if (!content?.trim()) return "";

  const tokens = md.parse(content, {});
  const visit = async (list: typeof tokens) => {
    for (const token of list) {
      // Fenced code blocks render as <pre><code>, with the token's attributes on <code>.
      const style = token.type === "fence" ? MARKDOWN_TAG_STYLES.pre : MARKDOWN_TAG_STYLES[token.tag];
      // Opening and self-contained tokens only; closing tags take no attributes.
      if (style && token.nesting !== -1) token.attrSet("style", style);
      if (token.type === "link_open") {
        token.attrSet("href", absoluteHref(token.attrGet("href") ?? ""));
      }
      if (token.type === "image") {
        const embedded = await ctx.images.embed(
          { url: token.attrGet("src") ?? "", alternativeText: token.content },
          NEWSLETTER_IMAGE_MAX_WIDTH
        );
        token.attrSet("src", embedded.src);
        token.attrSet("width", String(embedded.width));
      }
      if (token.children) await visit(token.children);
    }
  };
  await visit(tokens);

  return md.renderer.render(tokens, md.options, {});
}

function getYoutubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null;
  const pathMatch = parsed.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  return parsed.searchParams.get("v");
}

async function renderBlock(block: DynamicZoneBlock, ctx: RenderContext): Promise<string> {
  switch (block.__component) {
    case "blocks.heading": {
      if (!block.heading) return "";
      return `<h2 style="${MARKDOWN_TAG_STYLES.h2}">${escapeHtml(block.heading)}</h2>`;
    }

    case "blocks.paragraph":
      return renderMarkdown(block.content, ctx);

    case "blocks.full-image": {
      if (!block.image) return "";
      const image = await ctx.images.embed(block.image as StrapiMedia);
      return `<div style="margin:0 0 24px;">${imageTag(image)}</div>`;
    }

    case "blocks.paragraph-with-image": {
      const text = await renderMarkdown(block.content, ctx);
      if (!block.image) return text;
      const imageWidth = block.imageLandscape === false ? 320 : NEWSLETTER_IMAGE_HALF_WIDTH;
      const image = await ctx.images.embed(block.image as StrapiMedia, imageWidth);
      const imageCell = `<td width="${image.width}" valign="top" style="padding:0;">${imageTag(image)}</td>`;
      const gapCell = `<td width="24" style="font-size:0;line-height:0;">&nbsp;</td>`;
      const textCell = `<td valign="top" style="padding:0;">${text}</td>`;
      const cells = block.reversed
        ? [imageCell, gapCell, textCell]
        : [textCell, gapCell, imageCell];
      return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr>${cells.join("")}</tr></table>`;
    }

    case "blocks.hero-section": {
      const parts: string[] = [];
      if (block.image) {
        parts.push(imageTag(await ctx.images.embed(block.image as StrapiMedia)));
      }
      const color = HERO_THEME_COLORS[block.theme] ?? HERO_THEME_COLORS.turquoise;
      if (block.heading) {
        parts.push(
          `<div style="background:${color};padding:16px 24px;"><h2 style="${HEADING_FONT}color:#ffffff;font-size:26px;margin:0;font-weight:400;letter-spacing:1px;">${escapeHtml(block.heading)}</h2></div>`
        );
      }
      const cta = block.cta?.href && block.cta.text ? button(block.cta.href, block.cta.text, color) : "";
      return `<div style="margin:0 0 24px;">${parts.join("")}</div>${cta}`;
    }

    case "blocks.picture-gallery": {
      const media = (block.images ?? []) as StrapiMedia[];
      const images: EmbeddedImage[] = [];
      for (const item of media) images.push(await ctx.images.embed(item, NEWSLETTER_IMAGE_HALF_WIDTH));

      const rows: string[] = [];
      for (let i = 0; i < images.length; i += 2) {
        const cell = (image?: EmbeddedImage) =>
          `<td width="50%" valign="top" style="padding:6px;">${image ? imageTag(image) : "&nbsp;"}</td>`;
        rows.push(`<tr>${cell(images[i])}${cell(images[i + 1])}</tr>`);
      }

      const title = block.title ? `<h3 style="${MARKDOWN_TAG_STYLES.h3}">${escapeHtml(block.title)}</h3>` : "";
      const description = block.description
        ? `<p style="${MARKDOWN_TAG_STYLES.p}">${escapeHtml(block.description)}</p>`
        : "";
      const grid = rows.length
        ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">${rows.join("")}</table>`
        : "";
      return `${title}${description}${grid}`;
    }

    case "blocks.youtube-video": {
      // Mail clients cannot play embedded video, so the block becomes a thumbnail linking to YouTube.
      const videoId = block.videoUrl ? getYoutubeVideoId(block.videoUrl) : null;
      if (!videoId) return "";
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}${block.startTime ? `&t=${block.startTime}s` : ""}`;
      const thumbnail = await ctx.images.tryEmbed({
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        name: `youtube-${videoId}.jpg`,
        alternativeText: block.title ?? "",
      });

      const title = block.title ? `<h3 style="${MARKDOWN_TAG_STYLES.h3}">${escapeHtml(block.title)}</h3>` : "";
      const description = block.description
        ? `<p style="${MARKDOWN_TAG_STYLES.p}">${escapeHtml(block.description)}</p>`
        : "";
      const preview = thumbnail
        ? `<a href="${escapeHtml(watchUrl)}" style="display:block;margin:0 0 16px;">${imageTag(thumbnail)}</a>`
        : "";
      return `${title}${description}${preview}${button(watchUrl, ctx.texts.NEWSLETTER_YOUTUBE_WATCH_LABEL)}`;
    }

    default:
      console.warn(`Newsletter: block "${block.__component}" has no e-mail renderer, skipped`);
      return "";
  }
}

export async function newsletterBlocksToHtml(
  blocks: DynamicZoneBlock[] | null | undefined,
  images: NewsletterImageEmbedder,
  texts: StrapiTexts
): Promise<string> {
  const ctx: RenderContext = { images, texts };
  const html: string[] = [];
  // Sequential on purpose: keeps the CID numbering in document order and the memory use flat.
  for (const block of blocks ?? []) html.push(await renderBlock(block, ctx));
  return html.filter(Boolean).join("\n");
}

/** The newsletter's own cover image, shown right under the subject bar. */
export async function newsletterCoverToHtml(
  image: StrapiMedia | null | undefined,
  images: NewsletterImageEmbedder
): Promise<string> {
  if (!image) return "";
  return `<div style="margin:0 0 32px;">${imageTag(await images.embed(image))}</div>`;
}
