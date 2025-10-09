import { render, screen } from '@solidjs/testing-library'
import { expect, it } from 'vitest'
import { MyButton } from '../src'

it('button', () => {
  render(() => <MyButton type="primary" />)

  const buttonElement = screen.getByText(/my button: type primary/i)

  expect(buttonElement.outerHTML).toMatchInlineSnapshot(
    `"<button class="my-button">my button: type primary</button>"`,
  )
})
