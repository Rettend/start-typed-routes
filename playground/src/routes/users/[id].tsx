import { useNavigate, useParams } from '../../router'

export default function UserDetail() {
  const params = useParams<'/users/:id'>()
  const nav = useNavigate()
  return (
    <div>
      <h2>User {params.id}</h2>
      <button type="button" onClick={() => nav('/')}>Back</button>
    </div>
  )
}
