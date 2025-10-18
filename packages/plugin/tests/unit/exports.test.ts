import { describe, expect, it, vi } from 'vitest'
import { components, hooks } from '../../src'
import { routeTypeGenerator } from '../../src/plugin'

vi.mock('@solidjs/router', () => ({
  A: () => null,
  Navigate: () => null,
  useNavigate: () => () => {},
  useParams: () => ({}),
  useMatch: () => () => undefined,
}))

describe('package exports', () => {
  it('exposes components, hooks, and routeTypeGenerator', () => {
    expect(typeof components).toBe('function')
    expect(typeof hooks).toBe('function')
    expect(typeof routeTypeGenerator).toBe('function')
  })
})
