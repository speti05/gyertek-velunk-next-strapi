import { draftMode } from "next/headers";

export type PreviewContext = {
  isDraft: boolean;
  /** Strapi `status` query param. Left undefined so Strapi falls back to published. */
  status?: "draft";
};

const PUBLISHED: PreviewContext = { isDraft: false };

/**
 * Resolves whether the current render is a Strapi preview (Next draft mode).
 * draftMode() throws outside a request scope - during static generation there is
 * no preview, so published content is the correct answer.
 */
export async function getPreviewContext(): Promise<PreviewContext> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled ? { isDraft: true, status: "draft" } : PUBLISHED;
  } catch {
    return PUBLISHED;
  }
}

/**
 * Fetch options for draft reads: the data cache must never hand back a published
 * response while previewing.
 */
export function previewFetchOptions(preview: PreviewContext) {
  if (!preview.isDraft) return {};
  return { cache: "no-store" as const };
}
