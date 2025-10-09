import type { JSX } from 'solid-js'
import { Route, Router } from '@solidjs/router'

export function withRouter(children: JSX.Element) {
  const Wrapper = () => children
  return (
    <Router>
      <Route path="/" component={Wrapper} />
    </Router>
  )
}
