import { Link } from 'react-router-dom'
import { Upload, Files, HardDrive, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFiles } from '../context/FilesContext'
import { fmtBytes, fmtDate, getTypeLabel } from '../lib/fileUtils'
import FileIcon from '../components/FileIcon.jsx'
import Button from '../components/ui/Button.jsx'
import './dashboard.css'

const STORAGE_LIMIT = 1 * 1024 * 1024 * 1024

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: color + '18', color }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const { files, loading, storageUsed } = useFiles()

  const firstName = user?.email?.split('@')[0] || 'there'
  const usePct = Math.min(100, (storageUsed / STORAGE_LIMIT) * 100)
  const recent = files.slice(0, 8)

  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="dashboard__welcome">
        <div>
          <h2 className="dashboard__greeting">
            Hello, <span className="dashboard__name">{firstName}</span>
          </h2>
          <p className="dashboard__sub">
            {files.length === 0
              ? 'Upload your first file to get started.'
              : `You have ${files.length} file${files.length !== 1 ? 's' : ''} stored securely.`}
          </p>
        </div>
        <Link to="/upload">
          <Button variant="primary" size="lg">
            <Upload size={18} /> Upload File
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard__stats">
        <StatCard icon={Files}     label="Total Files"    value={loading ? '…' : files.length}         color="#2563eb" />
        <StatCard icon={HardDrive} label="Storage Used"   value={loading ? '…' : fmtBytes(storageUsed)} color="#8b5cf6" />
        <StatCard icon={Clock}     label="Recently Added" value={loading ? '…' : recent.length}         color="#f59e0b" />
      </div>

      {/* Storage bar */}
      <div className="storage-bar-card">
        <div className="storage-bar-card__header">
          <span className="storage-bar-card__label">Storage</span>
          <span className="storage-bar-card__usage">{fmtBytes(storageUsed)} of 1 GB used</span>
        </div>
        <div className="storage-bar-card__track">
          <div className="storage-bar-card__fill" style={{ width: `${usePct}%` }} />
        </div>
        <p className="storage-bar-card__free">{fmtBytes(STORAGE_LIMIT - storageUsed)} free</p>
      </div>

      {/* Recent files */}
      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h3 className="dashboard__section-title">Recent Files</h3>
          {files.length > 0 && (
            <Link to="/files" className="dashboard__see-all">
              See all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="dashboard__loading">
            {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="dashboard__empty">
            <Files size={40} color="var(--text-muted)" aria-hidden />
            <p>No files yet.</p>
            <Link to="/upload">
              <Button variant="secondary" size="md">Upload your first file</Button>
            </Link>
          </div>
        ) : (
          <div className="file-list">
            <div className="file-list__header">
              <span>Name</span>
              <span>Size</span>
              <span>Type</span>
              <span>Uploaded</span>
            </div>
            {recent.map(file => (
              <div key={file.id} className="file-list__row">
                <div className="file-list__name">
                  <FileIcon mimeType={file.mime_type} name={file.name} size={20} />
                  <span className="file-list__filename">{file.name}</span>
                </div>
                <span className="file-list__meta">{fmtBytes(file.size)}</span>
                <span className="file-list__meta">{getTypeLabel(file.mime_type, file.name)}</span>
                <span className="file-list__meta">{fmtDate(file.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
