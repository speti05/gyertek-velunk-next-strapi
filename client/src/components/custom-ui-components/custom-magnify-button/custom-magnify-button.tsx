"use client";

import React from "react";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";

interface CustomMagnifyButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

/**
 * The control that opens an image full screen. It covers the whole picture rather than
 * only the badge it draws, so a click anywhere on the image opens it while there is still
 * a single focusable control behind that gesture. The badge it shows waits for hover;
 * where there is no hover to wait for it stays visible, so a phone still tells the reader
 * which pictures can be enlarged. Both rules live in `sass/components/_magnifiable-image.scss`.
 */
const CustomMagnifyButton: React.FC<CustomMagnifyButtonProps> = ({ onClick, ariaLabel }) => {
  return (
    <button
      type="button"
      className="magnify-trigger"
      onClick={onClick}
      aria-label={ariaLabel}
      suppressHydrationWarning
    >
      <span className="magnify-trigger__badge" aria-hidden>
        <CustomIcon name="zoomIn" className="magnify-trigger__icon" />
      </span>
    </button>
  );
};

export default CustomMagnifyButton;
