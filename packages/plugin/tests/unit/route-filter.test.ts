import { describe, expect, it } from 'vitest'
import { DEFAULT_EXCLUDE, filterPaths, normalizeExcludePatterns } from '../../src/route-filter'

const samplePaths = ['/', '/api', '/api/users', '/blog', '/blog/post', '/admin/settings']

describe('normalizeExcludePatterns', () => {
  it('uses default when undefined', () => {
    expect(normalizeExcludePatterns()).toEqual(Array.from(DEFAULT_EXCLUDE))
  })

  it('ensures leading slash and trims values', () => {
    expect(normalizeExcludePatterns(' blog/* ')).toEqual(['/blog/*'])
    expect(normalizeExcludePatterns(['api/**', ' /admin '])).toEqual(['/api/**', '/admin'])
  })

  it('preserves empty array to disable defaults', () => {
    expect(normalizeExcludePatterns([])).toEqual([])
  })
})

describe('filterPaths', () => {
  it('removes paths that match glob patterns', () => {
    const filtered = filterPaths(samplePaths, ['/api/**', '/blog/*'])
    expect(filtered).toEqual(['/', '/blog', '/admin/settings'])
  })

  it('returns original array when patterns empty', () => {
    expect(filterPaths(samplePaths, [])).toEqual(samplePaths)
  })
})
