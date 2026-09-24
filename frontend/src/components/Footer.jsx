import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow footer-glow-one"></div>
      <div className="footer-glow footer-glow-two"></div>

      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo-wrap footer-logo">
            <div className="logo-circle">CS</div>
            <div>
              <h3>CSE Society</h3>
              <p>University Club Portal</p>
            </div>
          </div>

          <p>
            CSE Society is a student-focused platform for events, notices, leadership,
            alumni connection, and knowledge sharing. We work to build a stronger,
            smarter, and more collaborative student community.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/notices">Notices</Link></li>
            <li><Link to="/committee">Committee</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact Info</h4>
          <ul className="footer-links">
            <li>Email: csesociety@university.edu</li>
            <li>Phone: +880 1234-567890</li>
            <li>Location: CSE Department, Main Campus</li>
            <li>Office Hours: 10:00 AM - 4:00 PM</li>
          </ul>
        </div>

        <div>
          <h4>Follow Us</h4>
          <ul className="footer-links">
            <li>
              <a href="https://www.facebook.com/mucses" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/company/csesociety" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://youtube.com/csesociety" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/mucses/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 CSE Society. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer