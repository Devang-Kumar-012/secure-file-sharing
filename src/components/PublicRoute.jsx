import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Redirect authenticated users away from public auth pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  // While auth is loading, render nothing to avoid flash of login page
  if (loading) return null

  if (user) return <Navigate to="/dashboard" replace />

  return children
}

export default PublicRoute
