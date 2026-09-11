"use client";

import React from "react";
import MuiLink, { type LinkProps as MuiLinkProps } from "@mui/material/Link";
import NextLink from "next/link";

type CustomLinkProps = Omit<MuiLinkProps, "href" | "underline"> & {
  href: string;
  prefetch?: boolean;
  underline?: "none" | "hover" | "always";
  isHoverScaled?: boolean;
};

const HOVER_SCALE_SX = {
  transition: "transform 0.3s ease",
  "&:hover": { transform: "scale(1.05)" },
} as const;

const CustomLink: React.FC<CustomLinkProps> = ({
  color = "inherit",
  underline = "always",
  isHoverScaled = false,
  href,
  target,
  rel,
  sx,
  ...props
}) => {
  const resolvedSx = isHoverScaled ? { ...HOVER_SCALE_SX, ...(sx as object) } : sx;

  // Strapi lets an editor save a link with an empty href. next/link throws on a
  // null href ("Cannot destructure property 'auth' of 'urlObj'"), which takes the
  // whole page down, so render the label without navigation instead.
  if (!href) {
    return (
      <MuiLink
        component="span"
        color={color}
        style={{ display: "inline-block" }}
        underline="none"
        suppressHydrationWarning
        sx={resolvedSx}
        {...props}
      />
    );
  }

  return (
    <MuiLink
      component={NextLink}
      href={href}
      target={target}
      rel={rel}
      color={color}
      style={{ display: "inline-block" }}
      underline={underline}
      suppressHydrationWarning
      sx={resolvedSx}
      {...props}
    />
  );
};

export default CustomLink;
