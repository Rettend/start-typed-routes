import type { AnchorProps, NavigateOptions, NavigateProps } from '../../src/types'
import { describe, expectTypeOf, it } from 'vitest'

type _Path = '/' | '/users' | '/users/:id' | '/search/:q?'
interface Params {
  '/users/:id': { id: string }
  '/search/:q?': { q?: string }
}

describe('types: component props', () => {
  it('anchorProps for no-params path forbids params', () => {
    type P = AnchorProps<'/users', Params>
    expectTypeOf<P>().toExtend<{ href: '/users', params?: never }>()
    // @ts-expect-error params not allowed for /users
    const bad: P = { href: '/users', params: { stuff: 'x' } }
    void bad
  })

  it('anchorProps for required params requires params', () => {
    type P = AnchorProps<'/users/:id', Params>
    expectTypeOf<P>().toExtend<{ href: '/users/:id', params: { id: string } }>()
    // @ts-expect-error missing params
    const bad: P = { href: '/users/:id' }
    void bad
  })

  it('anchorProps for optional params allows omission', () => {
    type P = AnchorProps<'/search/:q?', Params>
    expectTypeOf<P>().toExtend<{ href: '/search/:q?', params?: { q?: string } }>()
  })

  it('navigateProps mirrors AnchorProps rules', () => {
    type P1 = NavigateProps<'/users', Params>
    expectTypeOf<P1>().toExtend<{ href: '/users', params?: never }>()

    type P2 = NavigateProps<'/users/:id', Params>
    expectTypeOf<P2>().toExtend<{ href: '/users/:id', params: { id: string } }>()
  })
})

describe('types: NavigateOptions tuple', () => {
  it('required params => one options arg with params required', () => {
    type Opt = NavigateOptions<'/users/:id', Params>
    const accepts = (...args: Opt) => void args
    accepts({ params: { id: 'x' } })
    // @ts-expect-error empty tuple not allowed for required params
    accepts()
    // @ts-expect-error missing params is invalid
    accepts({ replace: true })
  })

  it('optional params => zero or one options arg (params optional)', () => {
    type Opt = NavigateOptions<'/search/:q?', Params>
    const accepts = (...args: Opt) => void args
    accepts()
    accepts({})
    accepts({ params: {} })
    accepts({ params: { q: 'solid' }, replace: true })
  })

  it('no params => zero or one options arg; params not allowed', () => {
    type Opt = NavigateOptions<'/users', Params>
    const accepts = (...args: Opt) => void args
    accepts()
    accepts({ replace: true })
    // @ts-expect-error params field should not be allowed
    accepts({ params: { stuff: 'x' } })
  })
})
