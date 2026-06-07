"use client";

import React from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

const CustomIconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
  return <IconButton {...props}>{children}</IconButton>;
};

export default CustomIconButton;
