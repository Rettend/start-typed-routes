export function generatePath(path: string, params: Record<string, string | undefined>) {
  return path.replace(/\/:(\w+)(\??)/g, (_, segment) => (params[segment] ? `/${params[segment]}` : ''))
}

export function uniqueSorted<T>(items: T[]): T[] {
  return [...new Set(items)].sort() as T[]
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number): T {
  let timer: NodeJS.Timeout | undefined
  return ((...args: any[]) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delayMs)
  }) as T
}
