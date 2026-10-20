import type { Ref } from "react";
import Image, { type ImageProps as NextImageProps } from "next/image";
import { getStrapiMediaURL } from "@/utils/get-strapi-url";

export type StrapiImageProps = Omit<NextImageProps, "src"> & {
  /** Strapi sends null for an empty media field; nothing is rendered then. */
  src: string | null | undefined;
  ref?: Ref<HTMLImageElement | null>;
};

export function StrapiImage({ src, alt, className, ...rest }: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;

  return <Image loading="eager" src={imageUrl} alt={alt} className={className} {...rest} />;
}

/** The height that keeps the media's own aspect ratio at `width`; `fallback` when its size is unknown. */
export function heightForWidth(
  media: { width?: number; height?: number } | null | undefined,
  width: number,
  fallback: number
): number {
  if (!media?.width || !media.height) return fallback;
  return Math.round((width * media.height) / media.width);
}

export function getStrapiMedia(url: string | null | undefined) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return getStrapiMediaURL() + url;
}
