"use client";

import React from "react";
import Switch, { SwitchProps } from "@mui/material/Switch";

const CustomSwitch: React.FC<SwitchProps> = ({ size = "medium", ...props }) => {
  return <Switch size={size} {...props} />;
};

export default CustomSwitch;
