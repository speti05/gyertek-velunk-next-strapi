import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupConfigRules } from '@eslint/compat'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
      // example for disabling rules
    // {
    //   rules: {
    //     'react/no-unescaped-entities': 'off',
    //   },
    // },
  ...fixupConfigRules(nextVitals),
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig