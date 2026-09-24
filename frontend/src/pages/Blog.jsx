import { useEffect, useState } from 'react'
import PageBanner from '../components/PageBanner'
import Card from '../components/Card'
import { getBlogs } from '../services/api'

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await getBlogs()
        setBlogs(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  return (
    <>
      <section className="section-block blog-modern-hero-section">
        <div className="container">
          <div className="blog-modern-hero-shell">
            <div className="blog-modern-hero-header">
              <span className="blog-modern-mini-title">INSIGHTS & ARTICLES</span>
              <h2>
                Explore Our Latest <span>Ideas</span> And Stories
              </h2>
              <p>
                Discover useful writeups, student experiences, development tips, technology
                insights, and community stories shared through the MU CSE Society blog platform.
              </p>
            </div>

            <div className="blog-modern-stat-row">
              <div className="blog-modern-stat-box">
                <strong>{loading ? '...' : blogs.length}</strong>
                <span>Total Articles</span>
              </div>
              <div className="blog-modern-stat-box">
                <strong>Fresh</strong>
                <span>Student Insights</span>
              </div>
              <div className="blog-modern-stat-box">
                <strong>Modern</strong>
                <span>Tech Knowledge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block blog-modern-grid-section">
        <div className="container">
          <div className="blog-modern-grid-header">
            <span className="blog-modern-chip">READ OUR BLOGS</span>
            <h3>Articles That Inform And Inspire</h3>
            <p>
              Browse through blog posts written to guide, motivate, and support students in their academic and professional journey.
            </p>
          </div>

          {loading && <p>Loading blogs...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && blogs.length === 0 && <p>No blogs found.</p>}

          {!loading && !error && blogs.length > 0 && (
            <div className="card-grid">
              {blogs.map((item) => (
                <Card
                  key={item.id}
                  image={item.image}
                  title={item.title}
                  subtitle={item.date}
                  description={item.description}
                  link={`/blog/${item.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Blog