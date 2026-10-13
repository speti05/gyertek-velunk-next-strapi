import type { Ref } from "react";
import Image, { type ImageProps as NextImageProps } from "next/image";
import { getStrapiMediaURL } from "@/utils/get-strapi-url";

export type StrapiImageProps = Omit<NextImageProps, "src"> & {
  src: string;
  ref?: Ref<HTMLImageElement | null>;
};

export function StrapiImage({ src, alt, className, ...rest }: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;

  return <Image loading="eager" src={imageUrl} alt={alt} className={className} {...rest} />;
}

/** The height that keeps the media's own aspect ratio at `width`; `fallback` when its size is unknown. */
export function heightForWidth(
  media: { width?: number; height?: number },
  width: number,
  fallback: number
): number {
  if (!media.width || !media.height) return fallback;
  return Math.round((width * media.height) / media.width);
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return getStrapiMediaURL() + url;
}
