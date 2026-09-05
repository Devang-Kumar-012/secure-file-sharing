import { ArrowUpRight, ChevronDown, FileUp, Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FileDetails from '../components/FileDetails.jsx'
import FileItem from '../components/FileItem.jsx'
import { useFileData } from '../data/useFileData.js'
import './my-files.css'

const filters = ['All', 'Protected', 'Shared', 'Private']

function MyFiles({ searchQuery = '', onSearchChange }) {
    const navigate = useNavigate()
    const { files } = useFileData()
    const [activeFilter, setActiveFilter] = useState('All')
    const [sortBy, setSortBy] = useState('modified')
    const [selectedFile, setSelectedFile] = useState(null)
    const [toast, setToast] = useState('')

    const visibleFiles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        const filtered = files.filter((file) => {
            const matchesFilter = activeFilter === 'All' || (activeFilter === 'Protected' && file.protectionStatus === 'Protected') || (activeFilter === 'Shared' && file.shared) || (activeFilter === 'Private' && !file.shared)
            const matchesSearch = !query || file.name.toLowerCase().includes(query) || file.type.toLowerCase().includes(query)
            return matchesFilter && matchesSearch
        })

        return [...filtered].sort((first, second) => {
            if (sortBy === 'nameAsc') return first.name.localeCompare(second.name)
            if (sortBy === 'nameDesc') return second.name.localeCompare(first.name)
            return files.indexOf(first) - files.indexOf(second)
        })
    }, [activeFilter, files, searchQuery, sortBy])

    const showToast = (message) => {
        setToast(message)
        window.setTimeout(() => setToast(''), 2600)
    }

    return (
        <main className="my-files-page">
            <section className="my-files-intro"><div><span className="my-files-kicker">The collection <i /> {files.length} stored objects</span><h2>My Files</h2><p>Manage, review and control access to your protected files.</p></div><Link className="my-files-upload" to="/upload"><FileUp size={16} /> Upload file <ArrowUpRight size={15} /></Link></section>
            <section className="my-files-toolbar" aria-label="File collection controls"><div className="my-files-filters"><SlidersHorizontal size={15} aria-hidden="true" />{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'my-files-filter my-files-filter--active' : 'my-files-filter'} type="button" onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="my-files-controls"><label className="my-files-search"><Search size={16} /><input aria-label="Search my files" placeholder="Search files or types" value={searchQuery} onChange={(event) => onSearchChange?.(event.target.value)} /><button type="button" aria-label="Clear file search" onClick={() => onSearchChange?.('')}><X size={14} /></button></label><label className="my-files-sort"><span>Sort</span><select aria-label="Sort files" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="modified">Recently modified</option><option value="added">Recently added</option><option value="nameAsc">Name A–Z</option><option value="nameDesc">Name Z–A</option></select><ChevronDown size={14} /></label></div></section>
            <section className="my-files-list" aria-label="My protected files"><div className="my-files-list__heading"><span>File object</span><span>Last activity</span><span>Status</span><span /></div>{visibleFiles.length ? visibleFiles.map((file) => <FileItem key={file.id} file={file} onOpen={setSelectedFile} />) : <div className="my-files-empty"><Search size={20} /><h3>No files found</h3><p>Try a different search or filter.</p></div>}</section>
            <footer className="my-files-footnote"><span><span className="footnote-dot" /> Demo workspace</span><span>Security states are visualized locally for this prototype.</span></footer>
            {selectedFile ? <FileDetails file={selectedFile} onClose={() => setSelectedFile(null)} onDownload={() => showToast('Demo download initiated.')} onShare={() => navigate('/shared')} /> : null}
            {toast ? <div className="file-toast" role="status">{toast}</div> : null}
        </main>
    )
}

export default MyFiles