// have to force dynamic
// use server is only for Server Action Files only
// page components are already server-side by default in the App Router without it

//export const dynamic = 'force-dynamic';

import { getPageBySlug } from "@/data/loaders";
import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";

async function loader(slug: string) {
  const result = await getPageBySlug(slug);
  if (!result) notFound();
  const { data } = result;
  if (!data?.length) notFound();
  return { blocks: data[0]?.blocks };
}

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string }>;
}
export default async function BlogListRoute({ searchParams }: PageProps) {
  const { BLOG_PAGE_SLUG } = getTexts(await getRequestLocale());
  const { blocks } = await loader(BLOG_PAGE_SLUG);
  return <BlockRenderer blocks={blocks} searchParams={await searchParams} />;
}
