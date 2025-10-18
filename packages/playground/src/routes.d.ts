/* eslint-disable */

export type Path =
  | '/'
  | '/search/:q?'
  | '/users'
  | '/users/:id'

export type Params = {
  '/search/:q?': { q?: string };
  '/users/:id': { id: string }
}
