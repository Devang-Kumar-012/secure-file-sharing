import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import './auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email is required.'); return }
    if (!password)     { setError('Password is required.'); return }
    setLoading(true)
    try {
      await signIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Shield size={22} /> SecureShare
        </Link>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue.</p>

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

          <div>
            <Input
              id="password"
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={Lock}
              autoComplete="current-password"
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
            <div className="auth-forgot" style={{ marginTop: '0.5rem' }}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="auth-submit"
            style={{ width: '100%' }}
          >
            Sign In
          </Button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
