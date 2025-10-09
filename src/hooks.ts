import type { MatchFilters } from '@solidjs/router'
import type { Accessor } from 'solid-js'
import type { NavigateOptions } from './types'

import { useMatch, useNavigate, useParams } from '@solidjs/router'
import { generatePath } from './utils'

export function hooks<Path extends string, Params extends Record<string, any>>() {
  return {
    useParams: <P extends keyof Params>() => useParams<Params[P]>() as Params[P],
    useNavigate: () => {
      const navigate = useNavigate()
      return <P extends Path>(href: P, ...[options]: NavigateOptions<P, Params>) => {
        navigate(options?.params ? generatePath(href, options.params) : href, options)
      }
    },
    useMatch: <P extends Path>(path: () => P, matchFilters?: MatchFilters<P>) => {
      return useMatch(path, matchFilters) as Accessor<{ path: P, params: Params[P] } | undefined>
    },
  }
}
