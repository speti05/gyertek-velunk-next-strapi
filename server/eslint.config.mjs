import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
  },

  // Type-aware TypeScript rules (catches unawaited promises in services, controllers, lifecycles)
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/require-await': 'warn',
      // Strapi's document service and plugin APIs are typed as `any`, so these only produce noise
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  // Must stay last: turns off rules that conflict with Prettier formatting
  prettier,

  globalIgnores([
    'dist/**',
    'build/**',
    '.cache/**',
    '.strapi/**',
    '.tmp/**',
    'public/**',
    'types/generated/**',
    'src/admin/**',
  ]),
])

export default eslintConfig
