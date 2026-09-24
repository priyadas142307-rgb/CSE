import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminDashboard } from '../services/api'
import {
  FaCalendarAlt,
  FaBullhorn,
  FaNewspaper,
  FaGraduationCap,
  FaUsers,
  FaUserFriends,
} from 'react-icons/fa'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getAdminDashboard()
      .then((data) => {
        if (isMounted) {
          setStats(data)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard statistics.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <section className="admin-page-section">
        <div className="admin-page-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome to the MU CSE Society Admin Panel</p>
          </div>
        </div>
        <p>Loading dashboard metrics...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-page-section">
        <div className="admin-page-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome to the MU CSE Society Admin Panel</p>
          </div>
        </div>
        <div className="admin-error-box">{error}</div>
      </section>
    )
  }

  const statCards = [
    { label: 'Total Events', count: stats?.events ?? 0, icon: <FaCalendarAlt />, link: '/admin/events', color: '#2f63e8' },
    { label: 'Notices Published', count: stats?.notices ?? 0, icon: <FaBullhorn />, link: '/admin/notices', color: '#f6a400' },
    { label: 'Blog Posts', count: stats?.blogs ?? 0, icon: <FaNewspaper />, link: '/admin/blogs', color: '#10b981' },
    { label: 'Alumni Network', count: stats?.alumni ?? 0, icon: <FaGraduationCap />, link: '/admin/alumni', color: '#8b5cf6' },
    { label: 'Committee Members', count: stats?.committee_members ?? 0, icon: <FaUsers />, link: '/admin/committee', color: '#ec4899' },
    { label: 'Registered Users', count: stats?.users ?? 0, icon: <FaUserFriends />, link: '/admin/users', color: '#06b6d4' },
  ]

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome to the MU CSE Society administration and management system.</p>
        </div>
        <Link to="/admin/submissions" className="admin-primary-btn">
          View Submissions
        </Link>
      </div>

      <div className="admin-stat-grid">
        {statCards.map((card, idx) => (
          <Link to={card.link} key={idx} className="admin-stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
            <div className="admin-stat-icon" style={{ color: card.color, background: `${card.color}15` }}>
              {card.icon}
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{card.label}</span>
              <strong className="admin-stat-value">{card.count}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Dashboard