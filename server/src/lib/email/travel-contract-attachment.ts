import MarkdownIt from "markdown-it";
import HTMLtoDOCX from "html-to-docx";
import { getStrapiTexts, toLocale, DEFAULT_LOCALE } from "../../i18n/get-strapi-texts";

/** The contract page is localized, so its slug differs per locale. */
const slugForLocale = (locale: string) => getStrapiTexts(toLocale(locale)).TRAVEL_CONTRACT_SLUG;

const md = new MarkdownIt();

interface TextContentBlock {
  __component: string;
  content?: string;
}

const findContractPage = async (locale: string) =>
  strapi.documents("api::page.page").findFirst({
    filters: { slug: { $eq: slugForLocale(locale) } },
    locale,
    status: "published",
    populate: { blocks: true },
  });

export const getTravelContractAttachment = async (
  locale: string = DEFAULT_LOCALE
): Promise<{
  filename: string;
  content: Buffer;
} | null> => {
  // A locale without its own translation must not drop the attachment, so fall back to
  // the default one rather than sending the confirmation with no contract at all.
  const page =
    (await findContractPage(locale)) ??
    (locale === DEFAULT_LOCALE ? null : await findContractPage(DEFAULT_LOCALE));

  const blocks = (page?.blocks ?? []) as TextContentBlock[];
  const markdown = blocks
    .filter((block) => block.__component === "blocks.text-content-block")
    .map((block) => block.content ?? "")
    .join("\n\n")
    .trim();

  if (!markdown) {
    strapi.log.error(
      `Travel contract page ("${slugForLocale(locale)}") not found or has no text content — the confirmation e-mail goes out without the contract.`
    );
    return null;
  }

  const html = md.render(markdown);
  const result = await HTMLtoDOCX(html, undefined, {
    title: getStrapiTexts(toLocale(locale)).TRAVEL_CONTRACT_DOCUMENT_TITLE,
  });
  const content = Buffer.isBuffer(result) ? result : Buffer.from(result as ArrayBuffer);

  return { filename: `${page.slug}.docx`, content };
};
