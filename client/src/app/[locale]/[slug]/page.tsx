"use server";

import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";
import { PageParams } from "@/types";
import { ContentListHeadline } from "@/components/ContentListHeadline";

async function loader(slug: string) {
  const { data } = await getPageBySlug(slug);
  if (!data?.length) {
    return notFound();
  }
  return { blocks: data[0]?.blocks, title: data[0]?.title as string };
}

export default async function DynamicPageRoute({ params, searchParams }: PageParams) {
  const slug = (await params).slug;
  const { blocks, title } = await loader(slug);
  return (
    <>
      <ContentListHeadline headline={title} isMain={true} />
      <BlockRenderer blocks={blocks} searchParams={await searchParams} />
    </>
  );
}
