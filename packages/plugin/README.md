<h1 align="center">start-typed-routes</h1>
<p align="center">
  Add strong types to SolidStart routes.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/start-typed-routes"><img src="https://img.shields.io/npm/v/start-typed-routes?color=red" alt="NPM Version"></a>
</p>

- Zero-runtime DX helpers (dev-only wrapper over Solid Router)
- Route types generated automatically at dev/build
- Supports all file based routing conventions of SolidStart

## Installation

```sh
bun i -D start-typed-routes
```

## Setup

```ts
// app.config.ts
import { defineConfig } from '@solidjs/start/config'
import { typedRoutes } from 'start-typed-routes/plugin'

export default defineConfig({
  vite: {
    plugins: [typedRoutes()],
  },
})
```

In your app, bind the helpers to the generated types:

```ts
// src/router.ts
import type { Params, Path } from './routes'
import { components, hooks } from 'start-typed-routes'

export const { A, Navigate } = components<Path, Params>()
export const { useParams, useNavigate, useMatch } = hooks<Path, Params>()
export type { Params, Path }
```

## Usage

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
    //    ^? Accessor<{ path: '/users/:id', params: { id: string } } | undefined>
    return null
  })()}
</>
```

## Supported route syntax

- Dynamic segment: `routes/users/[id].tsx` -> `/users/:id`
- Optional segment: `routes/search/[[q]].tsx` -> `/search/:q?`
- Catch-all: `routes/blog/[...post].tsx` -> `/blog/*post`
- Grouping folders/files: `(...)` are omitted in URLs (e.g. `routes/(static)/about-us/index.tsx` -> `/about-us`)

## License

MIT
