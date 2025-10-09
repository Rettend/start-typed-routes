import solid from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [solid() as any],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/helpers/setup.ts',
    coverage: {
      enabled: true,
      provider: 'v8',
      include: [
        'src/**',
      ],
      exclude: [
        'tests/helpers/**',
        'playground/**',
        'dist/**',
        'coverage/**',
        '**/*.d.ts',
        'eslint.config.js',
        'vitest.config.ts',
        'tsdown.config.ts',
      ],
    },
  },
})
