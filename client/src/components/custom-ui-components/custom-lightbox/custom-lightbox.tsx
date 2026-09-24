"use client";

import React from "react";
import Modal from "@mui/material/Modal";
import { useTexts } from "@/context/locale-context";
import CustomIconButton from "@/components/custom-ui-components/custom-icon-button/custom-icon-button";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";

interface CustomLightboxProps {
  open: boolean;
  onClose: () => void;
  /** Describes what is being shown, for readers who never see the picture. */
  ariaLabel: string;
  children: React.ReactNode;
}

/**
 * The fullscreen surface an enlarged image or gallery is shown on. MUI's Modal carries
 * the parts that are easy to get wrong by hand - the portal, the focus trap, Escape, and
 * the scroll lock on the page behind - while the dark backdrop and the layout of the
 * stage belong to `sass/components/_lightbox.scss`.
 */
const CustomLightbox: React.FC<CustomLightboxProps> = ({ open, onClose, ariaLabel, children }) => {
  const { LIGHTBOX_CLOSE_ARIA } = useTexts();

  return (
    <Modal open={open} onClose={onClose} className="lightbox" aria-label={ariaLabel}>
      {/* Clicking the surface itself - the space around the picture - closes the
          overlay; a click that lands on the picture or a control must not. */}
      <div
        className="lightbox__surface"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <CustomIconButton
          className="lightbox__close"
          onClick={onClose}
          aria-label={LIGHTBOX_CLOSE_ARIA}
        >
          <CustomIcon name="close" />
        </CustomIconButton>
        <div className="lightbox__stage">{children}</div>
      </div>
    </Modal>
  );
};

export default CustomLightbox;
