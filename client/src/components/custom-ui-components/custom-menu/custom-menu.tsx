"use client";

import React from "react";
import Menu, { type MenuProps } from "@mui/material/Menu";
import MenuItem, { type MenuItemProps } from "@mui/material/MenuItem";

/**
 * Dropdown menu wrapper. `disableScrollLock` is on by default: MUI otherwise pads the
 * body to compensate for the hidden scrollbar while the menu is open, which shifts the
 * fixed header sideways for the duration of the animation.
 */
export const CustomMenu: React.FC<MenuProps> = ({ children, ...props }) => (
  <Menu disableScrollLock {...props}>
    {children}
  </Menu>
);

export const CustomMenuItem: React.FC<MenuItemProps> = ({ children, className, ...props }) => (
  <MenuItem className={["no-list-style", className].filter(Boolean).join(" ")} {...props}>
    {children}
  </MenuItem>
);

export default CustomMenu;
