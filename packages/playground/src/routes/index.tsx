import { A } from '../router'

export default function Home() {
  return (
    <div>
      <h2>Home</h2>
      <ul>
        <li><A href="/users">Users</A></li>
        <li><A href="/users/:id" params={{ id: '42' }}>User 42</A></li>
        <li><A href="/search/:q?">Search (no q)</A></li>
        <li><A href="/search/:q?" params={{ q: 'solid' }}>Search solid</A></li>
      </ul>
    </div>
  )
}
