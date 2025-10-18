/// <reference path="./vinxi.d.ts" />

import type { Logger, Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { debounce, uniqueSorted } from './utils'

interface Route {
  path: string
  children?: Route[]
}

function extractPaths(routes: Route[], parentPath = ''): string[] {
  let paths: string[] = []
  for (const route of routes) {
    const raw = route.path.startsWith('/') ? route.path.substring(1) : route.path
    const normalizedCurrent = raw
      .split('/')
      .filter(Boolean)
      .map(segment => segment.replace(/\([^)]*\)/g, ''))
      .filter(Boolean)
      .join('/')
    const fullPath = [parentPath, normalizedCurrent]
      .filter(Boolean)
      .join('/')

    paths.push(fullPath === '' ? '/' : `/${fullPath.replace(/\/$/, '')}`)

    if (route.children)
      paths = paths.concat(extractPaths(route.children, fullPath))
  }
  return paths
}

function generateParamsType(paths: string[]): string {
  const params: string[] = []
  const paramRegex = /:(\w+\??)/g
  const catchAllRegex = /\*(\w+)/g

  for (const path of paths) {
    const colonParams = Array.from(path.matchAll(paramRegex))
    const starParams = Array.from(path.matchAll(catchAllRegex))
    if (colonParams.length > 0 || starParams.length > 0) {
      const paramDefs: string[] = []
      for (const match of colonParams) {
        const paramName = match[1]
        if (paramName?.endsWith('?'))
          paramDefs.push(`${paramName.slice(0, -1)}?: string`)
        else
          paramDefs.push(`${paramName}: string`)
      }
      for (const match of starParams) {
        const name = match[1]
        paramDefs.push(`${name}: string`)
      }
      params.push(`  '${path}': { ${paramDefs.join(', ')} }`)
    }
  }

  if (params.length === 0)
    return 'export type Params = {}'

  return `export type Params = {\n${params.join('\n')}\n}`
}

async function getRoutesFromSource(source: any): Promise<Route[] | undefined> {
  if (!source)
    return undefined
  if (typeof source.getRoutes === 'function')
    return await source.getRoutes()
  if (typeof source.toJSON === 'function')
    return source.toJSON()
  if (Array.isArray(source))
    return source as Route[]
  return undefined
}

function buildTypesContent(allPaths: string[]): string {
  const pathUnion = allPaths.map(p => `  | '${p}'`).join('\n')
  const pathType = `export type Path =\n${pathUnion}`
  const paramsType = generateParamsType(allPaths)
  return `/* eslint-disable */\n\n${pathType}\n\n${paramsType}\n`
}

function writeIfChanged(outputPath: string, content: string, logSuffix: string, logger?: Logger) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  const prev = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf-8') : ''
  if (prev !== content) {
    fs.writeFileSync(outputPath, content, 'utf-8')
    const msg = `[route-types] ${logSuffix} ${outputPath}`
    // eslint-disable-next-line no-console
    void (logger?.info ?? console.log)(msg)
  }
}

async function generateRouteTypes(root: string, routesSource: any, logSuffix: string, logger?: Logger) {
  const routes = await getRoutesFromSource(routesSource)
  if (!routes || routes.length === 0)
    return

  const allPaths = uniqueSorted(extractPaths(routes))
  const content = buildTypesContent(allPaths)
  const outputPath = path.resolve(root, 'src/routes.d.ts')
  writeIfChanged(outputPath, content, logSuffix, logger)
}

export function routeTypeGenerator(): Plugin {
  return {
    name: 'solid-start-route-types',
    enforce: 'post',
    async configResolved(config) {
      if (config.command === 'serve')
        return
      try {
        await generateRouteTypes(
          config.root,
          config.router?.internals?.routes,
          'Generated route types at:',
          config.logger,
        )
      }
      catch {}
    },
    configureServer(server) {
      const generate = async () => {
        try {
          await generateRouteTypes(
            server.config.root,
            server.config.router?.internals?.routes,
            'Generated route types (dev) at:',
            server.config.logger,
          )
        }
        catch {}
      }

      server.watcher.once('ready', generate)

      const routesDir = path.resolve(server.config.root, 'src/routes') + path.sep
      const schedule = debounce(generate, 50)
      server.watcher.on('all', (_, file) => {
        if (!file)
          return
        const full = path.resolve(file)
        if (full.startsWith(routesDir))
          schedule()
      })
    },
  }
}
