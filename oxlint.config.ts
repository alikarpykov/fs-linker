import { defineConfig } from 'oxlint'

export default defineConfig({
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    perf: 'warn',
  },
  plugins: [
    'import',
    'node',
    'oxc',
    'promise',
    'react',
    'typescript',
    'unicorn',
  ],
  rules: {
    'eslint/no-unused-vars': 'error',
    'react/react-in-jsx-scope': 'off',
    'unicorn/no-array-sort': 'off',
  },
  overrides: [
    {
      files: [
        'src/entities/link/model/forEachLinkEntry.ts',
        'src/entities/link/model/unlinkEntries.ts',
      ],
      rules: {
        'eslint/no-await-in-loop': 'off',
      },
    },
  ],
})
