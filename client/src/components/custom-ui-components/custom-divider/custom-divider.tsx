"use client";

import React from "react";
import Divider, { DividerProps } from "@mui/material/Divider";

const CustomDivider: React.FC<DividerProps> = (props) => {
  return <Divider {...props} />;
};

export default CustomDivider;
