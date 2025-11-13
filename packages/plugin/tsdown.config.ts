import type { UserConfig } from 'tsdown'
import solid from 'rolldown-plugin-solid'
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/all.ts', './src/plugin.ts'],
    platform: 'neutral',
    dts: {
      tsgo: true,
    },
    inputOptions: {
      external: ['node:fs', 'node:path'],
    },
    plugins: [solid()],
  },
  {
    entry: ['./src/index.ts', './src/all.ts', './src/plugin.ts'],
    platform: 'neutral',
    dts: false,
    inputOptions: {
      jsx: 'preserve',
      external: ['node:fs', 'node:path'],
    },
    outExtensions: () => ({
      js: '.jsx',
    }),
  },
] as UserConfig) // TODO: remove
