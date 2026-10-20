import CustomSkeleton from "@/components/custom-ui-components/custom-skeleton/custom-skeleton";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";

interface ImagePlaceholderProps {
  alt?: string;
  /** The classes the missing image would have carried, so the stand-in takes its place in the layout. */
  className?: string;
  skeletonClassName?: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
}

/**
 * What renders where an image belongs but Strapi sent none (a media field left empty, or a
 * locale saved without its picture). It wears the loading placeholder's face without the
 * spinner, so a missing picture reads as a picture-shaped gap rather than breaking the page.
 *
 * Unlike the loading placeholder it sits in flow: there is no image underneath to give the
 * box its size, so the requested width and height set its aspect ratio instead.
 */
export function ImagePlaceholder({ alt, className, skeletonClassName, width, height }: Readonly<ImagePlaceholderProps>) {
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <span
      className={`image-placeholder${className ? ` ${className}` : ""}`}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      <span className={`image-skeleton${skeletonClassName ? ` ${skeletonClassName}` : ""}`} aria-hidden>
        <CustomSkeleton animation={false} />
        <span className="image-skeleton__marks">
          <CustomIcon name="image" className="image-skeleton__icon" />
        </span>
      </span>
    </span>
  );
}
