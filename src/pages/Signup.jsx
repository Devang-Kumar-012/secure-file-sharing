import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import './auth.css'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email is required.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const { session } = await signUp(email.trim(), password)
      if (session) {
        navigate('/dashboard', { replace: true })
      } else {
        setDone(true)
      }
    } catch (err) {
      setError(err.message || 'Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 className="auth-heading" style={{ fontSize: 'var(--text-2xl)' }}>Check your email</h1>
          <p className="auth-sub" style={{ marginBottom: '2rem' }}>
            We sent a confirmation link to <strong>{email}</strong>.<br />
            Click the link to activate your account.
          </p>
          <Link to="/login">
            <Button variant="secondary" size="md" style={{ width: '100%' }}>Back to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Shield size={22} /> SecureShare
        </Link>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-sub">Start storing files securely in minutes.</p>

        {error && (
          <div className="auth-alert auth-alert--error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={Mail}
            autoComplete="email"
            required
          />

          <Input
            id="password"
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={Lock}
            autoComplete="new-password"
            required
            rightElement={
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />

          <Input
            id="confirm"
            label="Confirm Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            icon={Lock}
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="auth-submit"
            style={{ width: '100%' }}
          >
            Create Account
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
