'use server'

import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
import { ARTICLES_LABEL, ARTICLES_SEARCH_LABEL } from "@/utils/texts";

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
  const { blocks } = await loader("blog");
  return (
    <div className="blog-page">
      <BlockRenderer blocks={blocks} />
      <ContentList
        pageParam="articlesPage"
        searchParams={await  searchParams}
        searchPlaceHolder={ARTICLES_SEARCH_LABEL}
        headline={ARTICLES_LABEL}
        featured={false}
        pageSize={9}
        path="/api/articles"
        component={BlogCard}
        showSearch
        query={query}
        showPagination
        page={page}
      />
    </div>
  );
}
