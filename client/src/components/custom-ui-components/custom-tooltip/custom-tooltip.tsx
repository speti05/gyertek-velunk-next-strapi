"use client";

import React from "react";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";

const CustomTooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  return <Tooltip {...props}>{children}</Tooltip>;
};

export default CustomTooltip;
