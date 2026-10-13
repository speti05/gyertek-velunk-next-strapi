import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupConfigRules } from '@eslint/compat'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import prettier from 'eslint-config-prettier/flat'

// Tailwind colour utilities (incl. variants, arbitrary colour values and opacity
// modifiers). Colours must come from sass/base/_colors.scss instead - see CLAUDE.md.
const TAILWIND_COLOR_CLASS =
  '^(?:[\\w-]+:)*!?(?:bg|text|border(?:-[xytrblse])?|outline|ring(?:-offset)?|inset-ring|divide|fill|stroke|from|via|to|decoration|accent|caret|shadow|inset-shadow|drop-shadow|text-shadow|placeholder)-' +
  '(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mauve|olive|mist|taupe)-\\d{2,3}|\\[(?:color:)?(?:#|rgba?\\(|hsla?\\(|oklch\\(|oklab\\(|lab\\(|lch\\(|hwb\\()[^\\]]*\\])' +
  '(?:\\/[\\w.\\[\\]%-]+)?!?$'

// Colour literals in TS/TSX (sx props, inline styles, SVG fills).
const HEX_COLOR_LITERAL = '/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/'
const FUNC_COLOR_LITERAL = '/(?:rgba?|hsla?|oklch)\\(/'
const COLOR_LITERAL_MESSAGE =
  'Colour literals are not allowed - import { palette } from "@/sass/base/colors.generated" (see CLAUDE.md).'

const eslintConfig = defineConfig([
  ...fixupConfigRules(nextVitals),

  // TypeScript-aware rules
  ...fixupConfigRules(nextTs),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Project conventions: colours come only from the palette
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/sass/base/colors.generated.ts'],
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: {
      'better-tailwindcss': { entryPoint: 'src/app/globals.css' },
    },
    rules: {
      'better-tailwindcss/no-restricted-classes': [
        'error',
        {
          restrict: [
            {
              pattern: TAILWIND_COLOR_CLASS,
              message:
                'Tailwind colour utility "$0" is not allowed - move the colour into a CSS module class that reads from the palette (see CLAUDE.md).',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: `Literal[value=${HEX_COLOR_LITERAL}]`, message: COLOR_LITERAL_MESSAGE },
        { selector: `Literal[value=${FUNC_COLOR_LITERAL}]`, message: COLOR_LITERAL_MESSAGE },
        { selector: `TemplateElement[value.raw=${FUNC_COLOR_LITERAL}]`, message: COLOR_LITERAL_MESSAGE },
      ],
    },
  },

  // Project conventions: MUI is only used through custom-ui-components wrappers
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/components/custom-ui-components/**',
      'src/components/providers/theme-provider/**',
      'src/sass/mui-override/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/material', '@mui/material/*', '@mui/icons-material', '@mui/icons-material/*'],
              allowTypeImports: true,
              message:
                'Use (or create) a wrapper in src/components/custom-ui-components/ instead of importing MUI directly.',
            },
          ],
        },
      ],
    },
  },

  // Must stay last: turns off rules that conflict with Prettier formatting
  prettier,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
