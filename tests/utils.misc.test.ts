import { describe, expect, it, vi } from 'vitest'
import { debounce, uniqueSorted } from '../src/utils'

describe('uniqueSorted', () => {
  it('dedupes and sorts lexicographically', () => {
    expect(uniqueSorted(['b', 'a', 'a', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('works with numbers (string sort behavior)', () => {
    expect(uniqueSorted([10, 2, 2, 1])).toEqual([1, 10, 2])
  })
})

describe('debounce', () => {
  it('delays execution and only runs once per burst', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = debounce(spy, 100)

    fn('a')
    fn('b')
    fn('c')

    expect(spy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(99)
    expect(spy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith('c')

    vi.useRealTimers()
  })

  it('resets timer on subsequent calls', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = debounce(spy, 50)

    fn('x')
    vi.advanceTimersByTime(40)
    fn('y')
    vi.advanceTimersByTime(40)
    expect(spy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(10)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith('y')

    vi.useRealTimers()
  })
})
