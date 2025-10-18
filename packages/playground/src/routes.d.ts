/* eslint-disable */

export type Path =
  | '/'
  | '/about-us'
  | '/blog'
  | '/blog/*post'
  | '/blog/article-1'
  | '/blog/article-2'
  | '/contact-us'
  | '/search/:q?'
  | '/users'
  | '/users/:id'
  | '/users/:id/:name'
  | '/users/projects'

export type Params = {
  '/blog/*post': { post: string }
  '/search/:q?': { q?: string }
  '/users/:id': { id: string }
  '/users/:id/:name': { id: string, name: string }
}
