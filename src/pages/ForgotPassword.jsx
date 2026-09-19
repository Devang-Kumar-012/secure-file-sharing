import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Shield, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import './auth.css'

function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)
  const { resetPassword, supabaseReady } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!/\S+@\S+\.\S+/.test(email.trim())) { setError('Enter a valid email address.'); return }
    setLoading(true)
    try {
      await resetPassword(email.trim().toLowerCase())
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send reset email.')
    } finally {
      setLoading(false)
    }
  }

  // Success
  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 className="auth-heading" style={{ fontSize: 'var(--text-2xl)' }}>Email sent</h1>
          <p className="auth-sub" style={{ marginBottom: '0.75rem' }}>
            We sent a password reset link to
          </p>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
            {email}
          </p>
          <p className="auth-sub" style={{ marginBottom: '2rem', fontSize: 'var(--text-sm)' }}>
            Click the link in that email to set a new password. Check your spam folder if you don&apos;t see it.
          </p>
          <Link to="/login" style={{ display: 'block' }}>
            <Button variant="primary" size="lg" style={{ width: '100%' }}>Back to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  // No Supabase — can't send email
  if (!supabaseReady) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <Link to="/" className="auth-brand"><Shield size={22} /> SecureShare</Link>
          <h1 className="auth-heading">Reset password</h1>
          <div style={{
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
            background: 'var(--accent-soft)', border: '1px solid var(--accent-border)',
            fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 500,
            marginBottom: '2rem',
          }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Accounts are stored locally in this browser — there is no email system.
              If you remember your password, <Link to="/login">sign in</Link> and
              change it in Settings. Otherwise, <Link to="/signup">create a new account</Link>.
            </span>
          </div>
          <Link to="/login" style={{ display: 'block' }}>
            <Button variant="primary" size="lg" style={{ width: '100%' }}>Back to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand"><Shield size={22} /> SecureShare</Link>

        <h1 className="auth-heading">Reset password</h1>
        <p className="auth-sub">Enter your email and we&apos;ll send a reset link.</p>

        {error && (
          <div className="auth-alert auth-alert--error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            icon={Mail}
            autoComplete="email"
            required
          />
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
            Send Reset Link
          </Button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
