import { describe, expect, it } from 'vitest'
import * as entry from '../src'

describe('package exports', () => {
  it('exposes components, hooks, routeTypeGenerator, and utils', () => {
    expect(typeof entry.components).toBe('function')
    expect(typeof entry.hooks).toBe('function')
    expect(typeof entry.routeTypeGenerator).toBe('function')
    expect(typeof entry.generatePath).toBe('function')
  })
})
