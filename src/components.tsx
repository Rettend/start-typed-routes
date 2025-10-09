import type { AnchorProps, NavigateProps } from './types'

import { A, Navigate } from '@solidjs/router'
import { generatePath } from './utils'

export function components<Path extends string, Params extends Record<string, any>>() {
  return {
    A: <P extends Path>(props: AnchorProps<P, Params>) => {
      return <A {...props} href={props.params ? generatePath(props.href, props.params) : props.href} />
    },
    Navigate: <P extends Path>(props: NavigateProps<P, Params>) => {
      return <Navigate {...props} href={props.params ? generatePath(props.href, props.params) : props.href} />
    },
  }
}
