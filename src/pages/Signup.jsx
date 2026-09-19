import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import './auth.css'

function Signup() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)   // email confirmation pending
  const { signUp, supabaseReady } = useAuth()
  const navigate = useNavigate()

  function validate() {
    if (!email.trim())           return 'Email is required.'
    if (!/\S+@\S+\.\S+/.test(email.trim())) return 'Enter a valid email address.'
    if (password.length < 8)     return 'Password must be at least 8 characters.'
    if (password !== confirm)    return 'Passwords do not match.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    try {
      const { session } = await signUp(email.trim().toLowerCase(), password)
      if (session) {
        // Supabase email confirmation disabled, or local auth — signed in immediately
        navigate('/dashboard', { replace: true })
      } else {
        // Supabase email confirmation required
        setDone(true)
      }
    } catch (err) {
      // Show the real error — most common ones are:
      // "User already registered" / "Email already in use"
      const msg = err.message || ''
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
        setError('An account with this email already exists. Try signing in instead.')
      } else {
        setError(msg || 'Could not create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Email confirmation pending screen
  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 className="auth-heading" style={{ fontSize: 'var(--text-2xl)' }}>Check your email</h1>
          <p className="auth-sub" style={{ marginBottom: '0.75rem' }}>
            We sent a confirmation link to
          </p>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
            {email}
          </p>
          <p className="auth-sub" style={{ marginBottom: '2rem', fontSize: 'var(--text-sm)' }}>
            Click the link in that email to activate your account, then come back here to sign in.
            Check your spam folder if you don&apos;t see it.
          </p>
          <Link to="/login" style={{ display: 'block' }}>
            <Button variant="primary" size="lg" style={{ width: '100%' }}>Go to Sign In</Button>
          </Link>
          <button
            style={{ marginTop: '1rem', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => { setDone(false); setError('') }}
          >
            Use a different email
          </button>
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
        <p className="auth-sub">Free to use. No credit card required.</p>

        {/* Local-only mode notice */}
        {!supabaseReady && (
          <div style={{
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
            background: 'var(--accent-soft)', border: '1px solid var(--accent-border)',
            fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 500,
            marginBottom: '1.5rem',
          }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Accounts are saved in this browser only. Sign up and sign in on the same device.</span>
          </div>
        )}

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

          <Input
            id="password"
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            icon={Lock}
            autoComplete="new-password"
            required
            hint="Minimum 8 characters"
            rightElement={
              <button type="button" className="password-toggle" onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
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
            onChange={e => { setConfirm(e.target.value); setError('') }}
            icon={Lock}
            autoComplete="new-password"
            required
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
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
