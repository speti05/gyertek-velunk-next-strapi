"use client";

import React from "react";
import { Chip, type ChipProps } from "@mui/material";

type CustomChipColor = "success" | "warning" | "error" | "default";
type CustomChipSize = "small" | "medium" | "large";

interface CustomChipProps extends Omit<ChipProps, "color" | "size"> {
  label: string;
  color?: CustomChipColor;
  size?: CustomChipSize;
}

const CustomChip: React.FC<CustomChipProps> = ({ label, color = "default", size = "small", ...props }) => {
  return <Chip label={label} color={color} size={size} {...props} />;
};

export default CustomChip;
