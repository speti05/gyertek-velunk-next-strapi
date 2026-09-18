"use server";

import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";

import type { ArticleProps, Block } from "@/types";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format-date";
import { getContentBySlug } from "@/data/loaders";

import { BlockRenderer } from "@/components/BlockRenderer";
import { HeroSection } from "@/components/blocks/HeroSection";
import { Card, type CardProps } from "@/components/Card";
import { ContentList } from "@/components/ContentList";
import { Route } from "@/i18n/config";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/articles");
  const article = data[0];
  if (!article) throw notFound();
  return { article: article as ArticleProps, blocks: article?.blocks };
}

interface ArticleOverviewProps {
  headline: string;
  description?: string;
  tableOfContent: { heading: string; linkId: string }[];
}

function ArticleOverview({
  headline,
  description,
  tableOfContent,
}: Readonly<ArticleOverviewProps>) {
  return (
    <div className="article-overview">
      <div className="article-overview__info">
        <h3 className="section-headline article-overview__headline">{headline}</h3>
        {description && <p className="article-overview__description">{description}</p>}
      </div>
      {tableOfContent && (
        <ul className="article-overview__contents no-list-style">
          {tableOfContent.map((item, index) => (
            <li key={index}>
              <CustomLink
                href={`#${item.linkId}`}
                className="article-overview__link"
                color="primary"
              >
                {index + 1}. {item.heading}
              </CustomLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const BlogCard = (props: Readonly<Omit<CardProps, "basePath">>) => <Card {...props} basePath={Route.Reports} />;

export default async function SingleBlogRoute({ params, searchParams }: PageProps) {
  const locale = await getRequestLocale();
  const { FEATURED_ARTICLES_LABEL } = getTexts(locale);
  const slug = (await params).slug;
  const { article, blocks } = await loader(slug);
  const { title, author, publishedAt, description, image } = article;

  console.dir(blocks, { depth: null });

  const tableOfContent = blocks?.filter((block: Block) => block.__component === "blocks.heading");

  return (
    <div>
      <HeroSection
        id={article.id}
        heading={title}
        theme="brown"
        image={image}
        author={author}
        publishedAt={formatDate(publishedAt, locale)}
        darken={true}
      />

      <div className="container">
        <ArticleOverview
          headline={title}
          description={description}
          tableOfContent={tableOfContent}
        />
        <BlockRenderer blocks={blocks} />
        <ContentList
          headline={FEATURED_ARTICLES_LABEL}
          contentCollectionType="articles"
          searchParams={await searchParams}
          component={BlogCard}
          featured={true}
        />
      </div>
    </div>
  );
}
