import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Files,
  Clock,
  HardDrive,
  Settings,
  LogOut,
  Shield,
  Upload,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFiles } from '../context/FilesContext'
import './sidebar.css'

const navItems = [
  { label: 'Dashboard',  path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Files',   path: '/files',     icon: Files },
  { label: 'Recent',     path: '/recent',    icon: Clock },
  { label: 'Storage',    path: '/storage',   icon: HardDrive },
  { label: 'Settings',   path: '/settings',  icon: Settings },
]

const STORAGE_LIMIT = 1 * 1024 * 1024 * 1024 // 1 GB

function fmtBytes(b) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function Sidebar({ mobileOpen, onClose }) {
  const { user, signOut } = useAuth()
  const { storageUsed } = useFiles()
  const navigate = useNavigate()
  const usePct = Math.min(100, (storageUsed / STORAGE_LIMIT) * 100)

  async function handleLogout() {
    try {
      await signOut()
    } catch (err) {
      console.warn('Sign out error:', err.message)
      // Still navigate away even if signOut fails
    } finally {
      navigate('/')
    }
  }

  const email = user?.email || ''
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <Shield size={22} aria-hidden />
          <span>SecureShare</span>
        </div>

        {/* Upload CTA */}
        <NavLink to="/upload" className="sidebar__upload-btn" onClick={onClose}>
          <Upload size={17} aria-hidden />
          Upload File
        </NavLink>

        {/* Nav */}
        <nav className="sidebar__nav" aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Storage meter */}
        <div className="sidebar__storage">
          <div className="sidebar__storage-label">
            <span>Storage</span>
            <span>{fmtBytes(storageUsed)} / 1 GB</span>
          </div>
          <div className="sidebar__storage-bar">
            <div className="sidebar__storage-fill" style={{ width: `${usePct}%` }} />
          </div>
        </div>

        {/* Profile + Logout */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">{initials}</div>
            <span className="sidebar__email">{email}</span>
          </div>
          <button className="sidebar__logout" onClick={handleLogout} title="Sign out">
            <LogOut size={18} aria-hidden />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
