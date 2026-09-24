"use client";

import React from "react";
import { Skeleton, type SkeletonProps } from "@mui/material";

const CustomSkeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  animation = "wave",
  className,
  ...props
}) => {
  return (
    <Skeleton
      className={`custom-skeleton${className ? ` ${className}` : ""}`}
      variant={variant}
      animation={animation}
      {...props}
    />
  );
};

export default CustomSkeleton;
