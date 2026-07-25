"use client";

import React from "react";
import { CircularProgress, type CircularProgressProps } from "@mui/material";

const CustomCircularProgress: React.FC<CircularProgressProps> = (props) => {
  return <CircularProgress className="custom-circular-progress" {...props} />;
};

export default CustomCircularProgress;
