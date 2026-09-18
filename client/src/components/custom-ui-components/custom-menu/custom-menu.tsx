"use client";

import React from "react";
import Menu, { type MenuProps } from "@mui/material/Menu";
import MenuItem, { type MenuItemProps } from "@mui/material/MenuItem";
import type { SxProps, Theme } from "@mui/material";

import { palette } from "@/sass/base/colors.generated";

/**
 * Green surface for menus that drop out of the header, so the sheet reads as part of
 * the bar it hangs from rather than as a white card floating over it.
 *
 * Every colour is declared on the paper, never on the entries. MUI's MenuItem sets no
 * colour of its own, so the entries inherit the white below; the two backgrounds
 * travel down as inherited custom properties. Both then bend to a plain rule on a
 * single entry - an inherited value always loses to one declared on the element
 * itself - which a descendant selector written from the paper could never do, however
 * the stylesheets happen to be ordered. A destructive entry recolours its own hover
 * with `--custom-menu-hover-background` and nothing else has to change.
 */
const primaryPaperSx: SxProps<Theme> = {
  backgroundColor: palette.darkGreen,
  color: palette.white,
  "--custom-menu-hover-background": palette.midGreen,
  "--custom-menu-selected-background": palette.deepGreen,

  "& .MuiMenuItem-root": {
    "&:hover": {
      backgroundColor: "var(--custom-menu-hover-background)",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "var(--custom-menu-hover-background)",
    },
    "&.Mui-selected": {
      backgroundColor: "var(--custom-menu-selected-background)",
      "&:hover": {
        backgroundColor: "var(--custom-menu-hover-background)",
      },
    },
  },
};

type CustomMenuProps = MenuProps & {
  /** "primary" paints the sheet in the header's green instead of the default paper. */
  color?: "default" | "primary";
};

/**
 * Dropdown menu wrapper. `disableScrollLock` is on by default: MUI otherwise pads the
 * body to compensate for the hidden scrollbar while the menu is open, which shifts the
 * fixed header sideways for the duration of the animation.
 */
export const CustomMenu: React.FC<CustomMenuProps> = ({
  children,
  color = "default",
  slotProps,
  ...props
}) => {
  const paperSlotProps = slotProps?.paper;

  return (
    <Menu
      disableScrollLock
      {...props}
      slotProps={
        color === "primary"
          ? {
              ...slotProps,
              // a caller's own paper props are kept; only the palette is added
              paper:
                typeof paperSlotProps === "function"
                  ? paperSlotProps
                  : { ...paperSlotProps, sx: primaryPaperSx },
            }
          : slotProps
      }
    >
      {children}
    </Menu>
  );
};

export const CustomMenuItem: React.FC<MenuItemProps> = ({ children, className, ...props }) => (
  <MenuItem className={["no-list-style", className].filter(Boolean).join(" ")} {...props}>
    {children}
  </MenuItem>
);

export default CustomMenu;
