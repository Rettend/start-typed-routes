import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/helpers/setup.ts',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**'],
      exclude: [
        'tests/helpers/**',
        'playground/**',
        '**/dist/**',
        'src/all.ts',
        '**/coverage/**',
        '**/*.d.ts',
        '**/eslint.config.js',
        '**/vitest.config.ts',
        '**/tsdown.config.ts',
      ],
    },
  },
})
