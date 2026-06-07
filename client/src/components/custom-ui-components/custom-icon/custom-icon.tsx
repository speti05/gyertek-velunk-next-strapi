"use client";

import React from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faFacebook, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

config.autoAddCss = false;

const ICON_MAP = {
  login: { type: "mui" as const, component: LoginIcon },
  logout: { type: "mui" as const, component: LogoutIcon },
  person: { type: "mui" as const, component: PersonIcon },
  close: { type: "mui" as const, component: CloseIcon },
  expandMore: { type: "mui" as const, component: ExpandMoreIcon },
  visibility: { type: "mui" as const, component: Visibility },
  visibilityOff: { type: "mui" as const, component: VisibilityOff },
  facebook: { type: "fa" as const, icon: faFacebook },
  instagram: { type: "fa" as const, icon: faInstagram },
  tiktok: { type: "fa" as const, icon: faTiktok },
};

export type IconName = keyof typeof ICON_MAP;

type CustomIconProps = {
  name: IconName;
  fontSize?: SvgIconProps["fontSize"];
  size?: SizeProp;
  className?: string;
  sx?: SvgIconProps["sx"];
};

const CustomIcon: React.FC<CustomIconProps> = ({ name, fontSize, size, className, sx }) => {
  const entry = ICON_MAP[name];

  if (entry.type === "fa") {
    return <FontAwesomeIcon icon={entry.icon} size={size} className={className} />;
  }

  const Icon = entry.component;
  return <Icon fontSize={fontSize} className={className} sx={sx} />;
};

export default CustomIcon;
