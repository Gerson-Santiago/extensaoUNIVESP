// @ts-nocheck
import js from '@eslint/js';
import globals from 'globals';
import security from 'eslint-plugin-security';
import noUnsanitized from 'eslint-plugin-no-unsanitized';

export default [
  js.configs.recommended,
  security.configs.recommended,
  {
    plugins: {
      security,
      'no-unsanitized': noUnsanitized,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.node,
        ...globals.jest,
        chrome: 'readonly',
      },
    },
    rules: {
      // General Code Quality
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],

      // XSS Prevention (no-unsanitized)
      // Bloquear innerHTML, outerHTML com exceção do nosso DOMSafe.escapeHTML (se necessário, mas ideal é evitar)
      'no-unsanitized/property': [
        'error',
        {
          escape: {
            methods: ['DOMSafe.escapeHTML'],
          },
        },
      ],
      // Bloquear document.write e similares
      'no-unsanitized/method': 'error',

      // Execution Security
      // Bloquear eval() e similares
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // Security Plugin Rules
      'security/detect-object-injection': 'off', // Muitos falsos positivos
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
    },
  },
  {
    files: ['tests/**/*.js', '**/*.test.js', 'jest.setup.js', 'scripts/**/*.js'],
    rules: {
      // Relax rules for testing and scripts
      'no-unsanitized/property': 'off',
      'no-unsanitized/method': 'off',
      'security/detect-non-literal-regexp': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'coverage/', '.cache/'],
  },
];
