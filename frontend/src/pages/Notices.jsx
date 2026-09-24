import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import Card from '../components/Card'
import { getNotices } from '../services/api'

function Notices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function parseNoticeDate(dateString) {
    if (!dateString) return null

    const parsed = new Date(dateString)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }

    const parts = dateString.trim().split(/\s+/)
    if (parts.length >= 3) {
      const [day, month, year] = parts
      const retry = new Date(`${month} ${day}, ${year}`)
      if (!Number.isNaN(retry.getTime())) {
        return retry
      }
    }

    return null
  }

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getNotices()
        setNotices(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadNotices()
  }, [])

  const sortedNotices = useMemo(() => {
    const copied = [...notices]

    copied.sort((a, b) => {
      const dateA = parseNoticeDate(a.date)
      const dateB = parseNoticeDate(b.date)

      if (!dateA && !dateB) return b.id - a.id
      if (!dateA) return 1
      if (!dateB) return -1

      return dateB.getTime() - dateA.getTime()
    })

    return copied
  }, [notices])

  const featuredNotice = sortedNotices[0] || null
  const remainingNotices = sortedNotices.slice(1)

  return (
    <>

      <section className="section-block notice-spotlight-section">
        <div className="container">
          {loading && <p>Loading notices...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && sortedNotices.length === 0 && <p>No notices found.</p>}

          {!loading && !error && featuredNotice && (
            <div className="notice-spotlight-shell">
              <div className="notice-spotlight-header">
                <span className="notice-spotlight-mini">LATEST NOTICE</span>
                <h2>
                  Important <span>Announcement</span>
                </h2>
                <p>Stay updated with the latest official notice from MU CSE Society.</p>
              </div>

              <div className="notice-spotlight-card">
                <div className="notice-spotlight-image-wrap">
                  {featuredNotice.image ? (
                    <img
                      src={featuredNotice.image}
                      alt={featuredNotice.title}
                      className="notice-spotlight-image"
                    />
                  ) : (
                    <div className="notice-spotlight-image notice-spotlight-no-image">
                      No Image
                    </div>
                  )}

                  <div className="notice-spotlight-overlay">
                    <div className="notice-spotlight-content">
                      <span className="notice-spotlight-chip">{featuredNotice.date}</span>
                      <h3>{featuredNotice.title}</h3>
                      <p>{featuredNotice.description}</p>

                      <div className="notice-spotlight-actions">
                        <Link
                          to={`/notices/${featuredNotice.id}`}
                          className="primary-btn reference-primary-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          {!loading && !error && remainingNotices.length > 0 && (
            <div className="card-grid">
              {remainingNotices.map((item) => (
                <Card
                  key={item.id}
                  image={item.image}
                  title={item.title}
                  subtitle={item.date}
                  description={item.description}
                  link={`/notices/${item.id}`}
                />
              ))}
            </div>
          )}

          {!loading && !error && sortedNotices.length === 1 && (
            <div className="notice-only-one-state">
              <p>More notices will appear here once you add them from the database.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Notices