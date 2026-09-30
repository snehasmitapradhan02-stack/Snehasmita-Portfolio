import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * Flat ESLint config.
 *
 * Deliberately does NOT use `eslint-config-next`: that package pulls in
 * typescript-eslint as a hard requirement, and this project is JavaScript
 * only. The rules that actually matter here are the React hooks rules and
 * the accessibility rules.
 */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: '19.0' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // The App Router does not require the React import in JSX.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'warn',

      // Styling is class-based; these are noisy and low-signal here.
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/label-has-associated-control': [
        'error',
        { labelComponents: [], labelAttributes: [], assert: 'either' },
      ],

      // Browser globals
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['warn', 'smart'],
    },
  },
  {
    // React Three Fiber drives its scene through custom lower-case JSX
    // intrinsics (`<points>`, `<bufferAttribute>`, `<meshBasicMaterial>` …)
    // whose props (`attach`, `args`, `vertexColors`, …) are not DOM
    // attributes, so the DOM-focused unknown-property rule does not apply.
    files: ['src/components/hero/HeroScene.jsx'],
    rules: {
      'react/no-unknown-property': 'off',
    },
  },
];

export default eslintConfig;
