"use client";

import React from "react";
import CustomTooltip from "../custom-tooltip/custom-tooltip";
import { colors } from "@/sass/mui-override/colors";

interface MandatoryIndicatorProps {
  tooltipText: string;
}

export const MandatoryIndicator: React.FC<MandatoryIndicatorProps> = ({ tooltipText }) => {
  return (
    <CustomTooltip title={tooltipText}>
      <span style={{ color: colors.label.required, fontSize: "2rem" }}>*</span>
    </CustomTooltip>
  );
};
