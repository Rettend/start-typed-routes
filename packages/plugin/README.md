# start-typed-routes

Add strong, ergonomic types to SolidStart routes. Generate a `Path` union and `Params` map from your app routes, and use typed `<A>`, `<Navigate>`, and hooks that mirror `@solidjs/router` but with route-aware params.

- Zero-runtime DX helpers (tiny wrapper over Solid Router)
- Route types generated automatically at dev/build
- Supports optional params (`:id?`) and catch-all (`*rest`)
- Works with SolidStart / Vinxi projects

## Installation

Peer dependencies:

- `solid-js` >= 1.9.0
- `@solidjs/router` >= 0.15.0

Install the package:

```sh
bun add start-typed-routes
# or
npm i start-typed-routes
# or
yarn add start-typed-routes
```

## Route types generator

Register the plugin so it emits `src/routes.d.ts` for your app. The file contains:

- `export type Path = ...` (string union of all routes)
- `export type Params = { [path in Path]?: ... }` (only paths with params appear)

Example SolidStart config:

```ts
// app.config.ts
import { defineConfig } from '@solidjs/start/config'
import { typedRoutes } from 'start-typed-routes/plugin'

export default defineConfig({
  vite: {
    plugins: [typedRoutes() as any],
  },
})
```

Notes:

- Removes group segments like `(group)` from paths when generating types.
- Handles `:param`, `:param?`, and `*catchAll`.
- Writes to `src/routes.d.ts` only when content changes.

## Usage

In your app, bind the helpers to the generated types:

```ts
// src/router.ts
import type { Params, Path } from './routes'
import { components, hooks } from 'start-typed-routes'

export const { A, Navigate } = components<Path, Params>()
export const { useParams, useNavigate, useMatch } = hooks<Path, Params>()
```

Then use them in components:

```tsx
<>
  {/* Typed links */}
  <A href="/users">Users</A>
  <A href="/users/:id" params={{ id: '42' }}>User 42</A>
  <A href="/search/:q?">Search optional</A>
  <A href="/blog/*post" params={{ post: 'foo/bar' }}>Deep post</A>

  {/* Typed navigation */}
  {(() => {
    const navigate = useNavigate()
    navigate('/users/:id', { params: { id: '123' }, replace: true })
    return null
  })()}

  {/* Typed params */}
  {(() => {
    const params = useParams<'/users/:id'>()
    //    ^? { id: string }
    return null
  })()}

  {/* Typed match */}
  {(() => {
    const match = useMatch(() => '/users/:id')
    //          ^? Accessor<{ path: '/users/:id', params: { id: string } } | undefined>
    return null
  })()}
</>
```

## API

- `components<Path, Params>()`
  - `A(props: AnchorProps<Path, Params>)`
  - `Navigate(props: NavigateProps<Path, Params>)`
- `hooks<Path, Params>()`
  - `useParams<P extends keyof Params>(): Params[P]`
  - `useNavigate(): (href: Path, ...[options]: NavigateOptions<Path, Params>) => void`
  - `useMatch<P extends Path>(path: () => P, filters?): Accessor<{ path: P; params: Params[P] } | undefined>`

Types ensure that:

- `params` is required only when the route requires it.
- Optional params (`:q?`) make `params.q` optional.
- Routes without params disallow `params`.

## Playground

There’s a working example under `packages/playground`. It uses the plugin directly from source for quick iteration.

## Requirements

- Node >= 18.17
- Solid Router / SolidJS versions per peer deps

## License

MIT © Contributors
