import { Link } from 'react-router-dom'
import { Shield, Info } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import './auth.css'

function ForgotPassword() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Shield size={22} /> SecureShare
        </Link>

        <h1 className="auth-heading">Reset password</h1>
        <p className="auth-sub">Password recovery in offline mode.</p>

        <div className="auth-alert" style={{
          background: 'var(--accent-soft)',
          borderColor: 'var(--accent-border)',
          color: 'var(--accent)',
          marginBottom: '2rem',
          border: '1px solid',
          display: 'flex',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--r-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          alignItems: 'flex-start',
        }}>
          <Info size={17} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            SecureShare stores accounts locally — there is no email system.
            If you remember your password, <Link to="/login">sign in</Link> and
            change it in Settings. Otherwise, you can{' '}
            <Link to="/signup">create a new account</Link>.
          </span>
        </div>

        <Link to="/login" style={{ display: 'block' }}>
          <Button variant="primary" size="lg" style={{ width: '100%' }}>Back to Sign In</Button>
        </Link>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
