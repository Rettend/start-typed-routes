import { A } from '../router'

export default function Home() {
  return (
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
  )
}
