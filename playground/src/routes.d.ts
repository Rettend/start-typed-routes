/* eslint-disable */

export type Path =
  | '/'
  | '/users'
  | '/users/:id'
  | '/search/:q?'

export type Params = {
  '/users/:id': { id: string }
  '/search/:q?': { q?: string }
}
