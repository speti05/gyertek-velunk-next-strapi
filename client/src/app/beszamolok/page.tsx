'use server'

import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";

async function loader(slug: string) {
  const { data } = await getPageBySlug(slug);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string }>
}
export default async function BlogRoute({ searchParams }: PageProps) {
  const { page, query } = await searchParams;
  const { blocks } = await loader("beszamolok");
  return (
    <div className="blog-page">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
