type ObjectHook<T extends (...args: any[]) => any> = T | { handler: T }
type AnyHookFn = (this: any, ...args: any[]) => any

export function hookHandler<T extends AnyHookFn>(hook: ObjectHook<T> | undefined | null) {
  const fn: T | undefined = typeof hook === 'function' ? hook : hook?.handler
  return (...args: any[]) => {
    if (!fn)
      return
    return fn.call({}, ...args)
  }
}
