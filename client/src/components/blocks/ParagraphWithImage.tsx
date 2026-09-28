import { MarkdownContent } from "@/components/MarkdownContent";
import { MagnifiableImage } from "@/components/MagnifiableImage";
import { ParagraphWithImageProps } from "@/types";

export function ParagraphWithImage({
  content,
  image,
  reversed,
  imageLandscape,
}: Readonly<ParagraphWithImageProps>) {
  return (
    <div
      className={`article-text-image ${reversed ? "article-text-image--reversed" : ""} ${imageLandscape ? "" : "article-text-image--portrait"}`}
    >
      <MarkdownContent className="paragraph-reset copy article-text-image__text article-paragraph">
        {content}
      </MarkdownContent>
      <div className="article-text-image__container">
        <MagnifiableImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          width={1920}
          height={1080}
          className="article-text-image__image"
          withSkeleton
          isMagnifyEnabled
        />
      </div>
    </div>
  );
}
