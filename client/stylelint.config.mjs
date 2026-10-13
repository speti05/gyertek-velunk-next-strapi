// Colours may only be defined in sass/base/_colors.scss - see CLAUDE.md.
// Everywhere else use colors.$gy-v-*, colors.scrim()/veil() or rgba(colors.$gy-v-*, $alpha).
const COLOR_MESSAGE = 'Colour literals are only allowed in sass/base/_colors.scss - use a colors.$gy-v-* token (see CLAUDE.md).'

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recommended-scss'],
  ignoreFiles: ['.next/**', 'out/**', 'build/**'],
  overrides: [
    {
      // The palette and its helpers (_colors.scss, scrim()/veil(), --background/--foreground) live here
      files: ['src/sass/base/**'],
      rules: {
        'color-no-hex': null,
        'color-named': null,
        'declaration-property-value-disallowed-list': null,
      },
    },
  ],
  rules: {
    'color-no-hex': [true, { message: COLOR_MESSAGE }],
    'color-named': ['never', { message: COLOR_MESSAGE }],
    // rgba(colors.$token, 0.3) is fine, rgba(0, 0, 0, 0.3) is not
    'declaration-property-value-disallowed-list': [
      { '/.*/': [/(?:rgba?|hsla?|oklch)\(\s*[\d.]/] },
      { message: COLOR_MESSAGE },
    ],
    // Empty `//` lines are used as visual separators in the SCSS files
    'scss/comment-no-empty': null,
    // Tailwind v4 at-rules in globals.css
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['tailwind', 'theme', 'source', 'utility', 'variant', 'custom-variant', 'apply', 'reference', 'config', 'plugin'] }],
  },
}
