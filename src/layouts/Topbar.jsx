import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import './topbar.css'

const titles = {
  '/dashboard': 'Dashboard',
  '/files':     'My Files',
  '/recent':    'Recent',
  '/storage':   'Storage',
  '/settings':  'Settings',
  '/upload':    'Upload File',
}

function Topbar({ onMenuOpen, searchQuery, onSearchChange }) {
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const title = titles[pathname] || 'SecureShare'

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu" onClick={onMenuOpen} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="topbar__title">{title}</h1>
      </div>

      <div className="topbar__right">
        {/* Desktop search */}
        <div className="topbar__search topbar__search--desktop">
          <Search size={16} className="topbar__search-icon" aria-hidden />
          <input
            type="search"
            placeholder="Search files…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="topbar__search-input"
            aria-label="Search files"
          />
        </div>

        {/* Mobile search toggle */}
        <button
          className="topbar__icon-btn topbar__search-toggle"
          onClick={() => setSearchOpen(o => !o)}
          aria-label="Search"
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="topbar__search-mobile">
          <Search size={16} className="topbar__search-icon" aria-hidden />
          <input
            type="search"
            placeholder="Search files…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="topbar__search-input"
            autoFocus
            aria-label="Search files"
          />
        </div>
      )}
    </header>
  )
}

export default Topbar
