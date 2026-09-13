import { Navigate } from 'react-router-dom'

// No email-based password reset in local-only mode.
// Redirect anyone landing here to the settings page where they can change their password.
function ResetPassword() {
  return <Navigate to="/settings" replace />
}

export default ResetPassword
