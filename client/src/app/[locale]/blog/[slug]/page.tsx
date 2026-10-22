"use server";

import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";

import type { Block, BlogProps } from "@/types";
import { notFound } from "next/navigation";
import { formatDate, getBlogDate } from "@/utils/format-date";
import { getContentBySlug } from "@/data/loaders";

import { BlockRenderer } from "@/components/BlockRenderer";
import { HeroSection } from "@/components/blocks/HeroSection";
import { ContentList } from "@/components/ContentList";
import { BlogPostCard } from "@/components/BlogPostCard";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/blogs");
  const blog = data[0];
  if (!blog) throw notFound();
  return { blog: blog as BlogProps, blocks: blog?.blocks };
}

interface BlogOverviewProps {
  headline: string;
  description?: string;
}

function BlogOverview({ headline, description }: Readonly<BlogOverviewProps>) {
  return (
    <div className="article-overview">
      <div className="article-overview__info">
        <h3 className="section-headline article-overview__headline">{headline}</h3>
        {description && <p className="article-overview__description">{description}</p>}
      </div>
    </div>
  );
}

export default async function SingleBlogPostRoute({ params, searchParams }: PageProps) {
  const locale = await getRequestLocale();
  const { BLOG_LABEL, ARTICLE_TABLE_OF_CONTENTS_LABEL } = getTexts(locale);
  const slug = (await params).slug;
  const { blog, blocks } = await loader(slug);
  const { title, author, description, image } = blog;
  const date = getBlogDate(blog);

  const tableOfContent = blocks?.filter((block: Block) => block.__component === "blocks.heading");

  return (
    <div>
      <HeroSection
        id={blog.id}
        heading={title}
        theme="brown"
        image={image}
        author={author}
        publishedAt={date ? formatDate(date, locale) : undefined}
        darken={true}
        tableOfContent={{ label: ARTICLE_TABLE_OF_CONTENTS_LABEL, items: tableOfContent ?? [] }}
      />

      <div className="container">
        <BlogOverview headline={title} description={description} />
        <BlockRenderer blocks={blocks} />
        <ContentList
          headline={BLOG_LABEL}
          contentCollectionType="blogs"
          searchParams={await searchParams}
          component={BlogPostCard}
        />
      </div>
    </div>
  );
}
