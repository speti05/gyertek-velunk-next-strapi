import MarkdownIt from "markdown-it";
import HTMLtoDOCX from "html-to-docx";

const TRAVEL_CONTRACT_SLUG = "utazasi-szerzodes";

const md = new MarkdownIt();

interface TextContentBlock {
  __component: string;
  content?: string;
}

export const getTravelContractAttachment = async (): Promise<{
  filename: string;
  content: Buffer;
} | null> => {
  const page = await strapi.documents("api::page.page").findFirst({
    filters: { slug: { $eq: TRAVEL_CONTRACT_SLUG } },
    status: "published",
    populate: { blocks: true },
  });

  const blocks = (page?.blocks ?? []) as TextContentBlock[];
  const markdown = blocks
    .filter((block) => block.__component === "blocks.text-content-block")
    .map((block) => block.content ?? "")
    .join("\n\n")
    .trim();

  if (!markdown) {
    console.warn(
      `Travel contract page ("${TRAVEL_CONTRACT_SLUG}") not found or has no text content — skipping attachment.`
    );
    return null;
  }

  const html = md.render(markdown);
  const result = await HTMLtoDOCX(html, undefined, {
    title: "Utazási szerződés",
  });
  const content = Buffer.isBuffer(result) ? result : Buffer.from(result as ArrayBuffer);

  return { filename: "utazasi-szerzodes.docx", content };
};
