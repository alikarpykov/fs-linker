import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: false,
  trailingComma: 'all',

  // стрелочные функции: (x) => x вместо x => x — читабельнее в TypeScript
  arrowParens: 'always',

  // { key: value } вместо {key: value}
  bracketSpacing: true,

  // конец строки LF — важно для кросс-платформенности (Windows/Linux/macOS)
  endOfLine: 'lf',

  // автоматически сортирует импорты по группам:
  // сначала node built-ins, потом внешние пакеты, потом локальные файлы
  sortImports: {
    partitionByNewline: false,
    groups: [
      'type-import',
      'value-builtin',
      'value-external',
      'type-internal',
      'value-internal',
      'unknown',
    ],
  },
})
