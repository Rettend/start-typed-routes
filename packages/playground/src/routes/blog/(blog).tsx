import type { RouteSectionProps } from '@solidjs/router'

export default function BlogLayout(props: RouteSectionProps) {
  return (
    <div>
      <h2>Blog Layout</h2>
      {props.children}
    </div>
  )
}
