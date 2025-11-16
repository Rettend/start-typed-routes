import { A as RouterA } from '@solidjs/router'
import { createSignal } from 'solid-js'
import { A } from '../router'

function SidebarExample() {
  const [collapsed, setCollapsed] = createSignal(false)

  return (
    <aside style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <button
        type="button"
        onClick={() => setCollapsed(prev => !prev)}
      >
        Toggle sidebar (collapsed:
        {' '}
        {String(collapsed())}
        )
      </button>

      <div style={{ 'margin-top': '1rem' }}>
        <p>Typed `A` from `start-typed-routes` (uses `classList`)</p>
        <A
          href="/"
          class="sidebar-link"
          classList={{
            'is-expanded': !collapsed(),
            'is-collapsed': collapsed(),
          }}
        >
          Typed link (start-typed-routes)
        </A>
      </div>

      <div style={{ 'margin-top': '1rem' }}>
        <p>`A` from `@solidjs/router` (uses the same `classList`)</p>
        <RouterA
          href="/"
          class="sidebar-link"
          classList={{
            'is-expanded': !collapsed(),
            'is-collapsed': collapsed(),
          }}
        >
          Router link (@solidjs/router)
        </RouterA>
      </div>
    </aside>
  )
}

export default function Home() {
  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <SidebarExample />

      <div>
        <h2>Home</h2>
        <ul>
          <li><A href="/">Home</A></li>
          <li><A href="/about-us">About Us</A></li>
          <li><A href="/contact-us">Contact Us</A></li>

          <li><A href="/users">Users</A></li>
          <li><A href="/users/projects">Users Projects</A></li>
          <li><A href="/users/:id" params={{ id: '42' }}>User 42</A></li>
          <li><A href="/users/:id/:name" params={{ id: '42', name: 'alice' }}>User 42, alice</A></li>

          <li><A href="/blog">Blog</A></li>
          <li><A href="/blog/article-1">Blog Article 1</A></li>
          <li><A href="/blog/article-2">Blog Article 2</A></li>
          <li><A href="/blog/*post" params={{ post: 'foo/bar' }}>Blog catch-all foo/bar</A></li>

          <li><A href="/search/:q?">Search (no q)</A></li>
          <li><A href="/search/:q?" params={{ q: 'solid' }}>Search solid</A></li>
        </ul>
      </div>
    </div>
  )
}
