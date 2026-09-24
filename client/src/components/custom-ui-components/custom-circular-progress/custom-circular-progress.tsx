"use client";

import React from "react";
import { CircularProgress, type CircularProgressProps } from "@mui/material";

const CustomCircularProgress: React.FC<CircularProgressProps> = ({ className, ...props }) => {
  return <CircularProgress className={`custom-circular-progress${className ? ` ${className}` : ""}`} {...props} />;
};

export default CustomCircularProgress;
