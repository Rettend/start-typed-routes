import { useParams } from '../../router'

export default function Search() {
  const params = useParams<'/search/:q?'>()
  return (
    <div>
      <h2>Search</h2>
      <p>Query: {params.q ?? '(empty)'}</p>
    </div>
  )
}
