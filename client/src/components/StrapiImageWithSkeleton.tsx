"use client";

import React, { useCallback, useState } from "react";
import { StrapiImage, type StrapiImageProps } from "@/components/StrapiImage";
import CustomSkeleton from "@/components/custom-ui-components/custom-skeleton/custom-skeleton";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
import CustomCircularProgress from "@/components/custom-ui-components/custom-circular-progress/custom-circular-progress";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface StrapiImageWithSkeletonProps extends Omit<StrapiImageProps, "ref"> {
  /** Extra classes for the placeholder - a border radius, mostly, so it matches the image. */
  skeletonClassName?: string;
}

/**
 * A StrapiImage that keeps a placeholder over its own box until the file has arrived.
 * The placeholder is absolutely positioned, so the container the image sits in has to
 * establish a positioning context (see `.image-skeleton` in sass/components).
 */
export function StrapiImageWithSkeleton({
  skeletonClassName,
  onLoad,
  onError,
  ...imageProps
}: Readonly<StrapiImageWithSkeletonProps>) {
  const [loaded, setLoaded] = useState(false);

  // A cached image may finish before hydration and fire no load event, so the element is asked on attach
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) setLoaded(true);
  }, []);

  // No file to wait for: the placeholder stays, without the spinner that promises one
  if (!imageProps.src) {
    return (
      <ImagePlaceholder
        alt={imageProps.alt}
        className={imageProps.className}
        skeletonClassName={skeletonClassName}
        width={imageProps.width}
        height={imageProps.height}
      />
    );
  }

  return (
    <>
      {!loaded && (
        <span
          className={`image-skeleton${skeletonClassName ? ` ${skeletonClassName}` : ""}`}
          aria-hidden
        >
          <CustomSkeleton />
          {/* A bare grey box reads as a hole in the layout. The picture icon says what
              belongs here and the spinner says it is still on its way. */}
          <span className="image-skeleton__marks">
            <CustomIcon name="image" className="image-skeleton__icon" />
            <CustomCircularProgress className="image-skeleton__spinner" size="3.2rem" />
          </span>
        </span>
      )}
      <StrapiImage
        {...imageProps}
        ref={imageRef}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        // A broken image must drop the placeholder too, otherwise it hides the
        // browser's own broken-image state behind a box that never resolves.
        onError={(event) => {
          setLoaded(true);
          onError?.(event);
        }}
      />
    </>
  );
}
