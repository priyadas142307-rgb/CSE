import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
  let user = null
  try {
    const raw = localStorage.getItem('cseSocietyUser')
    if (raw) {
      user = JSON.parse(raw)
    }
  } catch {
    user = null
  }

  if (!user || (!user.is_staff && !user.is_superuser)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute