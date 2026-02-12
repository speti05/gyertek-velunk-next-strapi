'use server'

import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { FEATURED_ARTICLES_LABEL, FEATURED_ARTICLES_SEARCH_LABEL } from "@/utils/texts";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  return { ...data.data };
}

interface ParamsProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function HomeRoute({
  params,
  searchParams,
}: ParamsProps) {
  const data = await loader();
  const blocks = data?.blocks || [];
  return (
    <div>
      <BlockRenderer blocks={blocks} />
      <div className="container">
        <ContentList
          searchParams={await searchParams}
          searchPlaceHolder={FEATURED_ARTICLES_SEARCH_LABEL}
          pageParam="articlesPage"
          headline={FEATURED_ARTICLES_LABEL}
          path="/api/articles"
          component={BlogCard}
          showPagination
          featured
        />
        <ContentList
          searchParams={await searchParams}
          searchPlaceHolder={FEATURED_ARTICLES_SEARCH_LABEL}
          pageParam="eventsPage"
          headline={FEATURED_ARTICLES_LABEL}
          path="/api/events"
          component={EventCard}
          showPagination
          featured
        />
      </div>
    </div>
  );
}
