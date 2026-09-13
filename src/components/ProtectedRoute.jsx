import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Spinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100svh',
      background: 'var(--app-bg)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--text-primary)',
        animation: 'spin .6s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
