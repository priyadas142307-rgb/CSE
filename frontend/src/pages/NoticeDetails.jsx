import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { getNoticeDetails } from '../services/api'

function NoticeDetails() {
  const { id } = useParams()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadNotice() {
      try {
        const data = await getNoticeDetails(id)
        setNotice(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadNotice()
  }, [id])

  if (loading) {
    return (
      <section className="section-block">
        <div className="container">
          <p>Loading notice details...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-block">
        <div className="container">
          <p>{error}</p>
        </div>
      </section>
    )
  }

  if (!notice) {
    return (
      <section className="section-block">
        <div className="container">
          <p>Notice not found.</p>
        </div>
      </section>
    )
  }

  return (
    <>

      <section className="section-block detail-modern-section">
        <div className="container">
          <div className="detail-modern-shell">
            <div className="detail-modern-image-box">
              {notice.image ? (
                <img src={notice.image} alt={notice.title} className="detail-modern-image" />
              ) : (
                <div className="detail-modern-image detail-modern-no-image">No Image</div>
              )}
            </div>

            <div className="detail-modern-content-card">
              <span className="detail-modern-chip">{notice.date}</span>
              <h2>{notice.title}</h2>
              <div className="detail-modern-text">
                <p>{notice.details || notice.description}</p>
              </div>

              <div className="detail-modern-actions">
                <Link to="/notices" className="primary-btn reference-primary-btn">
                  Back to Notices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default NoticeDetails