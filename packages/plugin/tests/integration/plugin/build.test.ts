import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { typedRoutes } from '../../../src/plugin'
import { hookHandler } from '../../helpers/vite'

const routes = [
  { path: '/' },
  { path: '/users', children: [
    { path: '/:id' },
    { path: '/:id', children: [{ path: '/:name' }] },
    { path: '/:id?' },
    { path: '/projects' },
  ] },
  { path: '/search', children: [{ path: '/:q?' }] },
  { path: '/blog', children: [
    { path: '/*post' },
  ] },
  { path: '/(static)', children: [
    { path: '/about-us', children: [{ path: '/' }] },
    { path: '/contact-us', children: [{ path: '/' }] },
  ] },
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
    const plugin = typedRoutes()

    const onConfigResolved = hookHandler(plugin.configResolved)
    await onConfigResolved({ command: 'build', root, router: { internals: { routes } } })

    const content = readRoutesDts(root)
    expect(content).toContain('export type Path =')
    expect(content).toContain('\'/\'')
    expect(content).toContain('\'/users\'')
    expect(content).toContain('\'/users/:id\'')
    expect(content).toContain('\'/users/:id/:name\'')
    expect(content).toContain('\'/users/:id?\'')
    expect(content).toContain('\'/users/projects\'')
    expect(content).toContain('\'/search/:q?\'')
    expect(content).toContain('\'/blog/*post\'')
    expect(content).toContain('\'/about-us\'')
    expect(content).toContain('\'/contact-us\'')
    expect(content).not.toContain('/(group)')

    expect(content).toContain('export type Params =')
    expect(content).toContain('\'/users/:id\': { id: string }')
    expect(content).toContain('\'/users/:id/:name\': { id: string, name: string }')
    expect(content).toContain('\'/users/:id?\': { id?: string }')
    expect(content).toContain('\'/search/:q?\': { q?: string }')
    expect(content).toContain('\'/blog/*post\': { post: string }')
  })

  it('is idempotent (no log on second identical write)', async () => {
    const root = makeTempDir()
    const plugin = typedRoutes()

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    const onConfigResolved = hookHandler(plugin.configResolved)
    await onConfigResolved({ command: 'build', root, router: { internals: { routes } } })
    expect(log).toHaveBeenCalledTimes(1)

    log.mockClear()
    await onConfigResolved({ command: 'build', root, router: { internals: { routes } } })
    expect(log).not.toHaveBeenCalled()

    log.mockRestore()
  })

  it('serve command is a no-op', async () => {
    const root = makeTempDir()
    const plugin = typedRoutes()

    const onConfigResolved = hookHandler(plugin.configResolved)
    await onConfigResolved({ command: 'serve', root, router: { internals: { routes } } })

    const content = readRoutesDts(root)
    expect(content).toBe('')
  })
})
