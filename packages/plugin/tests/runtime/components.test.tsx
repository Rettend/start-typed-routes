import { describe, expect, it, vi } from 'vitest'

const anchorCalls = vi.hoisted(() => [] as any[])
const navigateCalls = vi.hoisted(() => [] as any[])

vi.mock('@solidjs/router', () => ({
  A: (props: any) => {
    anchorCalls.push(props)
    return null
  },
  Navigate: (props: any) => {
    navigateCalls.push(props)
    return null
  },
  useNavigate: () => () => {},
  useParams: () => ({}),
  useMatch: () => () => undefined,
}))

const { components } = await import('../../src')

type Path = '/' | '/users' | '/users/:id' | '/search/:q?'
interface Params {
  '/users/:id': { id: string }
  '/search/:q?': { q?: string }
}

const { A, Navigate } = components<Path, Params>()

describe('components.A', () => {
  it('computes href with required param', () => {
    anchorCalls.length = 0
    A({ href: '/users/:id', params: { id: '42' }, children: 'go' })
    expect(anchorCalls[0]?.href).toBe('/users/42')
  })

  it('omits optional param when absent', () => {
    anchorCalls.length = 0
    A({ href: '/search/:q?', children: 'search' })
    expect(anchorCalls[0]?.href).toBe('/search')
  })

  it('passes through other props', () => {
    anchorCalls.length = 0
    A({ href: '/users', rel: 'noreferrer', target: '_blank', children: 'x' })
    expect(anchorCalls[0]?.rel).toBe('noreferrer')
    expect(anchorCalls[0]?.target).toBe('_blank')
  })
})

describe('components.Navigate', () => {
  it('computes href when invoked', () => {
    navigateCalls.length = 0
    Navigate({ href: '/users/:id', params: { id: '7' } })
    expect(navigateCalls[0]?.href).toBe('/users/7')
  })
})
