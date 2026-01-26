'use server'

import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  return { ...data.data };
}

const FEATURED_ARTICLES_LABEL = "Kiemelt beszámolók";

export default async function HomeRoute() {
  const data = await loader();
  const blocks = data?.blocks || [];
  return (
    <div>
      <BlockRenderer blocks={blocks} />
      <div className="container">
        <ContentList
          headline={FEATURED_ARTICLES_LABEL}
          path="/api/articles"
          component={BlogCard}
          featured
        />
      </div>
    </div>
  );
}
