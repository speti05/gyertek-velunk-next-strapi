'use client';

// this color import should be the first
import { colors } from './colors';
import { createTheme } from '@mui/material/styles';

const COLORS = {
  border: {
    default: 'none',
    hover: 'var(--gy-v-dark-brown)',
    focus: 'var(--gy-v-dark-green)',
  },
  hover: {
    background: 'red',
  },
};

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Source_Sans_3',
      'sans-serif',
    ].join(','),
  },  
  shape: {
    borderRadius: '1rem',
  },
  palette: {
    primary: {
      main: colors.primary.main,
      contrastText: '#ffffff',
    },
  },  
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.border.default,
          },
          '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.border.hover,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.border.focus,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '2rem',
        },
        // Primary
        containedPrimary: {
          backgroundColor: colors.primary.main,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.primary.hover,
            boxShadow: '0 2px 8px rgba(55, 127, 118, 0.3)',
          },
          '&:active': {
            backgroundColor: colors.primary.active,
          },
        },
        outlinedPrimary: {
          color: colors.primary.main,
          borderColor: colors.primary.main,
          '&:hover': {
            borderColor: colors.primary.hover,
            backgroundColor: colors.primary.light,
          },
        },
        textPrimary: {
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.light,
          },
        },
        
        // Secondary
        containedSecondary: {
          backgroundColor: colors.secondary.main,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.secondary.hover,
            boxShadow: '0 2px 8px rgba(112, 99, 76, 0.3)',
          },
          '&:active': {
            backgroundColor: colors.secondary.active,
          },
        },
        outlinedSecondary: {
          color: colors.secondary.main,
          borderColor: colors.secondary.main,
          '&:hover': {
            borderColor: colors.secondary.hover,
            backgroundColor: colors.secondary.light,
          },
        },
        textSecondary: {
          color: colors.secondary.main,
          '&:hover': {
            backgroundColor: colors.secondary.light,
          },
        },
      },
    },
  },
});