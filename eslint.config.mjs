import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      'prefer-arrow-callback': 'error',
      'func-style': [
        'error',
        'expression',
        { allowArrowFunctions: true, overrides: { namedExports: 'ignore' } },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  globalIgnores([
    'public/maplibre/**', '**/storybook-static/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
