"use client";

import React from "react";

interface CustomDotButtonProps {
  active: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

const CustomDotButton: React.FC<CustomDotButtonProps> = ({ active, onClick, ariaLabel }) => {
  return (
    <button
      className={`hero__dot${active ? " hero__dot--active" : ""}`}
      onClick={onClick}
      aria-label={ariaLabel}
      suppressHydrationWarning
    />
  );
};

export default CustomDotButton;
