import { Bell, Menu, Search, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

const pageTitles = {
    '/dashboard': ['Dashboard', 'Overview'],
    '/files': ['My Files', 'Your protected file library'],
    '/upload': ['Upload File', 'Add a new protected file'],
    '/shared': ['Shared Files', 'Files shared with others'],
    '/access': ['Secure Access', 'Verify a shared file token'],
    '/settings': ['Settings', 'Manage your workspace preferences'],
}

function Topbar({ onMenuOpen, searchQuery, onSearchChange }) {
    const { pathname } = useLocation()
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [title, subtitle] = pageTitles[pathname] || ['Workspace', 'SecureShare']

    return (
        <header className="app-topbar">
            <div className="app-topbar__heading">
                <button className="icon-button topbar-menu" type="button" aria-label="Open navigation" onClick={onMenuOpen}><Menu size={20} /></button>
                <div><span className="app-topbar__eyebrow">{subtitle}</span><h1>{title}</h1></div>
            </div>
            <div className="app-topbar__actions">
                <div className={`app-search ${searchOpen ? 'app-search--open' : ''}`}>
                    <Search size={17} aria-hidden="true" />
                    <input aria-label="Search files" placeholder="Search files" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} />
                    {searchOpen ? <button className="app-search__close" type="button" aria-label="Close search" onClick={() => { setSearchOpen(false); onSearchChange('') }}><X size={15} /></button> : null}
                </div>
                <button className="icon-button topbar-search" type="button" aria-label="Open search" onClick={() => setSearchOpen(true)}><Search size={18} /></button>
                <div className="notification-wrap">
                    <button className="icon-button" type="button" aria-label="Show notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}><Bell size={18} /><span className="notification-dot" /></button>
                    {notificationsOpen ? <div className="notification-panel"><strong>Notifications</strong><p>Your secure workflow is up to date.</p><small>1 new activity</small></div> : null}
                </div>
                <span className="avatar">AM</span>
            </div>
        </header>
    )
}

export default Topbar