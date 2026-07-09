import { defineConfig } from 'oxlint'

export default defineConfig({
  categories: {
    correctness: 'error', // Жестко блокируем логические ошибки кода
    perf: 'warn', // Предупреждаем о проблемах с производительностью
  },
  plugins: ['react', 'typescript', 'unicorn', 'oxc', 'import'],
  rules: {
    'eslint/no-unused-vars': 'error', // Запрещаем забытый мёртвый код

    // Запрещаем глубокие импорты в обход Public API (индексов) других слайсов
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          'src/app/**',
          '**/node_modules/**',
          // Разрешаем внутренние импорты только внутри своего же слайса
          './model/**',
          './ui/**',
        ],
      },
    ],

    // Жесткое ограничение: запрещаем фичам импортировать другие фичи "вбок"
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/features/daemon-control/**/*',
            from: './src/features/link-management/**/*',
            message:
              'Архитектурная ошибка: Фича daemon-control не может импортировать фичу link-management. Вынесите общую логику в слой entities!',
          },
          {
            target: './src/features/link-management/**/*',
            from: './src/features/daemon-control/**/*',
            message:
              'Архитектурная ошибка: Фича link-management не может импортировать фичу daemon-control!',
          },
          {
            target: './src/entities/**/*',
            from: './src/features/**/*',
            message:
              'Нарушение иерархии FSD: Слой entities не имеет права импортировать вышележащий слой features!',
          },
          {
            target: './src/shared/**/*',
            from: './src/entities/**/*',
            message:
              'Нарушение иерархии FSD: Абстрактный слой shared не должен знать о доменных сущностях!',
          },
        ],
      },
    ],
  },
})
