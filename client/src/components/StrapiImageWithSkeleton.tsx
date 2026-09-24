"use client";

import React, { useEffect, useRef, useState } from "react";
import { StrapiImage, type StrapiImageProps } from "@/components/StrapiImage";
import CustomSkeleton from "@/components/custom-ui-components/custom-skeleton/custom-skeleton";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
import CustomCircularProgress from "@/components/custom-ui-components/custom-circular-progress/custom-circular-progress";

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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish before this component hydrates, and a load that already
  // happened fires no event - so once mounted the element itself has to be asked
  // whether it is done, or the placeholder would sit there forever.
  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);

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
