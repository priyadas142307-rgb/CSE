import { useEffect, useState } from 'react'
import { getHomeStatus } from '../services/api'

function TestBackend() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getHomeStatus()
        setData(result)
      } catch (err) {
        setError(err.message)
      }
    }

    loadData()
  }, [])

  if (error) {
    return <p>{error}</p>
  }

  if (!data) {
    return <p>Loading backend data...</p>
  }

  return <p>{data.message}</p>
}

export default TestBackend