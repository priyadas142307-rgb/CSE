import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('cseSocietyUser'))

  if (!user || !user.is_staff) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute