import { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Toast from '../components/ui/Toast.jsx'
import './settings.css'

function SettingsPage() {
  const { user, updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'success' })

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPwError('')
    if (password.length < 8) { setPwError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setPwError('Passwords do not match.'); return }
    setPwLoading(true)
    try {
      await updatePassword(password)
      setPassword(''); setConfirm('')
      setToast({ message: 'Password updated successfully.', type: 'success' })
    } catch (err) {
      setPwError(err.message || 'Could not update password.')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-sub">Manage your account</p>
      </div>

      {/* Account Info */}
      <div className="settings-card">
        <div className="settings-card__header">
          <User size={20} color="var(--accent)" />
          <h3 className="settings-card__title">Account</h3>
        </div>
        <div className="settings-card__body">
          <div className="settings-field">
            <label className="settings-label">Email</label>
            <p className="settings-value">{user?.email}</p>
          </div>
          <div className="settings-field">
            <label className="settings-label">Account ID</label>
            <p className="settings-value settings-value--mono">{user?.id?.slice(0, 16)}…</p>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="settings-card">
        <div className="settings-card__header">
          <Lock size={20} color="var(--accent)" />
          <h3 className="settings-card__title">Change Password</h3>
        </div>
        <div className="settings-card__body">
          {pwError && (
            <div className="settings-error">{pwError}</div>
          )}
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <Input
              id="new-password"
              label="New Password"
              type={showPw ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={Lock}
              autoComplete="new-password"
              rightElement={
                <button type="button" className="password-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
            <Input
              id="confirm-password"
              label="Confirm Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Repeat new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              icon={Lock}
              autoComplete="new-password"
            />
            <div>
              <Button type="submit" variant="primary" size="md" loading={pwLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </div>
  )
}

export default SettingsPage
