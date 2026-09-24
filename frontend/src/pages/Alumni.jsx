import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { getAlumni } from '../services/api'

function Alumni() {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAlumni() {
      try {
        const data = await getAlumni()
        setAlumni(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAlumni()
  }, [])

  return (
    <>
      <section className="section-block alumni-modern-hero-section">
        <div className="container">
          <div className="alumni-modern-hero-shell">
            <div className="alumni-modern-hero-header">
              <span className="alumni-modern-mini-title">ALUMNI COMMUNITY</span>
              <h2>
                Connected By <span>Experience</span>, Inspired By Growth
              </h2>
              <p>
                Our alumni network reflects the strength of MU CSE Society. Former members continue
                to inspire current students through professional achievements, mentorship, research,
                and real-world industry experience.
              </p>
            </div>

            <div className="alumni-modern-stat-row">
              <div className="alumni-modern-stat-box">
                <strong>{loading ? '...' : alumni.length}</strong>
                <span>Featured Alumni</span>
              </div>
              <div className="alumni-modern-stat-box">
                <strong>Global</strong>
                <span>Career Pathways</span>
              </div>
              <div className="alumni-modern-stat-box">
                <strong>Strong</strong>
                <span>Professional Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block alumni-modern-grid-section">
        <div className="container">
          <div className="alumni-modern-grid-header">
            <span className="alumni-modern-chip">MEET OUR ALUMNI</span>
            <h3>Professional Journeys That Inspire</h3>
            <p>
              Explore the contributions and career stories of former members who continue to make an impact.
            </p>
          </div>

          {loading && <p>Loading alumni...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && alumni.length === 0 && <p>No alumni found.</p>}

          {!loading && !error && alumni.length > 0 && (
            <div className="card-grid">
              {alumni.map((item) => (
                <Card
                  key={item.id}
                  image={item.image}
                  title={item.name}
                  subtitle={item.title}
                  description={item.description}
                  facebook_url={item.facebook_url}
                  linkedin_url={item.linkedin_url}
                  link={`/alumni/${item.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Alumni