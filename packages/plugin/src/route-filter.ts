import picomatch from 'picomatch'

export type ExcludePattern = string | string[]

export const DEFAULT_EXCLUDE = ['/api/**'] as const

export function normalizeExcludePatterns(exclude?: ExcludePattern): string[] {
  const source = exclude === undefined
    ? DEFAULT_EXCLUDE
    : Array.isArray(exclude)
      ? exclude
      : [exclude]

  return source
    .map(pattern => pattern?.trim())
    .filter((pattern): pattern is string => Boolean(pattern))
    .map(pattern => (pattern.startsWith('/') ? pattern : `/${pattern}`))
}

export function filterPaths(paths: string[], excludePatterns: string[]): string[] {
  if (!excludePatterns.length)
    return paths

  const matchers = excludePatterns.map(pattern => picomatch(pattern, { dot: true }))
  return paths.filter(path => !matchers.some(match => match(path)))
}
