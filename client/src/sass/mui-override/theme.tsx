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

// Below this width the app is assumed to be driven by touch, so every control grows a
// comfortable target. The width matches the `tab-land` breakpoint in
// sass/base/_mixins.scss - that file is where every media query in the codebase is
// declared, and em keeps it independent of the html font-size exactly as the mixin does.
const TOUCH = "@media (max-width: 75em)";

// Touch targets are sized in px on purpose, against the grain of the rest of this file.
// The html font-size shrinks on small screens (62.5% -> 55% -> 50% in _base.scss), so a
// rem-based target would get *smaller* precisely where a finger needs it to be bigger.
// TOUCH_TARGET is the floor for controls that are only as big as their own box - an
// icon button, a checkbox, a menu row. TOUCH_CONTROL_HEIGHT is the taller size shared
// by everything that lines up in a form: fields, dropdowns and buttons alike, so a
// button never sits shorter than the input above it.
const TOUCH_TARGET = "48px";
const TOUCH_CONTROL_HEIGHT = "56px";

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
    background: {
      default: colors.background.default,
    },
    white: {
      main: colors.link.white.main,
      light: colors.link.white.main,
      dark: colors.link.white.hover,
      contrastText: colors.link.white.contrastText,
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
          textTransform: "uppercase",
          borderRadius: "999px",
          fontSize: "2rem",

          [TOUCH]: {
            minHeight: TOUCH_CONTROL_HEIGHT,
            padding: "12px 24px",
          },
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
            boxShadow: `0 2px 8px ${colors.button.primary.shadow}`,
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
            boxShadow: `0 2px 8px ${colors.button.secondary.shadow}`,
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
    // Icon buttons carry no text to size them, so on touch they get an explicit box
    // rather than more padding - the icons themselves are only 15px here.
    MuiIconButton: {
      styleOverrides: {
        root: {
          [TOUCH]: {
            minWidth: TOUCH_TARGET,
            minHeight: TOUCH_TARGET,
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

          // Fully rounded pill shape
          borderRadius: "999px",

          // A textarea cannot carry a pill outline, so it keeps a plain rounded corner
          "&.MuiInputBase-multiline": {
            borderRadius: "1.6rem",
          },

          // overwriting default border color
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.textInput.border,

            // the label notch has to clear the rounded corner it sits on
            "& legend": {
              marginLeft: "6px",
            },
          },

          // overwriting hover border color - never on a disabled field, which has no
          // hover state to speak of
          "&:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.textInput.border,
          },

          // A disabled field is not actionable, so it drops the brand border rather
          // than reading like something you can type into. This has to be spelled out:
          // MUI's own disabled rule carries the same specificity as the rules above,
          // so whichever lands later in the stylesheet would otherwise decide.
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.textInput.disabled,
          },

          // the focused field carries a darker, thicker outline so keyboard
          // navigation stays readable
          "&.Mui-focused": {
            color: colors.textInput.focused,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.textInput.borderFocused,
              borderWidth: "2px",
            },
          },
        },
        // Input text styling
        input: {
          // The root carries a 2rem font size, so MUI's own `line-height: 1.4375em`
          // resolves there to 28.75px and is inherited here as an absolute length,
          // while this input's content box is only 1.4375 x 1.5rem tall. That
          // mismatch is what pushed the placeholder off centre, so the box is pinned
          // explicitly and the line height is left to the browser to centre.
          boxSizing: "border-box",
          height: "4.8rem",
          lineHeight: "normal",

          [TOUCH]: {
            height: TOUCH_CONTROL_HEIGHT,
          },
          // no vertical padding - the browser centres the value inside the fixed
          // height; the side padding keeps the text clear of the pill's curve
          padding: "0 20px",
          fontSize: "1.5rem",
          color: colors.textInput.textColor,

          // A Select renders a div rather than an input, so it neither centres its own
          // text nor keeps the height set above: MUI ships a deliberate
          // `&.MuiSelect-select { height: auto }` reset to "win specificity over the
          // input base", which collapses the field down to its min-height. Outranking
          // that reset also drops MUI's `&&& { padding-right: 32 }`, so the room for
          // the dropdown arrow has to be restored here too. Centring happens through
          // the line box rather than flex, because flex would break the ellipsis MUI
          // puts on overflowing values.
          "&&&.MuiSelect-select": {
            boxSizing: "border-box",
            height: "4.8rem",
            minHeight: "unset",
            lineHeight: "4.8rem",
            padding: "0 3.2rem 0 2rem",

            [TOUCH]: {
              height: TOUCH_CONTROL_HEIGHT,
              lineHeight: TOUCH_CONTROL_HEIGHT,
            },
          },

          "&::placeholder": {
            color: colors.textInput.placeHolder,
            opacity: 0.5,
          },
        },
        multiline: {
          padding: "12px 20px",

          [TOUCH]: {
            padding: "16px 20px",
          },
        },
        inputMultiline: {
          // a textarea grows with its rows, so the fixed height above must not apply
          height: "auto",
          padding: 0,
        },
      },
    },

    // Input Label styling
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.label.main,
          fontSize: "1.5rem",

          // The label follows the input's wider side padding so it clears the pill's
          // curve. MUI's default 16px offset assumes a 56px field; ours is 4.8rem, so
          // the resting position is recentred to match.
          "&.MuiInputLabel-outlined": {
            transform: "translate(20px, 13px) scale(1)",

            // recentred again for the taller touch field
            [TOUCH]: {
              transform: "translate(20px, 17px) scale(1)",
            },

            "&.MuiInputLabel-sizeSmall": {
              transform: "translate(20px, 9px) scale(1)",
            },

            "&.MuiInputLabel-shrink": {
              transform: "translate(20px, -9px) scale(0.75)",
            },
          },

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
            fontSize: "2rem",
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
    // Helper text styling (under outlined input)
    //
    // A TextField used to carry a fixed 7.5rem height to leave room for an error
    // message. A Select is a bare FormControl, so it got no such reserve and the two
    // ended up different heights in the same column. Instead every field now renders
    // a helper text line at all times - CustomTextInput and CustomSelect pass " ",
    // which MUI turns into a zero-width space - so the reserve comes from real
    // content. That also means a two-line error grows the field rather than spilling
    // over the one below it, which the fixed height could not do.
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          // lines up with the input's side padding, clear of the pill's curve
          marginLeft: "2rem",
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
          // a box, not padding: MUI's icons resolve to 1.5rem, which this app's 62.5%
          // root font-size turns into 15px, so padding alone would not reach a finger
          [TOUCH]: {
            minWidth: TOUCH_TARGET,
            minHeight: TOUCH_TARGET,
          },

          // MUI sizes its icons in rem, and _base.scss drops the root font-size to 55%
          // and then 50% on smaller screens - so the default box ends up at 15px on a
          // desktop and 12px on a phone, smallest exactly where it is hardest to hit.
          // px pins it to Material's own 24px everywhere.
          "& .MuiSvgIcon-root": {
            fontSize: "24px",
          },

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
          // Same reason as the checkbox above: 1.6rem reads as 16px on a desktop but
          // shrinks to 12.8px below 900px, which is too small for consent text that
          // runs to several lines. px holds the desktop size and stops the shrink.
          fontSize: "16px",
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
        // The visible track is the root's content box, so growing the padding on the
        // root and on the thumb's button by the same amount enlarges the target while
        // the switch itself keeps its size. The 3px offset between the two is MUI's:
        // it is what makes the thumb overhang the track.
        root: {
          [TOUCH]: {
            width: "68px",
            height: TOUCH_TARGET,
            padding: "17px",
          },
        },
        switchBase: {
          [TOUCH]: {
            padding: "14px",
          },

          "&.Mui-checked": {
            color: colors.button.primary.main,
            "& + .MuiSwitch-track": { backgroundColor: colors.button.primary.main },
          },
          "&.Mui-checked.Mui-disabled": {
            color: colors.switch.disabledChecked,
            "& + .MuiSwitch-track": { backgroundColor: colors.switch.disabledChecked, opacity: 0.9 },
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
          [TOUCH]: {
            minHeight: TOUCH_TARGET,
          },

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
          [TOUCH]: {
            minHeight: TOUCH_CONTROL_HEIGHT,
          },

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

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.button.primary.main,
        },
      },
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
