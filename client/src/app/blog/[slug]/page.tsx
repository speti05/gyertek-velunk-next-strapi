"use server";

import type { Block, BlogProps } from "@/types";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format-date";
import { getContentBySlug } from "@/data/loaders";

import { BlockRenderer } from "@/components/BlockRenderer";
import { HeroSection } from "@/components/blocks/HeroSection";
import { ContentList } from "@/components/ContentList";
import { BlogPostCard } from "@/components/BlogPostCard";
import { BLOG_LABEL } from "@/utils/texts";

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
  description: string;
  tableOfContent: { heading: string; linkId: string }[];
}

function BlogOverview({ headline, description, tableOfContent }: Readonly<BlogOverviewProps>) {
  return (
    <div className="article-overview">
      <div className="article-overview__info">
        <h3 className="article-overview__headline">{headline}</h3>
        <p className="article-overview__description">{description}</p>
      </div>
      {tableOfContent && (
        <ul className="article-overview__contents">
          {tableOfContent.map((item, index) => (
            <li key={index}>
              <CustomLink href={`#${item.linkId}`} className="article-overview__link" color="primary">
                {index + 1}. {item.heading}
              </CustomLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function SingleBlogPostRoute({ params, searchParams }: PageProps) {
  const slug = (await params).slug;
  const { blog, blocks } = await loader(slug);
  const { title, author, publishedAt, description, image } = blog;

  const tableOfContent = blocks?.filter((block: Block) => block.__component === "blocks.heading");

  return (
    <div>
      <HeroSection
        id={blog.id}
        heading={title}
        theme="brown"
        image={image}
        author={author}
        publishedAt={formatDate(publishedAt)}
        darken={true}
      />

      <div className="container">
        <BlogOverview
          headline={title}
          description={description}
          tableOfContent={tableOfContent}
        />
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
