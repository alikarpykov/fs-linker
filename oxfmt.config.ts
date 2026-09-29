import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',

  sortImports: {
    newlinesBetween: false,
    customGroups: [
      {
        groupName: 'react',
        elementNamePattern: ['react', 'react-**'],
      },
    ],
    groups: [
      'value-builtin',
      { newlinesBetween: true },
      'react',
      { newlinesBetween: true },
      'value-external',
      { newlinesBetween: true },
      'value-internal',
      { newlinesBetween: true },
      ['value-parent', 'value-sibling', 'value-index'],
      { newlinesBetween: true },
      [
        'type-import',
        'type-internal',
        'type-parent',
        'type-sibling',
        'type-index',
      ],
      'unknown',
    ],
  },
})
