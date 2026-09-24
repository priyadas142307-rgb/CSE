import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { getBlogDetails } from '../services/api'

function BlogDetails() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBlog() {
      try {
        const data = await getBlogDetails(id)
        setBlog(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [id])

  if (loading) {
    return (
      <section className="section-block">
        <div className="container">
          <p>Loading blog details...</p>
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

  if (!blog) {
    return (
      <section className="section-block">
        <div className="container">
          <p>Blog not found.</p>
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
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="detail-modern-image" />
              ) : (
                <div className="detail-modern-image detail-modern-no-image">No Image</div>
              )}
            </div>

            <div className="detail-modern-content-card">
              <span className="detail-modern-chip">{blog.date}</span>
              <h2>{blog.title}</h2>
              <div className="detail-modern-text">
                <p>{blog.details}</p>
              </div>

              <div className="detail-modern-actions">
                <Link to="/blog" className="primary-btn reference-primary-btn">
                  Back to Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default BlogDetails