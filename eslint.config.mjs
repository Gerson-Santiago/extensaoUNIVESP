// @ts-nocheck
import js from '@eslint/js';
import globals from 'globals';
import security from 'eslint-plugin-security';

export default [
  js.configs.recommended,
  {
    plugins: {
      security,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      // Security rules
      'security/detect-object-injection': 'off', // Muitos falsos positivos em código interno
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
    },
  },
  {
    ignores: ['node_modules/', 'coverage/'],
  },
];
