import { darken, lighten, rgba } from "polished";

import { palette } from "../base/colors.generated";

// Every value here is derived from sass/base/_colors.scss via the generated palette in
// colors.generated.ts. No colour literal belongs in this file - add the token to
// _colors.scss instead and let the generator pick it up.
const baseColors = {
  darkGreen: palette.darkGreen,
  darkBrown: palette.darkBrown,
  lightBrown: palette.lightBrown,
  lightGreen: palette.lightGreen,
  darkBeige: palette.darkBeige,
  veryLightBeige: palette.veryLightBeige,
  white: palette.white,
  black: palette.black,
  gray: palette.gray400,
  error: palette.error,
  red: palette.red,
};

export const colors = {
  background: {
    default: baseColors.veryLightBeige,
  },
  divider: rgba(baseColors.black, 0.1),
  button: {
    primary: {
      main: baseColors.darkGreen,
      hover: lighten(0.1, baseColors.darkGreen),
      active: darken(0.1, baseColors.darkGreen),
      light: lighten(0.2, baseColors.darkGreen),
      shadow: rgba(baseColors.darkGreen, 0.3),
    },
    secondary: {
      main: baseColors.darkBrown,
      hover: lighten(0.1, baseColors.darkBrown),
      active: darken(0.1, baseColors.darkBrown),
      light: lighten(0.2, baseColors.darkBrown),
      shadow: rgba(baseColors.darkBrown, 0.3),
    },
    disabled: baseColors.gray,
  },
  textInput: {
    main: lighten(0.5, baseColors.lightBrown),
    hover: lighten(0.4, baseColors.lightBrown),
    focused: darken(0.3, baseColors.lightBrown),
    placeHolder: baseColors.gray,
    textColor: baseColors.darkBrown,
    border: baseColors.darkGreen,
    borderFocused: darken(0.1, baseColors.darkGreen),
    disabled: baseColors.gray,
  },
  label: {
    main: darken(0.2, baseColors.lightBrown),
    focused: darken(0.4, baseColors.lightBrown),
    green: baseColors.darkGreen,
    error: baseColors.red,
    required: baseColors.red,
  },
  checkbox: {
    unchecked: darken(0.2, baseColors.lightBrown),
    checked: baseColors.darkGreen,
    hover: lighten(0.2, baseColors.darkGreen),
    error: baseColors.red,
  },
  switch: {
    disabledChecked: baseColors.lightGreen,
  },
  chip: {
    success: { backgroundColor: baseColors.lightGreen, color: baseColors.darkGreen },
    warning: { backgroundColor: baseColors.darkBeige, color: baseColors.darkBrown },
    error: { backgroundColor: rgba(baseColors.error, 0.12), color: baseColors.error },
    default: { backgroundColor: baseColors.lightBrown, color: baseColors.darkBrown },
  },
  link: {
    primary: { main: baseColors.darkGreen, hover: baseColors.darkBrown },
    secondary: { main: baseColors.darkBrown, hover: baseColors.darkGreen },
    white: {
      main: baseColors.white,
      hover: baseColors.lightBrown,
      contrastText: baseColors.darkBrown,
    },
  },
  accordion: {
    default: baseColors.lightBrown,
    hover: darken(0.1, baseColors.lightBrown),
  },
} as const;
