import { defineConfig } from '@solidjs/start/config'
import { routeTypeGenerator } from '../src'

export default defineConfig({
  vite: {
    plugins: [routeTypeGenerator() as any],
  },
})
