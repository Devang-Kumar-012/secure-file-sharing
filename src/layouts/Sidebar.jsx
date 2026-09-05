import { FileUp, Files, LayoutDashboard, LogOut, Settings, Share2, ShieldCheck, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const navigation = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Files', path: '/files', icon: Files },
    { label: 'Upload File', path: '/upload', icon: FileUp },
    { label: 'Shared Files', path: '/shared', icon: Share2 },
    { label: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar({ open, onClose }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        onClose()
        navigate('/')
    }

    return (
        <>
            {open ? <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={onClose} /> : null}
            <aside className={`app-sidebar ${open ? 'app-sidebar--open' : ''}`}>
                <div className="app-sidebar__top">
                    <NavLink className="sidebar-brand" to="/dashboard" onClick={onClose}>
                        <span className="sidebar-brand__mark"><ShieldCheck size={18} /></span>
                        <span>SecureShare</span>
                    </NavLink>
                    <button className="icon-button sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <nav className="sidebar-nav" aria-label="Application navigation">
                    {navigation.map(({ label, path, icon: Icon }) => (
                        <NavLink key={path} aria-label={label} className={({ isActive }) => `sidebar-nav__item ${isActive ? 'sidebar-nav__item--active' : ''}`.trim()} to={path} end={path === '/dashboard'} onClick={onClose}>
                            <Icon size={17} aria-hidden="true" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-profile">
                    <div className="sidebar-profile__identity">
                        <span className="avatar avatar--small">AM</span>
                        <span><strong>Alex Morgan</strong><small>Personal Account</small></span>
                    </div>
                    <button className="icon-button" type="button" aria-label="Log out" onClick={handleLogout}><LogOut size={17} /></button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar