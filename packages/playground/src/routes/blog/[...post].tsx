import { useParams } from '../../router'

export default function BlogCatchAll() {
  const params = useParams<'/blog/*post'>()
  return <div>Blog post path: {params.post}</div>
}
