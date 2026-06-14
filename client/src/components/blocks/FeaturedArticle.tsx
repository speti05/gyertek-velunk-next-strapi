import type { FeaturedArticleProps } from "@/types";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
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
        <ReactMarkdown className="paragraph-reset copy">{excerpt}</ReactMarkdown>
        <CustomLink href={link.href} color="inherit" underline="none">
          <CustomButton variant="contained" size="large">
            {link.text}
          </CustomButton>
        </CustomLink>
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
