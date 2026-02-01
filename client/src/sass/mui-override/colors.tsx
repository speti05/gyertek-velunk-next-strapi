import { darken, lighten} from 'polished';

const baseColors = {
  primary: 'rgb(55 , 127, 118)', // gy-v-dark-green
  secondary: 'rgb(112 , 99, 76)', // gy-v-dark-brown
};

export const colors = {
  primary: {
    main: baseColors.primary,
    hover: lighten(0.1, baseColors.primary),
    active: darken(0.1, baseColors.primary),
    light: lighten(0.2, baseColors.primary),
  },
  secondary: {
    main: baseColors.secondary,
    hover: lighten(0.1, baseColors.secondary),
    active: darken(0.1, baseColors.secondary),
    light: lighten(0.2, baseColors.secondary),
  },
  // todo: error + success
} as const;