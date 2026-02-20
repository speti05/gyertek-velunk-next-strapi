'use server'

import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { FEATURED_ARTICLES_LABEL, FEATURED_ARTICLES_SEARCH_LABEL, FEATURED_EVENTS_LABEL, FEATURED_EVENTS_SEARCH_LABEL } from "@/utils/texts";
import { PageParams } from "@/types";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  return { ...data.data };
}

export default async function HomeRoute({
  searchParams,
}: PageParams) {
  const data = await loader();
  const blocks = data?.blocks || [];
  return (
    <div>
      <BlockRenderer blocks={blocks} searchParams={await searchParams}/>
      
      {/* <div className="container">
        <ContentList
          searchParams={{ page, query }}
          searchPlaceHolder={FEATURED_ARTICLES_SEARCH_LABEL}
          pageParam="articlesPage"
          headline={FEATURED_ARTICLES_LABEL}
          path="/api/articles"
          component={BlogCard}
          showPagination
          featured
        />
        <ContentList
          searchParams={{ page, query }}
          searchPlaceHolder={FEATURED_EVENTS_SEARCH_LABEL}
          pageParam="eventsPage"
          headline={FEATURED_EVENTS_LABEL}
          path="/api/events"
          component={EventCard}
          showPagination
          featured
        />
      </div> */}
    </div>
  );
}
