import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { logoutMember, getCurrentUser } from '../services/api'
import cseLogo from '../assets/cse-logo.png'

function Navbar() {
  const [user, setUser] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function syncUser() {
      try {
        const data = await getCurrentUser()

        if (data.authenticated && data.user) {
          setUser(data.user)
          localStorage.setItem('cseSocietyUser', JSON.stringify(data.user))
        } else {
          const saved = localStorage.getItem('cseSocietyUser')
          setUser(saved ? JSON.parse(saved) : null)
        }
      } catch {
        const saved = localStorage.getItem('cseSocietyUser')
        setUser(saved ? JSON.parse(saved) : null)
      }
    }

    syncUser()

    function handleAuthChange() {
      const saved = localStorage.getItem('cseSocietyUser')
      setUser(saved ? JSON.parse(saved) : null)
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false)
      }
    }

    function handleScroll() {
      setScrolled(window.scrollY > 18)
    }

    window.addEventListener('cse-auth-updated', handleAuthChange)
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('cse-auth-updated', handleAuthChange)
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileMenu)
    return () => document.body.classList.remove('nav-open')
  }, [mobileMenu])

  async function handleLogout() {
    try {
      await logoutMember()
    } catch {
      // ignore
    }

    localStorage.removeItem('cseSocietyUser')
    window.dispatchEvent(new Event('cse-auth-updated'))
    setOpenMenu(false)
    setMobileMenu(false)
    window.location.href = 'http://127.0.0.1:5173/'
  }

  function closeMobileMenu() {
    setMobileMenu(false)
    setOpenMenu(false)
  }

  return (
    <>
      <div
        className={`mobile-nav-backdrop ${mobileMenu ? 'show' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      <header className={`navbar-wrapper reference-navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar reference-navbar">
          <Link to="/" className="logo-wrap reference-logo-wrap" onClick={closeMobileMenu}>
            <img src={cseLogo} alt="MU CSE Society" className="navbar-logo-image" />
          </Link>

          <nav className={`nav-links reference-nav-links ${mobileMenu ? 'mobile-open' : ''}`}>
            <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu}>About</NavLink>
            <NavLink to="/events" onClick={closeMobileMenu}>Events</NavLink>
            <NavLink to="/notices" onClick={closeMobileMenu}>Notices</NavLink>
            <NavLink to="/committee" onClick={closeMobileMenu}>Committee</NavLink>
            <NavLink to="/alumni" onClick={closeMobileMenu}>Alumni</NavLink>
            <NavLink to="/blog" onClick={closeMobileMenu}>Blog</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>

            {!user ? (
              <NavLink to="/login" className="login-btn-warning reference-login-btn" onClick={closeMobileMenu}>
                Login
              </NavLink>
            ) : (
              <div className="auth-dropdown-wrap" ref={dropdownRef}>
                <button
                  type="button"
                  className="auth-dropdown-trigger"
                  onClick={() => setOpenMenu((prev) => !prev)}
                >
                  <span className="auth-user-name-small">{user.full_name}</span>
                  <span>▾</span>
                </button>

                {openMenu && (
                  <div className="auth-dropdown-menu">
                    <Link to="/profile">Profile</Link>

                    {(user.is_staff || user.is_superuser) ? (
                      <>
                        <Link to="/admin">Admin Panel</Link>
                        <Link to="/admin/events/add">Add Event</Link>
                        <Link to="/admin/notices/add">Add Notice</Link>
                        <Link to="/admin/blogs/add">Add Blog</Link>
                        <Link to="/admin/alumni/add">Add Alumni</Link>
                        <Link to="/admin/committee/add">Add Committee Member</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/submit/event">Submit Event</Link>
                        <Link to="/submit/notice">Submit Notice</Link>
                        <Link to="/submit/blog">Submit Blog</Link>
                        <Link to="/submit/alumni">Submit Alumni</Link>
                      </>
                    )}

                    <button type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          <button
            type="button"
            className={`navbar-menu-toggle ${mobileMenu ? 'active' : ''}`}
            onClick={() => setMobileMenu((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenu}
          >
            <span></span>
          </button>
        </div>
      </header>
    </>
  )
}

export default Navbar