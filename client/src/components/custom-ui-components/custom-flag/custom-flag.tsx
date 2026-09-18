"use client";

import React, { useId } from "react";
import type { Locale } from "@/i18n/config";

import { palette } from "@/sass/base/colors.generated";

type CustomFlagProps = {
  locale: Locale;
  /** Rendered diameter. Any CSS length; defaults to the surrounding font size. */
  size?: string | number;
  className?: string;
};

/** Flag artwork, each drawn in a 60x30 box. The id prefix keeps the clip paths of
 *  several flags on one page from colliding. */
const FLAGS: Record<Locale, (idPrefix: string) => React.ReactElement> = {
  hu: () => (
    <g>
      <rect width="60" height="10" fill={palette.flagHuRed} />
      <rect y="10" width="60" height="10" fill={palette.white} />
      <rect y="20" width="60" height="10" fill={palette.flagHuGreen} />
    </g>
  ),
  en: (idPrefix) => {
    // The red saltire is counterchanged: each of its arms sits on one side of the
    // white one only, so it is clipped to the four triangles around the centre.
    const clipId = `${idPrefix}-saltire`;
    return (
      <g>
        <clipPath id={clipId}>
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <rect width="60" height="30" fill={palette.flagGbBlue} />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke={palette.white} strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          stroke={palette.flagGbRed}
          strokeWidth="4"
          clipPath={`url(#${clipId})`}
        />
        <path d="M30,0 V30 M0,15 H60" stroke={palette.white} strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke={palette.flagGbRed} strokeWidth="6" />
      </g>
    );
  },
};

/**
 * Circular flag for a locale, drawn inline as SVG so it needs no network request and
 * stays crisp at any size.
 *
 * Every flag is authored in its native 60x30 proportions and then scaled to twice its
 * height inside a 60x60 viewBox, which fills the circle the way a flag pin does: the
 * left and right edges are cropped and the centre stays centred.
 *
 * Decorative by design - the switcher labels each flag with the language name, so the
 * image itself is hidden from assistive technology.
 */
const CustomFlag: React.FC<CustomFlagProps> = ({ locale, size = "1em", className }) => {
  const id = useId();
  const circleClipId = `${id}-circle`;

  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={circleClipId}>
        <circle cx="30" cy="30" r="30" />
      </clipPath>
      <g clipPath={`url(#${circleClipId})`}>
        <g transform="translate(-30 0) scale(2)">{FLAGS[locale](id)}</g>
      </g>
    </svg>
  );
};

export default CustomFlag;
