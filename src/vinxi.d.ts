import type { ViteConfig } from 'vinxi/dist/types/lib/vite-dev'

declare module 'vite' {
  interface ResolvedConfig {
    router: ViteConfig['router']
    app: ViteConfig['app']
  }
}
