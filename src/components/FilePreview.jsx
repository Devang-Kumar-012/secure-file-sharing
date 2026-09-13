import { useEffect, useState } from 'react'
import { X, Download, Loader2, AlertCircle } from 'lucide-react'
import { getMimeCategory } from '../lib/fileUtils'
import { useFiles } from '../context/FilesContext'
import Button from './ui/Button.jsx'
import './file-preview.css'

function FilePreview({ file, onClose }) {
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const { getPreviewUrl, downloadFile } = useFiles()

  useEffect(() => {
    let objectUrl = null
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setUrl(null)
      try {
        objectUrl = await getPreviewUrl(file)
        if (!cancelled) setUrl(objectUrl)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load preview.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()

    return () => {
      cancelled = true
      // Revoke object URL on unmount / file change to free memory
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    }
  }, [file.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const cat = getMimeCategory(file.mime_type, file.name)

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)
    try {
      await downloadFile(file)
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <div className="preview__center">
          <Loader2 size={36} color="var(--text-muted)" style={{ animation: 'spin .6s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>Loading preview…</p>
        </div>
      )
    }
    if (error) {
      return (
        <div className="preview__center">
          <AlertCircle size={36} color="var(--danger)" />
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', marginTop: '0.5rem' }}>{error}</p>
          <Button variant="secondary" size="md" onClick={handleDownload} loading={downloading}>
            <Download size={16} /> Download instead
          </Button>
        </div>
      )
    }
    if (!url) return null

    if (cat === 'image') {
      return (
        <div className="preview__center" style={{ flex: 1, padding: 'var(--sp-4)' }}>
          <img src={url} alt={file.name} className="preview__image" />
        </div>
      )
    }
    if (cat === 'pdf') {
      return <iframe src={url} className="preview__iframe" title={file.name} />
    }
    if (cat === 'text') {
      return <TextPreview url={url} />
    }
    if (cat === 'audio') {
      return (
        <div className="preview__center">
          <audio controls src={url} style={{ width: '100%', maxWidth: 480 }} />
        </div>
      )
    }
    if (cat === 'video') {
      return (
        <div className="preview__center">
          <video controls src={url} className="preview__video" style={{ maxHeight: '70vh', maxWidth: '100%' }} />
        </div>
      )
    }
    return (
      <div className="preview__center">
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>Preview not available for this file type.</p>
        <Button variant="secondary" size="md" onClick={handleDownload} loading={downloading}>
          <Download size={16} /> Download to view
        </Button>
      </div>
    )
  }

  return (
    <div
      className="preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${file.name}`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="preview" onClick={e => e.stopPropagation()}>
        <div className="preview__header">
          <span className="preview__name" title={file.name}>{file.name}</span>
          <div className="preview__actions">
            <Button variant="secondary" size="sm" onClick={handleDownload} loading={downloading} aria-label="Download file">
              <Download size={15} /> Download
            </Button>
            <button className="preview__close" onClick={onClose} aria-label="Close preview">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="preview__body">{renderContent()}</div>
      </div>
    </div>
  )
}

function TextPreview({ url }) {
  const [text, setText] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.text() })
      .then(setText)
      .catch(() => setErr(true))
  }, [url])

  if (err) return <div className="preview__center"><p style={{ color: 'var(--text-muted)' }}>Could not load text content.</p></div>
  if (text === null) return <div className="preview__center"><Loader2 size={28} color="var(--text-muted)" style={{ animation: 'spin .6s linear infinite' }} /></div>
  return <pre className="preview__text">{text}</pre>
}

export default FilePreview
