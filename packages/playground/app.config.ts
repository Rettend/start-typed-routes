import { defineConfig } from '@solidjs/start/config'
import { routeTypeGenerator } from '../plugin/src/plugin'

export default defineConfig({
  vite: {
    plugins: [routeTypeGenerator() as any],
    resolve: {
      alias: {
        'start-typed-routes/plugin': new URL('../plugin/src/plugin.ts', import.meta.url).pathname,
        'start-typed-routes': new URL('../plugin/src/index.ts', import.meta.url).pathname,
      },
    },
  },
})
