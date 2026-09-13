import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Upload, Eye, Download } from 'lucide-react'
import { useFiles } from '../context/FilesContext'
import { fmtBytes, fmtDate, getTypeLabel } from '../lib/fileUtils'
import FileIcon from '../components/FileIcon.jsx'
import FilePreview from '../components/FilePreview.jsx'
import Button from '../components/ui/Button.jsx'
import Toast from '../components/ui/Toast.jsx'
import './recent.css'

function Recent({ searchQuery = '' }) {
  const { files, loading, downloadFile } = useFiles()
  const [previewFile, setPreviewFile] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  // Last 30 days
  const recent = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    let list = files.filter(f => new Date(f.created_at).getTime() > cutoff)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(f => f.name.toLowerCase().includes(q))
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [files, searchQuery])

  async function handleDownload(file) {
    try {
      await downloadFile(file)
    } catch (err) {
      setToast({ message: 'Download failed: ' + err.message, type: 'error' })
    }
  }

  return (
    <div className="recent-page">
      <div className="recent-header">
        <h2 className="recent-title">Recent</h2>
        <p className="recent-sub">Files uploaded in the last 30 days</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton-row" style={{ height: 56 }} />)}
        </div>
      ) : recent.length === 0 ? (
        <div className="recent-empty">
          <Clock size={48} color="var(--text-muted)" />
          <p>{searchQuery ? `No recent files match "${searchQuery}"` : 'No files uploaded in the last 30 days.'}</p>
          <Link to="/upload">
            <Button variant="secondary" size="md"><Upload size={16} /> Upload a file</Button>
          </Link>
        </div>
      ) : (
        <div className="recent-list">
          {recent.map(file => (
            <div key={file.id} className="recent-item">
              <FileIcon mimeType={file.mime_type} name={file.name} size={22} />
              <div className="recent-item__info">
                <button className="recent-item__name" onClick={() => setPreviewFile(file)}>
                  {file.name}
                </button>
                <p className="recent-item__meta">
                  {fmtBytes(file.size)} · {getTypeLabel(file.mime_type, file.name)} · {fmtDate(file.created_at)}
                </p>
              </div>
              <div className="recent-item__actions">
                <button className="mf-table__action-btn" onClick={() => setPreviewFile(file)} title="Preview"><Eye size={16} /></button>
                <button className="mf-table__action-btn" onClick={() => handleDownload(file)} title="Download"><Download size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewFile && <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
    </div>
  )
}

export default Recent
