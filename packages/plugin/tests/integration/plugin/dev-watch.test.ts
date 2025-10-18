import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { typedRoutes } from '../../../src/plugin'
import { hookHandler } from '../../helpers/vite'

type Listener = (...args: any[]) => void

class FakeWatcher {
  listeners = new Map<string, Listener[]>()
  once(event: string, cb: Listener) {
    const arr = this.listeners.get(event) ?? []
    arr.push((...args) => {
      cb(...args)
      this.listeners.set(event, (this.listeners.get(event) ?? []).filter(l => l !== cb))
    })
    this.listeners.set(event, arr)
  }

  on(event: string, cb: Listener) {
    const arr = this.listeners.get(event) ?? []
    arr.push(cb)
    this.listeners.set(event, arr)
  }

  emit(event: string, ...args: any[]) {
    for (const cb of this.listeners.get(event) ?? [])
      cb(...args)
  }
}

function makeTempRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'route-types-dev-'))
  fs.mkdirSync(path.join(dir, 'src', 'routes'), { recursive: true })
  return dir
}

function readRoutesDts(root: string) {
  const p = path.join(root, 'src', 'routes.d.ts')
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : ''
}

describe('plugin: dev watch', () => {
  it('generates on ready and debounces subsequent file changes', async () => {
    vi.useFakeTimers()

    const root = makeTempRoot()
    const plugin = typedRoutes()
    const watcher = new FakeWatcher()

    const server = {
      config: {
        root,
        router: {
          internals: {
            routes: [
              { path: '/' },
              { path: '/users', children: [
                { path: '/:id' },
                { path: '/:id?' },
              ] },
              { path: '/search', children: [{ path: '/:q?' }] },
            ],
          },
        },
      },
      watcher,
    }

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    const onConfigureServer = hookHandler(plugin.configureServer)
    onConfigureServer(server)

    watcher.emit('ready')
    await Promise.resolve()
    expect(readRoutesDts(root)).toContain('export type Path =')
    expect(log).toHaveBeenCalledTimes(1)

    const routeFile = path.join(root, 'src', 'routes', 'index.tsx')
    fs.writeFileSync(routeFile, '// test', 'utf-8')

    watcher.emit('all', 'change', routeFile)
    watcher.emit('all', 'change', routeFile)
    server.config.router.internals.routes.push({ path: '/new' })
    watcher.emit('all', 'change', routeFile)

    vi.advanceTimersByTime(40)
    expect(log).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(20)

    await Promise.resolve()

    expect(log).toHaveBeenCalledTimes(2)

    log.mockRestore()
    vi.useRealTimers()
  })

  it('ignores files outside routes dir', async () => {
    vi.useFakeTimers()

    const root = makeTempRoot()
    const plugin = typedRoutes()
    const watcher = new FakeWatcher()

    const server = {
      config: { root, router: { internals: { routes: [{ path: '/' }] } } },
      watcher,
    }

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    const onConfigureServer = hookHandler(plugin.configureServer)
    onConfigureServer(server)

    watcher.emit('ready')
    await Promise.resolve()
    expect(log).toHaveBeenCalledTimes(1)

    const otherFile = path.join(root, 'src', 'other.ts')
    fs.writeFileSync(otherFile, '// other', 'utf-8')
    watcher.emit('all', 'change', otherFile)

    vi.advanceTimersByTime(100)
    await Promise.resolve()

    expect(log).toHaveBeenCalledTimes(1)

    log.mockRestore()
    vi.useRealTimers()
  })
})
