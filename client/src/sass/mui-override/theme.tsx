"use client";

// this color import should be the first
import { colors } from "./colors";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/Chip" {
  interface ChipPropsSizeOverrides {
    large: true;
  }
}

declare module "@mui/material/Link" {
  interface LinkPropsColorOverrides {
    white: true;
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    white: Palette["primary"];
  }
  interface PaletteOptions {
    white?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: "var(--font-source-sans-3), sans-serif",
    h1: { fontFamily: "var(--font-luckiest-guy), cursive" },
    h2: { fontFamily: "var(--font-luckiest-guy), cursive" },
    h3: { fontFamily: "var(--font-luckiest-guy), cursive" },
    h4: { fontFamily: "var(--font-luckiest-guy), cursive" },
    h5: { fontFamily: "var(--font-luckiest-guy), cursive" },
    h6: { fontFamily: "var(--font-luckiest-guy), cursive" },
  },
  shape: {
    borderRadius: "1rem",
  },
  palette: {
    white: {
      main: colors.link.white.main,
      light: colors.link.white.main,
      dark: colors.link.white.hover,
      contrastText: "rgb(112, 99, 76)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        // disabled: {
        //   backgroundColor: colors.button.disabled,
        //   opacity: 0.6,
        // },
        root: {
          textTransform: "none",
          fontSize: "2rem",
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontOpticalSizing: "auto",
          fontWeight: 300,
          fontStyle: "normal",
          textAlign: "center",
        },
        // Primary
        containedPrimary: {
          backgroundColor: colors.button.primary.main,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: colors.button.primary.hover,
            boxShadow: "0 2px 8px rgba(55, 127, 118, 0.3)",
          },
          "&:active": {
            backgroundColor: colors.button.primary.active,
          },
        },
        outlinedPrimary: {
          color: colors.button.primary.main,
          borderColor: colors.button.primary.main,
          "&:hover": {
            borderColor: colors.button.primary.hover,
            fontColor: colors.button.primary.hover,
          },
        },
        textPrimary: {
          color: colors.button.primary.main,
          "&:hover": {
            backgroundColor: colors.button.primary.light,
          },
        },

        // Secondary
        containedSecondary: {
          backgroundColor: colors.button.secondary.main,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: colors.button.secondary.hover,
            boxShadow: "0 2px 8px rgba(112, 99, 76, 0.3)",
          },
          "&:active": {
            backgroundColor: colors.button.secondary.active,
          },
        },
        outlinedSecondary: {
          color: colors.button.secondary.main,
          borderColor: colors.button.secondary.main,
          "&:hover": {
            borderColor: colors.button.secondary.hover,
            backgroundColor: colors.button.secondary.light,
          },
        },
        textSecondary: {
          color: colors.button.secondary.main,
          "&:hover": {
            backgroundColor: colors.button.secondary.light,
          },
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        slotProps: {
          input: {
            suppressHydrationWarning: true,
          } as React.InputHTMLAttributes<HTMLInputElement>,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "2rem",
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontOpticalSizing: "auto",
          fontWeight: 300,
          fontStyle: "normal",

          backgroundColor: colors.textInput.main, // Light background for default state

          // overwriting default border color
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.textInput.textColor,
          },

          // overwriting focused border color
          "&.Mui-focused": {
            color: colors.textInput.focused,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.textInput.textColor,
            },
          },
        },
        // Input text styling
        input: {
          padding: "12px 14px",
          fontSize: "1.5rem",
          color: colors.textInput.textColor,

          "&::placeholder": {
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
          fontSize: "1.5rem",

          // Focused label
          "&.Mui-focused": {
            color: colors.label.focused,
          },

          // Error label
          "&.Mui-error": {
            fontSize: "1.5rem",
            color: colors.label.error,
            fontWeight: 700,
          },

          // Required asterisk
          "& .MuiFormLabel-asterisk": {
            color: colors.label.required,
          },
        },
        shrink: {
          fontSize: "1.8rem",

          "&.Mui-error": {
            color: colors.label.error,
          },
        },
      },
    },
    // Error text styling, outlined input
    MuiTextField: {
      styleOverrides: {
        root: {
          height: "7.5rem",
          "&:has(textarea)": {
            height: "auto",
          },
        },
      },
    },

    // Helper text styling (under outlined input)
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: "4px",
          fontSize: "1.3rem",

          "&.Mui-error": {
            color: colors.label.error,
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          fontFamily: "var(--font-source-sans-3), sans-serif",
        },
        icon: {
          fontSize: "2rem",
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.checkbox.unchecked,
          "&.Mui-checked": {
            color: colors.checkbox.checked,
          },
          "&:hover": {
            backgroundColor: colors.checkbox.hover,
          },
          "&.Mui-error": {
            color: colors.checkbox.error,
          },
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontSize: "1.6rem",
          fontWeight: 300,
          fontStyle: "normal",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          fontFamily: "var(--font-source-sans-3), sans-serif",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-luckiest-guy), cursive",
          fontSize: "2rem",
          fontWeight: 400,
          fontStyle: "normal",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontSize: "1.8rem",
          fontWeight: 300,
          fontStyle: "normal",
        },
      },
    },

    //fixing scrollable background in case of opened
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true,
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontWeight: 300,
          fontStyle: "normal",
          fontSize: "1.4rem",
          lineHeight: "1.8rem",
          padding: "0.5rem 1rem",
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: colors.button.primary.main,
            "& + .MuiSwitch-track": { backgroundColor: colors.button.primary.main },
          },
          "&.Mui-checked.Mui-disabled": {
            color: "rgb(176, 223, 216)",
            "& + .MuiSwitch-track": { backgroundColor: "rgb(176, 223, 216)", opacity: 0.9 },
          },
        },
      },
    },

    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontSize: "1.3rem",
          "&.Mui-active": {
            color: colors.button.primary.main,
            fontWeight: 700,
          },
          "&.Mui-completed": {
            color: colors.button.primary.main,
          },
        },
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: "3.2rem",
          "&.Mui-active": {
            color: colors.button.primary.main,
          },
          "&.Mui-completed": {
            color: colors.button.primary.main,
          },
        },
        text: {
          fontSize: "0.75rem",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontWeight: 300,
          "&::before": {
            display: "none",
          },
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: colors.accordion.default,
          borderRadius: "0.6rem !important",
          boxShadow: "none",
          transition: "background-color 0.2s ease",
          "&::before": {
            display: "none",
          },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: "0.6rem",
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: colors.accordion.hover,
          },
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          transition: "color 0.2s ease",
          fontFamily: "var(--font-source-sans-3), sans-serif",
          fontWeight: 300,
        },
      },
      variants: [
        {
          props: { color: "primary" },
          style: {
            color: colors.link.primary.main,
            "&:hover": { color: colors.link.primary.hover },
          },
        },
        {
          props: { color: "secondary" },
          style: {
            color: colors.link.secondary.main,
            "&:hover": { color: colors.link.secondary.hover },
          },
        },
        {
          props: { color: "white" },
          style: {
            color: colors.link.white.main,
            "&:hover": { color: colors.link.white.hover },
          },
        },
      ],
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: "999px",
        },
        sizeSmall: {
          height: "2.2rem",
          fontSize: "1.2rem",
        },
        sizeMedium: {
          height: "2.8rem",
          fontSize: "1.4rem",
        },
        colorDefault: colors.chip.default,
        colorSuccess: colors.chip.success,
        colorWarning: colors.chip.warning,
        colorError: colors.chip.error,
      },
      variants: [
        {
          props: { size: "large" },
          style: {
            height: "3.2rem",
            fontSize: "1.6rem",
          },
        },
      ],
    },
  },
});
