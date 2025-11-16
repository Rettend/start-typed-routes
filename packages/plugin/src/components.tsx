import type { AnchorProps, NavigateProps } from './types'
import { A as SolidA, Navigate as SolidNavigate } from '@solidjs/router'
import { splitProps, untrack } from 'solid-js'
import { generatePath } from './utils'

export function components<Path extends string, Params extends Record<string, any>>() {
  return {
    A: <P extends Path>(props: AnchorProps<P, Params>) => {
      const [local, rest] = splitProps(
        props as AnchorProps<P, Params> & { params?: Record<string, string | undefined> },
        ['params', 'href'],
      )
  
      const finalHref = untrack(() =>
        generatePath(local.href, (local.params ?? {}) as Record<string, string | undefined>),
      )
  
      return (
        <SolidA
          {...rest}
          href={finalHref}
        />
      )
    },
    Navigate: <P extends Path>(props: NavigateProps<P, Params>) => {
      const [local, rest] = splitProps(
        props as NavigateProps<P, Params> & { params?: Record<string, string | undefined> },
        ['params', 'href'],
      )
  
      const finalHref = untrack(() =>
        generatePath(local.href, (local.params ?? {}) as Record<string, string | undefined>),
      )
  
      return (
        <SolidNavigate
          {...rest}
          href={finalHref}
        />
      )
    },
  }
}
