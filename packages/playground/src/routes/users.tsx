import type { RouteSectionProps } from '@solidjs/router'

export default function UsersLayout(props: RouteSectionProps) {
  return (
    <div>
      <h2>Users Layout</h2>
      {props.children}
    </div>
  )
}
