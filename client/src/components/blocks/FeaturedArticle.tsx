import type { FeaturedArticleProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "@/components/StrapiImage";
import ReactMarkdown from "react-markdown";
import CustomButton from "../custom-ui-components/custom-button/custom-button";

export function FeaturedArticle({
  headline,
  link,
  excerpt,
  image,
}: Readonly<FeaturedArticleProps>) {
  return (
    <article className="featured-article container">
      <div className="featured-article__info">
        <h3>{headline}</h3>
        <ReactMarkdown className="copy">{excerpt}</ReactMarkdown>
        <Link href={link.href}>
          <CustomButton
            variant="contained"
            size="large">
            {link.text}
          </CustomButton>
        </Link>
      </div>
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        height={200}
        width={300}
      />
    </article>
  );
}
