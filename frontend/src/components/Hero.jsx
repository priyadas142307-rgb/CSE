import { Link } from 'react-router-dom'

const heroCards = [
  {
    id: 1,
    title: 'MU CSE FEST 2024',
    image: '/images/hero-fest-openning.jpg',
    className: 'card-one',
  },
  {
    id: 2,
    title: 'Club Celebration',
    image: '/images/hero-fest-rally.jpg',
    className: 'card-two',
  },
  {
    id: 3,
    title: 'Workshop Session',
    image: '/images/hero-fest-trophy.jpg',
    className: 'card-three',
  },
  {
    id: 4,
    title: 'Achievement Night',
    image: '/images/hero-fest-2024.jpg',
    className: 'card-four',
  },
]

function Hero() {
  return (
    <section className="hero-section reference-hero-section">
      <div className="hero-bg-blur hero-bg-blur-one"></div>
      <div className="hero-bg-blur hero-bg-blur-two"></div>

      <div className="container hero-grid reference-hero-grid">
        <div className="hero-content reference-hero-content">
          <span className="hero-badge reference-hero-badge">
            Innovation • Collaboration • Leadership
          </span>

          <h1>
            Welcome to <span className="hero-highlight-gold">MU</span>
            <br />
            <span className="hero-highlight-blue">CSE Society</span>
          </h1>

          <p>
            A modern student community where passionate learners, developers, and
            innovators come together to build skills, organize impactful events, and
            create opportunities for the next generation of tech leaders.
          </p>

          <div className="hero-actions reference-hero-actions">
            <Link to="/events" className="primary-btn reference-primary-btn">
              Explore Events
            </Link>
            <Link to="/committee" className="secondary-btn reference-secondary-btn">
              Learn More
            </Link>
          </div>

          <div className="hero-stats-grid reference-hero-stats-grid">
            <div className="hero-stat-card">
              <h3>25+</h3>
              <p>Workshops, seminars, and tech sessions every year.</p>
            </div>
            <div className="hero-stat-card">
              <h3>500+</h3>
              <p>Active students connected through the society network.</p>
            </div>
            <div className="hero-stat-card">
              <h3>12+</h3>
              <p>Core committee members leading major activities.</p>
            </div>
          </div>
        </div>

        <div className="hero-visual reference-hero-visual">
          <span className="hero-dot hero-dot-blue"></span>
          <span className="hero-dot hero-dot-gold"></span>

          <div className="hero-card-gallery reference-hero-card-gallery">
            {heroCards.map((card) => (
              <div key={card.id} className={`hero-image-card ${card.className}`}>
                <img src={card.image} alt={card.title} />
                <div className="hero-image-overlay reference-hero-image-overlay">
                  <span>{card.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero