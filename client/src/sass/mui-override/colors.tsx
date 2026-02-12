import { red } from '@mui/material/colors';
import { darken, lighten} from 'polished';

const baseColors = {
  darkGreen: 'rgb(55 , 127, 118)', // gy-v-dark-green
  darkBrown: 'rgb(112 , 99, 76)', // gy-v-dark-brown
  lightBrown: 'rgb(241, 232, 217)', // gy-v-light-brown
  gray: 'rgb(156, 163, 175)', // gy-v-gray
  red:' rgb(255, 0, 0)', // red for errors
};

export const colors = {
  button: {
    primary: {
      main: baseColors.darkGreen,
      hover: lighten(0.1, baseColors.darkGreen),
      active: darken(0.1, baseColors.darkGreen),
      light: lighten(0.2, baseColors.darkGreen),
    },
    secondary: {
      main: baseColors.darkBrown,
      hover: lighten(0.1, baseColors.darkBrown),
      active: darken(0.1, baseColors.darkBrown),
      light: lighten(0.2, baseColors.darkBrown),
    },
    disabled: baseColors.gray,
  },
  textInput: {
    main: lighten(0.5, baseColors.lightBrown),
    hover: lighten(0.4, baseColors.lightBrown),
    focused: darken(0.3, baseColors.lightBrown),
    placeHolder: lighten(0.2, baseColors.lightBrown),
    textColor: baseColors.darkBrown,
    disabled: baseColors.gray,
  },
  label: {
    main: darken(0.2, baseColors.lightBrown),
    focused: baseColors.lightBrown,
    error: baseColors.red,
  },
  // todo: error + success
} as const;