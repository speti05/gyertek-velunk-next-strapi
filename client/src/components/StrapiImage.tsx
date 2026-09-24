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

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return getStrapiMediaURL() + url;
}
