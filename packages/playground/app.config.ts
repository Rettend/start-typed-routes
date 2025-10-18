import { defineConfig } from '@solidjs/start/config'
import { routeTypeGenerator } from '../plugin/src'

export default defineConfig({
  vite: {
    plugins: [routeTypeGenerator() as any],
    resolve: {
      alias: {
        'start-typed-routes': new URL('../plugin/src/index.ts', import.meta.url).pathname,
      },
    },
  },
})
