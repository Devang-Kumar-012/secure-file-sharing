import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './app-layout.css'

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-layout__body">
        <Topbar
          onMenuOpen={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="app-layout__main">
          {typeof children === 'function'
            ? children({ searchQuery, onSearchChange: setSearchQuery })
            : children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
