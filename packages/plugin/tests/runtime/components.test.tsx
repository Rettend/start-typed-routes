import { render, screen } from '@solidjs/testing-library'
import { describe, expect, it, vi } from 'vitest'

const anchorCalls = vi.hoisted(() => [] as any[])
const navigateCalls = vi.hoisted(() => [] as any[])

vi.mock('@solidjs/router', () => ({
  A: (props: any) => {
    anchorCalls.push(props)
    return <a {...props} />
  },
  Navigate: (props: any) => {
    navigateCalls.push(props)
    return <a data-navigate {...props} />
  },
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
    render(() => <A href="/users/:id" params={{ id: '42' }}>go</A>)
    const link = screen.getByText('go') as HTMLAnchorElement
    expect(link.getAttribute('href') || '').toMatch(/\/users\/42$/)
    expect(anchorCalls[0]?.href).toBe('/users/42')
  })

  it('omits optional param when absent', () => {
    anchorCalls.length = 0
    render(() => <A href="/search/:q?">search</A>)
    const link = screen.getByText('search') as HTMLAnchorElement
    expect(link.getAttribute('href') || '').toMatch(/\/search$/)
    expect(anchorCalls[0]?.href).toBe('/search')
  })

  it('passes through other props', () => {
    anchorCalls.length = 0
    render(() => <A href="/users" rel="noreferrer" target="_blank">x</A>)
    const link = screen.getByText('x') as HTMLAnchorElement
    expect(link.rel).toBe('noreferrer')
    expect(link.target).toBe('_blank')
    expect(anchorCalls[0]?.rel).toBe('noreferrer')
    expect(anchorCalls[0]?.target).toBe('_blank')
  })
})

describe('components.Navigate', () => {
  it('computes href when rendered', () => {
    navigateCalls.length = 0
    render(() => <Navigate href="/users/:id" params={{ id: '7' }} />)
    expect(navigateCalls[0]?.href).toBe('/users/7')
  })
})
