"use client";

import React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";

// MUI only types `component` through its polymorphic generic, so it is re-declared for the wrapper
type CustomTypographyProps = TypographyProps & { component?: React.ElementType };

const CustomTypography: React.FC<CustomTypographyProps> = (props) => {
  return <Typography {...props} />;
};

export default CustomTypography;
