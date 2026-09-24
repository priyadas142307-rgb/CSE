import { Link, NavLink, Outlet } from 'react-router-dom'
import './admin.css'

function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link to="/admin" className="admin-brand">
            <span className="admin-brand-mark">CS</span>
            <div>
              <h2>CSE Admin</h2>
              <p>Management Panel</p>
            </div>
          </Link>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/events">
            Manage Events
          </NavLink>

          <NavLink to="/admin/notices">
            Manage Notices
          </NavLink>

          <NavLink to="/admin/blogs">
            Manage Blogs
          </NavLink>

          <NavLink to="/admin/alumni">
            Manage Alumni
          </NavLink>

          <NavLink to="/admin/committee">
            Manage Committee
          </NavLink>

          <NavLink to="/admin/submissions">
            Pending Submissions
          </NavLink>

          <NavLink to="/admin/users">
            Manage Users
          </NavLink>
        </nav>

        <button
          className="admin-logout-btn"
          onClick={() => {
            localStorage.removeItem('cseSocietyUser')
            window.dispatchEvent(new Event('cse-auth-updated'))
            window.location.href = '/'
          }}
        >
          Logout
        </button>
      </aside>

      <main className="admin-main-area">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout