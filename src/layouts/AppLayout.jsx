import { cloneElement, isValidElement, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './app-layout.css'

function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const content = isValidElement(children) ? cloneElement(children, { searchQuery, onSearchChange: setSearchQuery }) : children

    return (
        <div className="application-layout">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="application-layout__content">
                <Topbar onMenuOpen={() => setSidebarOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                <div className="application-layout__main">{content}</div>
            </div>
        </div>
    )
}

export default AppLayout