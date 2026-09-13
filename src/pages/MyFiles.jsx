import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, Search, MoreVertical, Download, Pencil, Trash2,
  Eye, Files, AlertCircle, ChevronUp, ChevronDown,
} from 'lucide-react'
import { useFiles } from '../context/FilesContext'
import { fmtBytes, fmtDate, getTypeLabel } from '../lib/fileUtils'
import FileIcon from '../components/FileIcon.jsx'
import FilePreview from '../components/FilePreview.jsx'
import Toast from '../components/ui/Toast.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import './my-files.css'

function SortIcon({ active, dir }) {
  if (!active) return null
  return dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
}

function MyFiles({ searchQuery = '', onSearchChange }) {
  const { files, loading, error, renameFile, deleteFile, downloadFile } = useFiles()
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [menuFile, setMenuFile] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [renameModal, setRenameModal] = useState(null)
  const [renameName, setRenameName] = useState('')
  const [renameLoading, setRenameLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const visible = useMemo(() => {
    let list = [...files]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(f => f.name.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol]
      if (sortCol === 'size') { av = Number(av); bv = Number(bv) }
      else if (sortCol === 'created_at') { av = new Date(av); bv = new Date(bv) }
      else { av = String(av).toLowerCase(); bv = String(bv).toLowerCase() }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [files, searchQuery, sortCol, sortDir])

  async function handleDownload(file) {
    setMenuFile(null)
    try {
      await downloadFile(file)
    } catch (err) {
      showToast('Download failed: ' + err.message, 'error')
    }
  }

  function openRename(file) {
    setMenuFile(null)
    setRenameName(file.name)
    setRenameModal({ file })
  }

  async function handleRename(e) {
    e.preventDefault()
    const trimmed = renameName.trim()
    if (!trimmed) { showToast('Name cannot be empty.', 'error'); return }
    if (trimmed === renameModal.file.name) { setRenameModal(null); return }
    setRenameLoading(true)
    try {
      await renameFile(renameModal.file.id, trimmed)
      setRenameModal(null)
      showToast('File renamed successfully.')
    } catch (err) {
      showToast('Rename failed: ' + err.message, 'error')
    } finally {
      setRenameLoading(false)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      await deleteFile(deleteModal.file.id)
      setDeleteModal(null)
      showToast('File deleted.')
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (error) {
    return (
      <div className="mf-error">
        <AlertCircle size={32} color="var(--danger)" />
        <p>Failed to load files: {error}</p>
        <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="my-files">
      {/* Header */}
      <div className="my-files__header">
        <div>
          <h2 className="my-files__title">My Files</h2>
          <p className="my-files__count">
            {loading ? 'Loading…' : `${files.length} file${files.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/upload">
          <Button variant="primary" size="md">
            <Upload size={16} /> Upload
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="my-files__toolbar">
        <div className="my-files__search">
          <Search size={16} className="my-files__search-icon" aria-hidden />
          <input
            type="search"
            placeholder="Search files…"
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            className="my-files__search-input"
            aria-label="Search files"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="mf-loading">
          {[1,2,3,4].map(i => <div key={i} className="skeleton-row" style={{ height: 56 }} />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="mf-empty">
          <Files size={48} color="var(--text-muted)" />
          {searchQuery
            ? <p>No files match &ldquo;{searchQuery}&rdquo;</p>
            : <p>No files yet.</p>}
          {!searchQuery && (
            <Link to="/upload">
              <Button variant="secondary" size="md">Upload your first file</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="mf-table">
          <div className="mf-table__head">
            <button className="mf-table__th mf-table__th--sortable" onClick={() => handleSort('name')}>
              Name <SortIcon active={sortCol === 'name'} dir={sortDir} />
            </button>
            <button className="mf-table__th mf-table__th--sortable" onClick={() => handleSort('size')}>
              Size <SortIcon active={sortCol === 'size'} dir={sortDir} />
            </button>
            <span className="mf-table__th mf-table__th--hide-sm">Type</span>
            <button className="mf-table__th mf-table__th--sortable mf-table__th--hide-sm" onClick={() => handleSort('created_at')}>
              Uploaded <SortIcon active={sortCol === 'created_at'} dir={sortDir} />
            </button>
            <span className="mf-table__th" style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {visible.map(file => (
            <div key={file.id} className="mf-table__row">
              <div className="mf-table__name">
                <FileIcon mimeType={file.mime_type} name={file.name} size={22} />
                <button
                  className="mf-table__filename"
                  onClick={() => setPreviewFile(file)}
                  title={`Preview ${file.name}`}
                >
                  {file.name}
                </button>
              </div>
              <span className="mf-table__cell">{fmtBytes(file.size)}</span>
              <span className="mf-table__cell mf-table__cell--hide-sm">{getTypeLabel(file.mime_type, file.name)}</span>
              <span className="mf-table__cell mf-table__cell--hide-sm">{fmtDate(file.created_at)}</span>
              <div className="mf-table__actions">
                <button
                  className="mf-table__action-btn"
                  onClick={() => setPreviewFile(file)}
                  title="Preview"
                  aria-label={`Preview ${file.name}`}
                >
                  <Eye size={16} />
                </button>
                <button
                  className="mf-table__action-btn"
                  onClick={() => handleDownload(file)}
                  title="Download"
                  aria-label={`Download ${file.name}`}
                >
                  <Download size={16} />
                </button>
                <div className="mf-table__menu-wrap">
                  <button
                    className="mf-table__action-btn"
                    onClick={e => { e.stopPropagation(); setMenuFile(menuFile?.id === file.id ? null : file) }}
                    title="More actions"
                    aria-label="More actions"
                    aria-expanded={menuFile?.id === file.id}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuFile?.id === file.id && (
                    <div className="mf-table__menu" role="menu">
                      <button role="menuitem" onClick={() => openRename(file)}>
                        <Pencil size={14} /> Rename
                      </button>
                      <button
                        role="menuitem"
                        className="danger"
                        onClick={() => { setMenuFile(null); setDeleteModal({ file }) }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Preview */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Rename Modal */}
      <Modal open={!!renameModal} onClose={() => { setRenameModal(null); setRenameLoading(false) }} title="Rename File">
        <form onSubmit={handleRename} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <Input
            id="rename-input"
            label="File name"
            value={renameName}
            onChange={e => setRenameName(e.target.value)}
            autoFocus
            required
            placeholder="Enter new filename"
          />
          <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setRenameModal(null)}
              disabled={renameLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={renameLoading}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => { if (!deleteLoading) setDeleteModal(null) }}
        title="Delete File"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-5)', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{deleteModal?.file?.name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setDeleteModal(null)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button variant="danger" size="md" loading={deleteLoading} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Close context menu on outside click */}
      {menuFile && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 5 }}
          onClick={() => setMenuFile(null)}
          aria-hidden
        />
      )}
    </div>
  )
}

export default MyFiles
