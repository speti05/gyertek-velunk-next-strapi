import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";
import { PictureGalleryProps } from "@/types";
import CustomGallery from "@/components/custom-ui-components/custom-gallery/custom-gallery";
import { EmptyContent } from "@/components/EmptyContent";

const ASPECT_RATIO_MODIFIER: Record<NonNullable<PictureGalleryProps["aspectRatio"]>, string> = {
  "16:9": "widescreen",
  "4:3": "standard",
  "1:1": "square",
};

export async function PictureGallery({
  title,
  description,
  images,
  aspectRatio = "16:9",
  autoplay = true,
  slideIntervalMs,
}: Readonly<PictureGalleryProps>) {
  const { PICTURE_GALLERY_EMPTY_TITLE, PICTURE_GALLERY_EMPTY_DESCRIPTION } = getTexts(await getRequestLocale());
  return (
    <div
      className={`article-picture-gallery article-picture-gallery--${ASPECT_RATIO_MODIFIER[aspectRatio]}`}
    >
      {title && <h3 className="article-picture-gallery__title">{title}</h3>}
      {description && <p className="article-picture-gallery__description">{description}</p>}
      {images?.length ? (
        <div className="article-picture-gallery__frame">
          <CustomGallery images={images} autoplay={autoplay} slideIntervalMs={slideIntervalMs} />
        </div>
      ) : (
        <EmptyContent
          title={PICTURE_GALLERY_EMPTY_TITLE}
          description={PICTURE_GALLERY_EMPTY_DESCRIPTION}
        />
      )}
    </div>
  );
}
