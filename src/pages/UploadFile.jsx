import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, X, FileCheck, ArrowRight, CloudUpload } from 'lucide-react'
import { useFiles } from '../context/FilesContext'
import { fmtBytes, getTypeLabel } from '../lib/fileUtils'
import FileIcon from '../components/FileIcon.jsx'
import Button from '../components/ui/Button.jsx'
import './upload.css'

const MAX_SIZE = 500 * 1024 * 1024 // 500 MB

function UploadFile() {
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(null)
  const inputRef = useRef(null)
  const progressRef = useRef(null)
  const { uploadFile } = useFiles()
  const navigate = useNavigate()

  // Animate progress bar during upload
  useEffect(() => {
    if (uploading) {
      setProgress(5)
      let current = 5
      progressRef.current = setInterval(() => {
        // Advance quickly to 85%, then slow down to wait for actual completion
        const increment = current < 60 ? 8 : current < 80 ? 2 : 0.5
        current = Math.min(85, current + increment)
        setProgress(Math.round(current))
      }, 400)
    } else {
      clearInterval(progressRef.current)
    }
    return () => clearInterval(progressRef.current)
  }, [uploading])

  function validateFile(f) {
    if (!f) return 'No file selected.'
    if (f.size === 0) return 'File is empty.'
    if (f.size > MAX_SIZE) return `File is too large. Maximum size is ${fmtBytes(MAX_SIZE)}.`
    return null
  }

  function pickFile(f) {
    const err = validateFile(f)
    if (err) { setError(err); return }
    setError('')
    setFile(f)
  }

  function onDrop(e) {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) pickFile(f)
  }

  const onInputChange = useCallback(e => {
    const f = e.target.files?.[0]
    if (f) pickFile(f)
    // Reset input so the same file can be re-selected after removal
    e.target.value = ''
  }, [])

  async function handleUpload() {
    if (!file || uploading) return
    setError('')
    setUploading(true)
    try {
      const result = await uploadFile(file)
      setProgress(100)
      // Brief pause so user sees 100% before the success screen
      await new Promise(r => setTimeout(r, 400))
      setUploaded(result)
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Success state
  if (uploaded) {
    return (
      <div className="upload-page">
        <div className="upload-success">
          <FileCheck size={48} color="var(--success)" />
          <h2 className="upload-success__title">Upload complete</h2>
          <p className="upload-success__name">{uploaded.name}</p>
          <p className="upload-success__size">{fmtBytes(uploaded.size)}</p>
          <div className="upload-success__actions">
            <Button variant="primary" size="lg" onClick={() => navigate('/files')}>
              View My Files <ArrowRight size={18} />
            </Button>
            <Button variant="secondary" size="md" onClick={() => {
              setFile(null); setUploaded(null); setProgress(0)
            }}>
              Upload another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h2 className="upload-title">Upload File</h2>
        <p className="upload-sub">Files are stored privately — only you can access them.</p>
      </div>

      {error && (
        <div className="upload-error">
          <span>{error}</span>
          <button onClick={() => setError('')} aria-label="Dismiss" style={{ marginLeft: 'auto', opacity: .7, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {!file ? (
        <div
          className={`upload-dropzone ${drag ? 'upload-dropzone--active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={e => { e.preventDefault(); setDrag(false) }}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          aria-label="Click or drag to upload file"
        >
          <CloudUpload size={48} color={drag ? 'var(--accent)' : 'var(--text-muted)'} />
          <p className="upload-dropzone__primary">
            {drag ? 'Release to upload' : 'Drag a file here or click to browse'}
          </p>
          <p className="upload-dropzone__secondary">Any file type · Max {fmtBytes(MAX_SIZE)}</p>
          <input
            ref={inputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={onInputChange}
            aria-hidden
          />
        </div>
      ) : (
        <div className="upload-preview">
          <div className="upload-preview__file">
            <FileIcon mimeType={file.type} name={file.name} size={36} />
            <div className="upload-preview__info">
              <p className="upload-preview__name">{file.name}</p>
              <p className="upload-preview__meta">
                {fmtBytes(file.size)} · {getTypeLabel(file.type, file.name)}
              </p>
            </div>
            {!uploading && (
              <button
                className="upload-preview__remove"
                onClick={() => { setFile(null); setProgress(0); setError('') }}
                aria-label="Remove file"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {uploading && (
            <div className="upload-progress">
              <div className="upload-progress__track">
                <div className="upload-progress__fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="upload-progress__label">{progress}%</p>
            </div>
          )}

          <div className="upload-preview__actions">
            <Button
              variant="primary"
              size="lg"
              loading={uploading}
              onClick={handleUpload}
              disabled={uploading}
            >
              <Upload size={18} />
              {uploading ? 'Uploading…' : 'Upload File'}
            </Button>
            {!uploading && (
              <Button variant="ghost" size="md" onClick={() => { setFile(null); setProgress(0); setError('') }}>
                Choose different file
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadFile
