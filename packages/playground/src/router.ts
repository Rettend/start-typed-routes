import type { Params, Path } from './routes'
import { components, hooks } from 'start-typed-routes'

export const { A, Navigate } = components<Path, Params>()
export const { useParams, useNavigate, useMatch } = hooks<Path, Params>()
