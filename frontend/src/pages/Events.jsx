import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import Card from '../components/Card'
import { getEvents } from '../services/api'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  function parseEventDate(dateString) {
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
    async function loadEvents() {
      try {
        const data = await getEvents()
        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const sortedEvents = useMemo(() => {
    const copied = [...events]

    copied.sort((a, b) => {
      const dateA = parseEventDate(a.date)
      const dateB = parseEventDate(b.date)

      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1

      return dateA.getTime() - dateB.getTime()
    })

    return copied
  }, [events])

  const featuredEvent = useMemo(() => {
    const now = new Date()

    const upcoming = sortedEvents.find((event) => {
      const eventDate = parseEventDate(event.date)
      return eventDate && eventDate.getTime() >= now.getTime()
    })

    return upcoming || sortedEvents[0] || null
  }, [sortedEvents])

  useEffect(() => {
    if (!featuredEvent) return

    const targetDate = parseEventDate(featuredEvent.date)
    if (!targetDate) return

    function updateCountdown() {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance <= 0) {
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((distance / (1000 * 60)) % 60)
      const seconds = Math.floor((distance / 1000) % 60)

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [featuredEvent])

  return (
    <>
      <section className="section-block event-highlight-section">
        <div className="container">
          {loading && <p>Loading events...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && sortedEvents.length === 0 && <p>No events found.</p>}

          {!loading && !error && featuredEvent && (
            <div className="event-showcase-wrapper">
              <div className="event-showcase-header">
                <span className="event-mini-title">✦ UPCOMING EVENTS ✦</span>
                <h2>
                  Join Our Exciting <span>Events</span>!
                </h2>
                <p className="event-remaining-text">Time Remaining</p>
              </div>

              <div className="event-countdown-grid">
                <div className="event-time-box">
                  <strong>{countdown.days}</strong>
                  <span>Days</span>
                </div>
                <div className="event-time-box">
                  <strong>{countdown.hours}</strong>
                  <span>Hours</span>
                </div>
                <div className="event-time-box">
                  <strong>{countdown.minutes}</strong>
                  <span>Min</span>
                </div>
                <div className="event-time-box">
                  <strong>{countdown.seconds}</strong>
                  <span>Sec</span>
                </div>
              </div>

              <div className="event-feature-card">
                <div className="event-feature-image-wrap">
                  {featuredEvent.image ? (
                    <img
                      src={featuredEvent.image}
                      alt={featuredEvent.title}
                      className="event-feature-image"
                    />
                  ) : (
                    <div className="event-feature-image card-image-placeholder">No Image</div>
                  )}

                  <div className="event-feature-overlay">
                    <div className="event-feature-content">
                      <h3>{featuredEvent.title}</h3>
                      <span>{featuredEvent.date}</span>
                      <p>{featuredEvent.description}</p>

                      <div className="event-feature-actions">
                        <Link
                          to={`/events/${featuredEvent.id}`}
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
          {!loading && !error && sortedEvents.length > 0 && (
            <div className="card-grid">
              {sortedEvents.map((item) => (
                <Card
                  key={item.id}
                  image={item.image}
                  title={item.title}
                  subtitle={item.date}
                  description={item.description}
                  extra={item.location}
                  link={`/events/${item.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Events