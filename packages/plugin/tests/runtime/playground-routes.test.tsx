import type { Params, Path } from '../../../playground/src/routes'
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

const { A, Navigate } = components<Path, Params>()

function reset() {
  anchorCalls.length = 0
  navigateCalls.length = 0
}

describe('playground routes: components.A', () => {
  it('renders static links', () => {
    reset()
    A({ href: '/' })
    A({ href: '/about-us' })
    A({ href: '/contact-us' })
    A({ href: '/blog' })
    A({ href: '/blog/article-1' })
    A({ href: '/blog/article-2' })
    A({ href: '/users' })
    A({ href: '/users/projects' })
    expect(anchorCalls.map(c => c.href)).toEqual([
      '/',
      '/about-us',
      '/contact-us',
      '/blog',
      '/blog/article-1',
      '/blog/article-2',
      '/users',
      '/users/projects',
    ])
  })

  it('renders dynamic links', () => {
    reset()
    A({ href: '/users/:id', params: { id: '7' } })
    A({ href: '/users/:id/:name', params: { id: '7', name: 'bob' } })
    expect(anchorCalls.map(c => c.href)).toEqual(['/users/7', '/users/7/bob'])
  })

  it('renders optional params route', () => {
    reset()
    A({ href: '/search/:q?' })
    A({ href: '/search/:q?', params: { q: 'x' } })
    expect(anchorCalls.map(c => c.href)).toEqual(['/search', '/search/x'])
  })

  it('renders catch-all star param', () => {
    reset()
    A({ href: '/blog/*post', params: { post: 'foo/bar' } })
    expect(anchorCalls.map(c => c.href)).toEqual(['/blog/foo/bar'])
  })
})

describe('playground routes: components.Navigate', () => {
  it('computes href similarly to A', () => {
    reset()
    Navigate({ href: '/users/:id', params: { id: '99' } })
    Navigate({ href: '/search/:q?' })
    Navigate({ href: '/blog/*post', params: { post: 'a/b' } })
    expect(navigateCalls.map(c => c.href)).toEqual(['/users/99', '/search', '/blog/a/b'])
  })
})
