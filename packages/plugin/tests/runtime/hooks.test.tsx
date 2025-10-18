import { describe, expect, it, vi } from 'vitest'

const navCalls = vi.hoisted(() => [] as Array<{ to: string, options: any }>)

vi.mock('@solidjs/router', () => ({
  useNavigate: () => (to: string, options?: any) => {
    navCalls.push({ to, options })
  },
  useParams: () => ({}),
  useMatch: () => () => undefined,
  A: () => null,
  Navigate: () => null,
}))

const { hooks } = await import('../../src')

type Path = '/' | '/users' | '/users/:id' | '/search/:q?'
interface Params {
  '/users/:id': { id: string }
  '/search/:q?': { q?: string }
}

const H = hooks<Path, Params>()

describe('hooks.useNavigate', () => {
  it('navigates with required params', () => {
    navCalls.length = 0
    const nav = H.useNavigate()
    nav('/users/:id', { params: { id: '99' } })
    expect(navCalls[0]?.to).toBe('/users/99')
  })

  it('navigates with optional param omitted', () => {
    navCalls.length = 0
    const nav = H.useNavigate()
    nav('/search/:q?')
    expect(navCalls[0]?.to).toBe('/search')
  })
})
