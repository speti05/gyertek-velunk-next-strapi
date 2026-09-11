"use client";

import { useState } from "react";

import { StrapiImage } from "@/components/StrapiImage";
import CustomIconButton from "@/components/custom-ui-components/custom-icon-button/custom-icon-button";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { ImageProps, LinkProps } from "@/types";
import { EMPTY_REASON_CLOSE_LABEL } from "@/utils/texts";

interface EmptyReasonOverlayProps {
  title: string;
  text: string;
  backgroundImage?: ImageProps | null;
  links?: LinkProps[];
}

export function EmptyReasonOverlay({
  title,
  text,
  backgroundImage,
  links,
}: Readonly<EmptyReasonOverlayProps>) {
  const [isClosing, setIsClosing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  return (
    <div
      className={`empty-reason-overlay${isClosing ? " empty-reason-overlay--closing" : ""}`}
      // The panel's own transform transition bubbles up here too, so only the wrapper
      // finishing its collapse is allowed to unmount the overlay.
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget) setIsClosed(true);
      }}
    >
      <div className="empty-reason-overlay__clip">
        <div
          className={`empty-reason-overlay__panel${
            backgroundImage?.url ? " empty-reason-overlay__panel--with-image" : ""
          }`}
        >
          {backgroundImage?.url && (
            <StrapiImage
              src={backgroundImage.url}
              alt={backgroundImage.alternativeText ?? ""}
              className="empty-reason-overlay__image"
              fill
              sizes="100vw"
            />
          )}
          <CustomIconButton
            className="empty-reason-overlay__close"
            aria-label={EMPTY_REASON_CLOSE_LABEL}
            onClick={() => setIsClosing(true)}
          >
            <CustomIcon name="close" />
          </CustomIconButton>
          <div className="empty-reason-overlay__content">
            <h3 className="empty-reason-overlay__title">{title}</h3>
            <p className="empty-reason-overlay__text">{text}</p>
            {!!links?.length && (
              <div className="empty-reason-overlay__buttons">
                {links.map((link) => (
                  <CustomLink
                    key={link.id}
                    href={link.href}
                    target={link.isExternal ? "_blank" : "_self"}
                    color="inherit"
                    underline="none"
                  >
                    <CustomButton
                      variant="contained"
                      size="large"
                      color={link.buttonColor ?? "primary"}
                    >
                      {link.text}
                    </CustomButton>
                  </CustomLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
