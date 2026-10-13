"use client";

import React from "react";
import Box, { BoxProps } from "@mui/material/Box";

const CustomBox: React.FC<BoxProps> = (props) => {
  return <Box {...props} />;
};

export default CustomBox;
