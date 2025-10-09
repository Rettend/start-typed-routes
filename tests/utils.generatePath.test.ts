import { describe, expect, it } from 'vitest'
import { generatePath } from '../src/utils'

describe('generatePath', () => {
  it('replaces required params', () => {
    expect(generatePath('/users/:id', { id: '42' })).toBe('/users/42')
  })

  it('drops missing required params segment', () => {
    expect(generatePath('/users/:id', {})).toBe('/users')
    expect(generatePath('/users/:id', { id: undefined })).toBe('/users')
  })

  it('handles optional params present or absent', () => {
    expect(generatePath('/search/:q?', { q: 'solid' })).toBe('/search/solid')
    expect(generatePath('/search/:q?', {})).toBe('/search')
    expect(generatePath('/search/:q?', { q: undefined })).toBe('/search')
  })

  it('supports multiple params', () => {
    expect(
      generatePath('/teams/:teamId/users/:userId', { teamId: 't1', userId: 'u2' }),
    ).toBe('/teams/t1/users/u2')

    expect(
      generatePath('/teams/:teamId/users/:userId', { teamId: 't1' }),
    ).toBe('/teams/t1/users')
  })

  it('treats empty string as missing (falsy)', () => {
    expect(generatePath('/users/:id', { id: '' })).toBe('/users')
  })

  it('preserves trailing slash semantics of template', () => {
    expect(generatePath('/users/:id/', { id: '1' })).toBe('/users/1/')
    expect(generatePath('/users/:id/', {})).toBe('/users/')
  })
})
