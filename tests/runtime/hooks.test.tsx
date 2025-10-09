import { describe, expect, it, vi } from 'vitest'

const navCalls = vi.hoisted(() => [] as Array<{ to: string, options: any }>)

vi.mock('@solidjs/router', async (importActual) => {
  const actual = await importActual<any>()
  return {
    ...actual,
    useNavigate: () => (to: string, options?: any) => {
      navCalls.push({ to, options })
    },
  }
})

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
