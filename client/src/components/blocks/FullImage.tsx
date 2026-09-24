import { FullImageProps } from "@/types";
import { MagnifiableImage } from "@/components/MagnifiableImage";

export function FullImage({ image }: Readonly<FullImageProps>) {
  return (
    <div className="article-image">
      <MagnifiableImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        width={1920}
        height={1080}
        className="article-image__image"
        withSkeleton
        isMagnifyEnabled
      />
    </div>
  );
}
