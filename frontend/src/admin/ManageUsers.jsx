import { useEffect, useState } from 'react'
import { getAdminUsers } from '../services/api'

function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getAdminUsers()
      .then((data) => {
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : [])
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load user list.')
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

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Registered Users</h1>
          <p>View all registered student and admin accounts in MU CSE Society.</p>
        </div>
      </div>

      {loading && <p>Loading users...</p>}

      {error && <div className="admin-error-box">{error}</div>}

      {!loading && !error && users.length === 0 && (
        <div className="admin-panel-card">
          <p>No registered users found.</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="admin-table-wrap">
          {users.map((u) => {
            const initial = (u.full_name || u.username || 'U').charAt(0).toUpperCase()
            return (
              <div className="admin-table-row admin-user-row" key={u.id}>
                {u.image ? (
                  <img src={u.image} alt={u.full_name} className="admin-user-avatar" />
                ) : (
                  <div className="admin-user-avatar">{initial}</div>
                )}
                <div className="admin-table-content">
                  <h3>{u.full_name || u.username}</h3>
                  <p>
                    <strong>@{u.username}</strong> • {u.email || 'No email'}
                    {u.student_id ? ` • ID: ${u.student_id}` : ''}
                    {u.batch ? ` • Batch ${u.batch}` : ''}
                  </p>
                </div>
                <div className="admin-table-actions">
                  <span className={`admin-badge ${u.is_staff || u.is_superuser ? 'badge-admin' : 'badge-member'}`}>
                    {u.is_superuser ? 'Super Admin' : u.is_staff ? 'Staff' : 'Member'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default ManageUsers