import type { AnchorProps, NavigateProps } from './types'
import { A, Navigate } from '@solidjs/router'
import { untrack } from 'solid-js'
import { generatePath } from './utils'

export function components<Path extends string, Params extends Record<string, any>>() {
  return {
    A: <P extends Path>(props: AnchorProps<P, Params>) => {
      const { params, href, ...rest } = props as AnchorProps<P, Params> & { params?: Record<string, string | undefined> }
      const finalHref = untrack(() => generatePath(href, (params ?? {}) as Record<string, string | undefined>))
      return <A {...rest} href={finalHref} />
    },
    Navigate: <P extends Path>(props: NavigateProps<P, Params>) => {
      const { params, href, ...rest } = props as NavigateProps<P, Params> & { params?: Record<string, string | undefined> }
      const finalHref = untrack(() => generatePath(href, (params ?? {}) as Record<string, string | undefined>))
      return <Navigate {...rest} href={finalHref} />
    },
  }
}
