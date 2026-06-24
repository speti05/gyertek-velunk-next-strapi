"use client";

import React from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { SxProps, Theme } from "@mui/material";

const stepperSx: SxProps<Theme> = {
  backgroundColor: "rgba(55, 127, 118, 0.6)",
  color: "white",
  width: "5rem",
  height: "5rem",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "rgba(55, 127, 118, 1)",
  },
  "& svg": {
    fontSize: "2.4rem",
    color: "white",
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
