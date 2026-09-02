// @ts-check

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

const EReactFiles = ['src/react/**/*.{ts,tsx}', 'studio/**/*.{ts,tsx}']

export default tseslint.config(
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'docs/public/**/*.js',
      'node_modules/**',
      'studio/dist/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.bun,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T', 'I'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const', 'exported', 'global'],
          format: ['PascalCase'],
          prefix: ['E'],
          filter: {
            regex: '^ImagesInMotion$',
            match: false,
          },
        },
      ],
    },
  },
  {
    ...react.configs.flat.recommended,
    files: EReactFiles,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      'react/prop-types': 'off',
    },
  },
  {
    ...react.configs.flat['jsx-runtime'],
    files: EReactFiles,
  },
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
)
