"use client";

import React, { useState } from "react";
import { useTexts } from "@/context/locale-context";
import { StrapiImage, type StrapiImageProps } from "@/components/StrapiImage";
import { StrapiImageWithSkeleton } from "@/components/StrapiImageWithSkeleton";
import CustomMagnifyButton from "@/components/custom-ui-components/custom-magnify-button/custom-magnify-button";
import CustomLightbox from "@/components/custom-ui-components/custom-lightbox/custom-lightbox";

// What the enlarged copy is asked for at. The overlay scales it down to whatever the
// viewport allows, so this only has to be large enough not to be the limit itself.
const LIGHTBOX_IMAGE_WIDTH = 1920;
const LIGHTBOX_IMAGE_HEIGHT = 1080;

interface MagnifiableImageProps extends Omit<StrapiImageProps, "ref"> {
  /** Off renders the plain image: no badge, no overlay, and no control in the tab order. */
  isMagnifyEnabled?: boolean;
  /** Whether the in-page copy waits behind a placeholder while it loads. */
  withSkeleton?: boolean;
  skeletonClassName?: string;
  /** Extra classes for the frame, which is what carries the image's own size. */
  frameClassName?: string;
}

/**
 * An image that can be opened full screen. The frame around it is always rendered, magnify
 * enabled or not, so a block's layout does not depend on the setting - the frame is also
 * what the badge and the placeholder are positioned against.
 */
export function MagnifiableImage({
  isMagnifyEnabled = false,
  withSkeleton = false,
  skeletonClassName,
  frameClassName,
  ...imageProps
}: Readonly<MagnifiableImageProps>) {
  const { IMAGE_MAGNIFY_ARIA, IMAGE_LIGHTBOX_ARIA } = useTexts();
  const [open, setOpen] = useState(false);

  return (
    <div className={`magnifiable-image${frameClassName ? ` ${frameClassName}` : ""}`}>
      {withSkeleton ? (
        <StrapiImageWithSkeleton skeletonClassName={skeletonClassName} {...imageProps} />
      ) : (
        <StrapiImage {...imageProps} />
      )}

      {isMagnifyEnabled && (
        <>
          <CustomMagnifyButton onClick={() => setOpen(true)} ariaLabel={IMAGE_MAGNIFY_ARIA} />
          <CustomLightbox
            open={open}
            onClose={() => setOpen(false)}
            ariaLabel={IMAGE_LIGHTBOX_ARIA}
          >
            <StrapiImage
              src={imageProps.src}
              alt={imageProps.alt}
              width={LIGHTBOX_IMAGE_WIDTH}
              height={LIGHTBOX_IMAGE_HEIGHT}
              sizes="100vw"
              className="lightbox__image"
            />
          </CustomLightbox>
        </>
      )}
    </div>
  );
}
