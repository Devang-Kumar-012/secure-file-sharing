import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Shield, AlertCircle, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase, supabaseReady } from '../lib/supabase'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import './auth.css'

function ResetPassword() {
  const [ready, setReady]     = useState(!supabaseReady) // local mode: always ready
  const [invalid, setInvalid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabaseReady) return // local mode handled above

    // Supabase sends recovery token in the URL hash.
    // onAuthStateChange fires PASSWORD_RECOVERY when it's processed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setReady(true)
      }
    })

    // Also check if there's already an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    const timeout = setTimeout(() => {
      setInvalid(r => { if (!r) return true; return r })
    }, 8000)

    return () => { subscription.unsubscribe(); clearTimeout(timeout) }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      if (supabaseReady) {
        const { error: err } = await supabase.auth.updateUser({ password })
        if (err) throw err
      }
      setDone(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 2500)
    } catch (err) {
      setError(err.message || 'Could not update password.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 className="auth-heading" style={{ fontSize: 'var(--text-2xl)' }}>Password updated</h1>
          <p className="auth-sub">Redirecting you to your dashboard…</p>
        </div>
      </div>
    )
  }

  if (supabaseReady && invalid && !ready) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 className="auth-heading" style={{ fontSize: 'var(--text-2xl)' }}>Link expired</h1>
          <p className="auth-sub" style={{ marginBottom: '2rem' }}>
            This password reset link is invalid or has expired. Request a new one.
          </p>
          <Link to="/forgot-password" style={{ display: 'block' }}>
            <Button variant="primary" size="md" style={{ width: '100%' }}>Request new link</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (supabaseReady && !ready) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <Loader2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', animation: 'spin .6s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p className="auth-sub">Verifying reset link…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand"><Shield size={22} /> SecureShare</Link>
        <h1 className="auth-heading">New password</h1>
        <p className="auth-sub">Choose a new password for your account.</p>

        {error && (
          <div className="auth-alert auth-alert--error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            id="password"
            label="New Password"
            type={showPw ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            icon={Lock}
            autoComplete="new-password"
            rightElement={
              <button type="button" className="password-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle">
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />
          <Input
            id="confirm"
            label="Confirm Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Repeat new password"
            value={confirm}
            onChange={e => { setConfirm(e.target.value); setError('') }}
            icon={Lock}
            autoComplete="new-password"
          />
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
