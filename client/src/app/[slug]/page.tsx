'use server'

import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";
import { PageParams } from "@/types";

async function loader(slug: string) {
  const { data } = await getPageBySlug(slug);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}

export default async function DynamicPageRoute({ params, searchParams }: PageParams) {
  const slug = (await params).slug;
  const { blocks } = await loader(slug);
  return <BlockRenderer blocks={blocks} searchParams={await searchParams}/>;
}