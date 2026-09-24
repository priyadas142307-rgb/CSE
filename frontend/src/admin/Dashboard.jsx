import { useEffect, useState } from 'react'
import { getCurrentUser } from '../services/api'

const API = "http://127.0.0.1:8000/api"

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch(`${API}/admin/dashboard/`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  if (!stats) return <p>Loading...</p>

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">Events: {stats.events}</div>
        <div className="card">Notices: {stats.notices}</div>
        <div className="card">Blogs: {stats.blogs}</div>
        <div className="card">Alumni: {stats.alumni}</div>
        <div className="card">Committee: {stats.committee_members}</div>
        <div className="card">Users: {stats.users}</div>
      </div>
    </div>
  )
}

export default Dashboard