import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import { getHomeData } from '../services/api'

function Home() {
  const [homeData, setHomeData] = useState({
    events: [],
    notices: [],
    committee: [],
    alumni: [],
    blogs: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [contactSuccess, setContactSuccess] = useState('')
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    async function loadHomeData() {
      try {
        const data = await getHomeData()
        setHomeData({
          events: data.events || [],
          notices: data.notices || [],
          committee: data.committee || [],
          alumni: data.alumni || [],
          blogs: data.blogs || [],
        })
      } catch (err) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  function handleContactChange(e) {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleContactSubmit(e) {
    e.preventDefault()

    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.subject.trim() ||
      !contactForm.message.trim()
    ) {
      setContactError('Please fill in all fields.')
      setContactSuccess('')
      return
    }

    setContactSuccess('Your message is ready. You can connect this form to backend later.')
    setContactError('')
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  return (
    <>
      <Hero />

      <section className="section-block about-preview-section">
        <div className="container">
          <SectionHeader
            title="About MU CSE Society"
            subtitle="A creative and active student platform where learning, leadership, innovation, and collaboration grow together."
          />

          <div className="about-feature-layout">
            <div className="about-feature-card feature-main">
              <span className="mini-tag">Who We Are</span>
              <h3>A student-driven community for technology, leadership, and growth</h3>
              <p>
                MU CSE Society brings together passionate students who want to explore
                technology, organize impactful events, improve communication skills,
                build leadership qualities, and create a strong academic and professional network.
              </p>
            </div>

            <div className="about-feature-card">
              <span className="mini-tag">Our Mission</span>
              <h4>Empower learners through practical opportunities</h4>
              <p>
                We focus on workshops, competitions, seminars, teamwork, and meaningful student engagement.
              </p>
            </div>

            <div className="about-feature-card">
              <span className="mini-tag">Our Vision</span>
              <h4>Build future-ready students and leaders</h4>
              <p>
                We want to create a vibrant university environment where students can grow with confidence and skill.
              </p>
            </div>
          </div>

          <div className="view-all-wrap">
            <Link to="/about" className="primary-btn reference-primary-btn">
              Explore About Page
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <SectionHeader
            title="Featured Events"
            subtitle="Explore the latest events, competitions, workshops, and celebrations."
          />

          {loading && <p>Loading home data...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <>
              <div className="card-grid">
                {homeData.events.map((item) => (
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

              <div className="view-all-wrap">
                <Link to="/events" className="primary-btn reference-primary-btn">
                  View All Events
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section-block alt-bg">
        <div className="container">
          <SectionHeader
            title="Latest Notices"
            subtitle="Stay informed with important announcements, schedules, and updates."
          />

          {!loading && !error && (
            <>
              <div className="card-grid">
                {homeData.notices.map((item) => (
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

              <div className="view-all-wrap">
                <Link to="/notices" className="primary-btn reference-primary-btn">
                  View All Notices
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <SectionHeader
            title="Current Committee"
            subtitle="Meet the active committee members of the current academic session."
          />

          {!loading && !error && (
            <>
              <div className="card-grid">
                {homeData.committee.map((item) => (
                  <Card
                    key={item.id}
                    image={item.image}
                    title={item.name}
                    subtitle={item.title}
                    description={item.description}
                    facebook_url={item.facebook_url}
                    linkedin_url={item.linkedin_url}
                  />
                ))}
              </div>

              <div className="view-all-wrap">
                <Link to="/committee" className="primary-btn reference-primary-btn">
                  View Full Committee
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section-block alt-bg">
        <div className="container">
          <SectionHeader
            title="Alumni Network"
            subtitle="Connect with our alumni community and explore inspiring journeys."
          />

          {!loading && !error && (
            <>
              <div className="card-grid">
                {homeData.alumni.map((item) => (
                  <Card
                    key={item.id}
                    image={item.image}
                    title={item.name}
                    subtitle={item.title}
                    description={item.description}
                    facebook_url={item.facebook_url}
                    linkedin_url={item.linkedin_url}
                  />
                ))}
              </div>

              <div className="view-all-wrap">
                <Link to="/alumni" className="primary-btn reference-primary-btn">
                  View All Alumni
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <SectionHeader
            title="Latest Blog Posts"
            subtitle="Read student stories, technical insights, and society updates."
          />

          {!loading && !error && (
            <>
              <div className="card-grid">
                {homeData.blogs.map((item) => (
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

              <div className="view-all-wrap">
                <Link to="/blog" className="primary-btn reference-primary-btn">
                  View All Blogs
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section-block alt-bg">
        <div className="container">
          <SectionHeader
            title="Get In Touch"
            subtitle="Have a question, idea, or collaboration proposal? Send us a message directly from the home page."
          />

          <div className="contact-premium-layout glass-contact-shell premium-glass-stage">
            <div className="premium-glow premium-glow-one"></div>
            <div className="premium-glow premium-glow-two"></div>
            <div className="premium-floating premium-floating-one"></div>
            <div className="premium-floating premium-floating-two"></div>

            <div className="contact-premium-info-card glass-card animate-left premium-glass-left">
              <span className="contact-premium-chip">Contact Us</span>
              <h3>Let’s build something meaningful together</h3>
              <p>
                Reach out to MU CSE Society for event collaborations, student support,
                workshop ideas, academic activities, and community engagement.
              </p>

              <div className="contact-premium-info-list">
                <div className="contact-premium-info-item">
                  <div className="contact-premium-info-icon">📍</div>
                  <div>
                    <strong>Location</strong>
                    <span>Metropolitan University, Department of CSE</span>
                  </div>
                </div>

                <div className="contact-premium-info-item">
                  <div className="contact-premium-info-icon">✉</div>
                  <div>
                    <strong>Email</strong>
                    <span>
                      <a href="mailto:mucsesociety@gmail.com" className="premium-contact-link">
                        mucsesociety@gmail.com
                      </a>
                    </span>
                  </div>
                </div>

                <div className="contact-premium-info-item">
                  <div className="contact-premium-info-icon">☎</div>
                  <div>
                    <strong>Phone</strong>
                    <span>+880 1XXXXXXXXX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-premium-form-card glass-card animate-right premium-glass-right">
              <div className="contact-premium-form-header">
                <span className="contact-premium-chip">Send Message</span>
                <h3>Quick Contact Form</h3>
                <p>Frontend ready. Backend connection later add korte parba.</p>
              </div>

              {contactSuccess && <div className="contact-premium-success">{contactSuccess}</div>}
              {contactError && <div className="contact-premium-error">{contactError}</div>}

              <form onSubmit={handleContactSubmit} className="glass-input premium-glass-form">
                <div className="contact-premium-form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="Write your subject"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Write your message here"
                  ></textarea>
                </div>

                <button type="submit" className="primary-btn reference-primary-btn glass-btn premium-contact-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home