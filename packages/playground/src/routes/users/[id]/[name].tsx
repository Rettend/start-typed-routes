import { useParams } from '../../../router'

export default function UserName() {
  const params = useParams<'/users/:id/:name'>()
  return <div>User {params.id}, Name {params.name}</div>
}
