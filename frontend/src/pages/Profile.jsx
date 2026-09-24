import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../services/api'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentUser()
        if (data.authenticated) {
          setUser(data.user)
        } else {
          setError('Please login first.')
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <section className="profile-page-section">
        <div className="container">
          <div className="profile-loading-box">
            <p>Loading profile...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || !user) {
    return (
      <section className="profile-page-section">
        <div className="container">
          <div className="profile-loading-box">
            <p>{error || 'Profile not found.'}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="profile-page-section">
      <div className="container">
        <div className="profile-modern-wrapper">
          <div className="profile-modern-card">

            <div className="profile-modern-left">
              <div className="profile-tag">Member Profile</div>

              <h1 className="profile-main-name">{user.full_name || 'User Name'}</h1>
              <p className="profile-main-role">{user.designation || 'Member'}</p>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span>Username</span>
                  <strong>{user.username || 'N/A'}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Email</span>
                  <strong>{user.email || 'N/A'}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Student ID</span>
                  <strong>{user.student_id || 'N/A'}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Batch</span>
                  <strong>{user.batch || 'N/A'}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Year Label</span>
                  <strong>{user.year_label || 'N/A'}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Role</span>
                  <strong>{user.is_staff ? 'Admin / Staff' : 'Member'}</strong>
                </div>
              </div>

              <div className="profile-details-panel">
                <h3>About Member</h3>
                <p>{user.details || 'No details added yet.'}</p>
              </div>

              <div className="profile-social-links">
                {user.facebook_url && (
                  <a href={user.facebook_url} target="_blank" rel="noreferrer" className="profile-social-btn">
                    Facebook
                  </a>
                )}

                {user.linkedin_url && (
                  <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="profile-social-btn linkedin-btn">
                    LinkedIn
                  </a>
                )}
              </div>

              <div className="profile-action-buttons">
                <Link to="/profile/edit" className="profile-btn-primary">
                  Edit Profile
                </Link>
                <Link to="/profile/change-password" className="profile-btn-secondary">
                  Change Password
                </Link>
              </div>
            </div>

            <div className="profile-modern-right">
              <div className="profile-image-outer">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.full_name}
                    className="profile-modern-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const placeholder = document.getElementById('profile-modern-placeholder')
                      if (placeholder) placeholder.style.display = 'flex'
                    }}
                  />
                ) : null}

                <div
                  id="profile-modern-placeholder"
                  className="profile-modern-placeholder"
                  style={{ display: user.image ? 'none' : 'flex' }}
                >
                  {user.full_name?.charAt(0) || 'U'}
                </div>
              </div>

              <div className="profile-right-badge">
                <span>Welcome Back</span>
                <h4>{user.full_name}</h4>
                <p>{user.designation || 'Member of the Society'}</p>
              </div>
            </div>

            <div className="profile-bg-shape profile-shape-one"></div>
            <div className="profile-bg-shape profile-shape-two"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile