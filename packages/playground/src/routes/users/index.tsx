import { For } from 'solid-js'
import { A } from '../../router'

export default function Users() {
  const ids = ['1', '2', '3']
  return (
    <div>
      <h2>Users</h2>
      <ul>
        <For each={ids}>
          {id => (
            <li>
              <A href="/users/:id" params={{ id }}>{`User ${id}`}</A>
            </li>
          )}
        </For>
      </ul>
      <A href="/">Back</A>
    </div>
  )
}
