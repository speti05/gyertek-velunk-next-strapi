'use client';

// this color import should be the first
import { colors } from './colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    // fontFamily: 'var(--font-source-sans-3), sans-serif',
    // font-optical-sizing: auto;
    // font-weight: 300;
    // font-style: normal;
  },  
  shape: {
    borderRadius: '1rem',
  },
  palette: {
    // primary: {
    //   main: colors.primary.main,
    //   contrastText: '#ffffff',
    // },
  },  
  components: {
    MuiButton: {
      styleOverrides: {
        // disabled: {
        //   backgroundColor: colors.button.disabled,
        //   opacity: 0.6,
        // },
        root: {
          textTransform: 'none',
          fontSize: '2rem',
              fontFamily: 'var(--font-source-sans-3), sans-serif',
              fontOpticalSizing: 'auto',
              fontWeight: 300,
              fontStyle: 'normal',
        },
        // Primary
        containedPrimary: {
          backgroundColor: colors.button.primary.main,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.button.primary.hover,
            boxShadow: '0 2px 8px rgba(55, 127, 118, 0.3)',
          },
          '&:active': {
            backgroundColor: colors.button.primary.active,
          },
        },
        outlinedPrimary: {
          color: colors.button.primary.main,
          borderColor: colors.button.primary.main,
          '&:hover': {
            borderColor: colors.button.primary.hover,
            backgroundColor: colors.button.primary.light,
          },
        },
        textPrimary: {
          color: colors.button.primary.main,
          '&:hover': {
            backgroundColor: colors.button.primary.light,
          },
        },
        
        // Secondary
        containedSecondary: {
          backgroundColor: colors.button.secondary.main,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.button.secondary.hover,
            boxShadow: '0 2px 8px rgba(112, 99, 76, 0.3)',
          },
          '&:active': {
            backgroundColor: colors.button.secondary.active,
          },
        },
        outlinedSecondary: {
          color: colors.button.secondary.main,
          borderColor: colors.button.secondary.main,
          '&:hover': {
            borderColor: colors.button.secondary.hover,
            backgroundColor: colors.button.secondary.light,
          },
        },
        textSecondary: {
          color: colors.button.secondary.main,
          '&:hover': {
            backgroundColor: colors.button.secondary.light,
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        // TODO: bad idea!!!
        // root: {
        //   margin: '1rem',
        //   minHeight: '7.5rem',
        // },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '2rem',
          fontFamily: 'var(--font-source-sans-3), sans-serif',
          fontOpticalSizing: 'auto',
          fontWeight: 300,
          fontStyle: 'normal',

          backgroundColor: colors.textInput.main, // Light background for default state
        
          // overwriting default border color
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.textInput.textColor,
          },

          // overwriting focused border color
          '&.Mui-focused': {
            color: colors.textInput.focused,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.textInput.textColor,
            },
          },
        },
        // Input text styling
        input: {
          padding: '12px 14px',
          fontSize: '1.5rem',
          color: colors.textInput.textColor,
          
          '&::placeholder': {
            color: colors.textInput.placeHolder,
            opacity: 0.5,
          },
        },
      },
    },
    
    // Input Label styling
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.label.main,
          
          // Focused label
          '&.Mui-focused': {
            color: colors.label.focused,
          },
          
          // Error label
          // '&.Mui-error': {
          //   color: colors.label.error,
          // },
        },
      },
    },
    
    // Helper text styling
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: '4px',
          fontSize: '1rem',
          
          '&.Mui-error': {
            color: colors.label.error,
          },
        },
      },
    },

    //fixing scrollable background in case of opened
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
});