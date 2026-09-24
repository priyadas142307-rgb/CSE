import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa'
import { getCommitteeMemberDetails } from '../services/api'

function CommitteeMemberDetails() {
  const { id } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMember() {
      try {
        const data = await getCommitteeMemberDetails(id)
        setMember(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMember()
  }, [id])

  if (loading) {
    return (
      <section className="member-detail-page">
        <div className="container">
          <div className="profile-loading-box">Loading committee member details...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="member-detail-page">
        <div className="container">
          <div className="profile-loading-box">{error}</div>
        </div>
      </section>
    )
  }

  if (!member) {
    return (
      <section className="member-detail-page">
        <div className="container">
          <div className="profile-loading-box">Committee member not found.</div>
        </div>
      </section>
    )
  }

  return (
    <section className="member-detail-page">
      <div className="container">
        <div className="member-detail-card">
          <div className="member-detail-left">
            <span className="profile-tag">Committee Member</span>
            <h1 className="profile-main-name">{member.name}</h1>
            <p className="profile-main-role">{member.title || 'Committee Member'}</p>

            <div className="profile-details-panel">
              <h3>About Member</h3>
              <p>{member.details || member.description || 'No details added yet.'}</p>
            </div>

            <div className="member-detail-info-grid">
              <div className="profile-detail-box">
                <strong>Full Name</strong>
                <span>{member.name}</span>
              </div>

              <div className="profile-detail-box">
                <strong>Position</strong>
                <span>{member.title || 'Committee Member'}</span>
              </div>
            </div>

            {(member.facebook_url || member.linkedin_url) && (
              <div className="member-detail-socials">
                {member.facebook_url && (
                  <a
                    href={member.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="card-social-btn"
                    aria-label="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                )}

                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="card-social-btn linkedin"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn />
                  </a>
                )}
              </div>
            )}

            <div className="profile-action-row">
              <Link to="/committee" className="profile-btn-secondary">
                Back to Committee
              </Link>
            </div>
          </div>

          <div className="member-detail-right">
            <div className="profile-image-outer">
              {member.image ? (
                <img src={member.image} alt={member.name} className="profile-modern-image" />
              ) : (
                <div className="profile-modern-placeholder">
                  {member.name?.charAt(0) || 'C'}
                </div>
              )}
            </div>

            <div className="profile-right-badge">
              <span>Society Team</span>
              <h4>{member.name}</h4>
              <p>{member.title || 'Committee Member'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommitteeMemberDetails