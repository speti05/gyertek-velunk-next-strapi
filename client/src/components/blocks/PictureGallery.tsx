import { PictureGalleryProps } from "@/types";
import CustomGallery from "@/components/custom-ui-components/custom-gallery/custom-gallery";

const ASPECT_RATIO_MODIFIER: Record<NonNullable<PictureGalleryProps["aspectRatio"]>, string> = {
  "16:9": "widescreen",
  "4:3": "standard",
  "1:1": "square",
};

export function PictureGallery({
  title,
  description,
  images,
  aspectRatio = "16:9",
  autoplay = true,
  slideIntervalMs,
}: Readonly<PictureGalleryProps>) {
  if (!images?.length) return null;

  return (
    <div
      className={`article-picture-gallery article-picture-gallery--${ASPECT_RATIO_MODIFIER[aspectRatio]}`}
    >
      {title && <h3 className="article-picture-gallery__title">{title}</h3>}
      {description && <p className="article-picture-gallery__description">{description}</p>}
      <div className="article-picture-gallery__frame">
        <CustomGallery images={images} autoplay={autoplay} slideIntervalMs={slideIntervalMs} />
      </div>
    </div>
  );
}
