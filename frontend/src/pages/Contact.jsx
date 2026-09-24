import { useState } from 'react'
import PageBanner from '../components/PageBanner'
import { sendContactMessage } from '../services/api'

function Contact() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('')
    setError('')
    setLoading(true)

    try {
      const result = await sendContactMessage(formData)
      setStatus(result.message)

      setFormData({
        full_name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <section className="section-block contact-premium-hero-section">
        <div className="container">
          <div className="contact-premium-hero-shell">
            <div className="contact-premium-hero-header">
              <span className="contact-premium-mini-title">GET IN TOUCH</span>
              <h2>
                Let’s Create Something <span>Meaningful</span> Together
              </h2>
              <p>
                We are always happy to hear from students, alumni, collaborators, and partners.
                Reach out for membership support, event partnerships, academic activities,
                media collaboration, or any society-related questions.
              </p>
            </div>

            <div className="contact-premium-stat-row">
              <div className="contact-premium-stat-box">
                <strong>Fast</strong>
                <span>Response</span>
              </div>
              <div className="contact-premium-stat-box">
                <strong>Open</strong>
                <span>Collaboration</span>
              </div>
              <div className="contact-premium-stat-box">
                <strong>Active</strong>
                <span>Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block contact-premium-main-section">
        <div className="container contact-premium-layout">
          <div className="contact-premium-info-card">
            <span className="contact-premium-chip">Contact Details</span>
            <h3>Reach The Society Team</h3>
            <p>
              Whether you want to ask a question, join an activity, collaborate on an event,
              or connect with the society leadership, we are ready to listen and respond.
            </p>

            <div className="contact-premium-info-list">
              <div className="contact-premium-info-item">
                <div className="contact-premium-info-icon">✉</div>
                <div>
                  <strong>Email</strong>
                  <span>
  <a href="mailto:csesociety@metrouni.edu.bd">
    csesociety@metrouni.edu.bd
  </a>
</span>
                </div>
              </div>

              <div className="contact-premium-info-item">
                <div className="contact-premium-info-icon">☎</div>
                <div>
                  <strong>Phone</strong>
                  <span>+880 1234-567890</span>
                </div>
              </div>

              <div className="contact-premium-info-item">
                <div className="contact-premium-info-icon">⌂</div>
                <div>
                  <strong>Location</strong>
                  <span>Department of CSE, Metropolitan University</span>
                </div>
              </div>

              <div className="contact-premium-info-item">
                <div className="contact-premium-info-icon">⏰</div>
                <div>
                  <strong>Office Hours</strong>
                  <span>Sunday - Thursday, 10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-premium-form-card" onSubmit={handleSubmit}>
            <div className="contact-premium-form-header">
              <span className="contact-premium-chip">Send Message</span>
              <h3>We’d Love To Hear From You</h3>
              <p>Fill out the form below and send your message directly to the society team.</p>
            </div>

            <div className="contact-premium-form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter your subject"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows="6"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here"
              ></textarea>
            </div>

            {status && <p className="contact-premium-success">{status}</p>}
            {error && <p className="contact-premium-error">{error}</p>}

            <button
              type="submit"
              className="primary-btn reference-primary-btn full-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Contact