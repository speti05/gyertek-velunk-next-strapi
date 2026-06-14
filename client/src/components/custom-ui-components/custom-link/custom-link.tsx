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
  sx,
  ...props
}) => {
  return (
    <MuiLink
      component={NextLink}
      color={color}
      style={{ display: "inline-block" }}
      underline={underline}
      suppressHydrationWarning
      sx={isHoverScaled ? { ...HOVER_SCALE_SX, ...(sx as object) } : sx}
      {...props}
    />
  );
};

export default CustomLink;
