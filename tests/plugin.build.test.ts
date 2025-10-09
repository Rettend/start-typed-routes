import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { routeTypeGenerator } from '../src'

const routes = [
  { path: '/' },
  { path: '/users', children: [{ path: '/:id' }] },
  { path: '/search', children: [{ path: '/:q?' }] },
  { path: '/(group)', children: [{ path: '/hidden' }] },
]

function makeTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'route-types-build-'))
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true })
  return dir
}

function readRoutesDts(root: string) {
  const p = path.join(root, 'src', 'routes.d.ts')
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : ''
}

describe('plugin: build-time generation', () => {
  it('writes routes.d.ts with expected union and params', async () => {
    const root = makeTempDir()
    const plugin = routeTypeGenerator()

    await (plugin as any).configResolved?.({
      command: 'build',
      root,
      router: { internals: { routes } },
    })

    const content = readRoutesDts(root)
    expect(content).toContain('export type Path =')
    expect(content).toContain('\'/\'')
    expect(content).toContain('\'/users\'')
    expect(content).toContain('\'/users/:id\'')
    expect(content).toContain('\'/search/:q?\'')
    expect(content).not.toContain('/(group)')

    expect(content).toContain('export type Params =')
    expect(content).toContain('\'/users/:id\': { id: string }')
    expect(content).toContain('\'/search/:q?\': { q?: string }')
  })

  it('is idempotent (no log on second identical write)', async () => {
    const root = makeTempDir()
    const plugin = routeTypeGenerator()

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    await (plugin as any).configResolved?.({ command: 'build', root, router: { internals: { routes } } })
    expect(log).toHaveBeenCalledTimes(1)

    log.mockClear()
    await (plugin as any).configResolved?.({ command: 'build', root, router: { internals: { routes } } })
    expect(log).not.toHaveBeenCalled()

    log.mockRestore()
  })

  it('serve command is a no-op', async () => {
    const root = makeTempDir()
    const plugin = routeTypeGenerator()

    await (plugin as any).configResolved?.({ command: 'serve', root, router: { internals: { routes } } })

    const content = readRoutesDts(root)
    expect(content).toBe('')
  })
})
