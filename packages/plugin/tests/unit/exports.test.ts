import { describe, expect, it, vi } from 'vitest'
import { components, hooks } from '../../src'
import { typedRoutes } from '../../src/plugin'

vi.mock('@solidjs/router', () => ({
  A: () => null,
  Navigate: () => null,
  useNavigate: () => () => {},
  useParams: () => ({}),
  useMatch: () => () => undefined,
}))

describe('package exports', () => {
  it('exposes components, hooks, and typedRoutes', () => {
    expect(typeof components).toBe('function')
    expect(typeof hooks).toBe('function')
    expect(typeof typedRoutes).toBe('function')
  })
})
