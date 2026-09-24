import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { getEventDetails } from '../services/api'

function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventDetails(id)
        setEvent(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  if (loading) {
    return (
      <section className="section-block">
        <div className="container">
          <p>Loading event details...</p>
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

  if (!event) {
    return (
      <section className="section-block">
        <div className="container">
          <p>Event not found.</p>
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
              {event.image ? (
                <img src={event.image} alt={event.title} className="detail-modern-image" />
              ) : (
                <div className="detail-modern-image detail-modern-no-image">No Image</div>
              )}
            </div>

            <div className="detail-modern-content-card">
              <span className="detail-modern-chip">{event.date}</span>
              <h2>{event.title}</h2>
              <p className="detail-modern-meta">Location: {event.location}</p>
              <div className="detail-modern-text">
                <p>{event.details}</p>
              </div>

              <div className="detail-modern-actions">
                <Link to="/events" className="primary-btn reference-primary-btn">
                  Back to Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EventDetails