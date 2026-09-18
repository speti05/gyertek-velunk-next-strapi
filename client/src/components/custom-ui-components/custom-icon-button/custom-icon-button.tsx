"use client";

import React from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { SxProps, Theme } from "@mui/material";
import { rgba } from "polished";

import { palette } from "@/sass/base/colors.generated";

const stepperSx: SxProps<Theme> = {
  backgroundColor: rgba(palette.darkGreen, 0.6),
  color: palette.white,
  width: "5rem",
  height: "5rem",
  // sx outranks the theme, so the touch size the theme gives every other icon button
  // has to be restated here; 5rem would shrink to 45px once the root font-size drops
  "@media (max-width: 75em)": {
    minWidth: "48px",
    minHeight: "48px",
  },
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: palette.darkGreen,
  },
  "& svg": {
    fontSize: "2.4rem",
    color: palette.white,
  },
};

type CustomIconButtonType = IconButtonProps["type"] | "stepper";

type CustomIconButtonProps = Omit<IconButtonProps, "type"> & {
  type?: CustomIconButtonType;
};

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  children,
  type,
  sx,
  ...props
}) => {
  const isStepper = type === "stepper";
  const nativeType = isStepper ? "button" : (type as IconButtonProps["type"]);

  return (
    <IconButton
      type={nativeType}
      sx={isStepper ? { ...stepperSx, ...sx } : sx}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </IconButton>
  );
};

export default CustomIconButton;
