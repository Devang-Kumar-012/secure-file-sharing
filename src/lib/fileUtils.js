export function fmtBytes(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export function fmtDate(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  const now = new Date()
  const diff = now - d
  const secs = Math.floor(diff / 1000)
  const mins = Math.floor(secs / 60)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (secs < 60) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

export function getFileExt(name) {
  return name?.split('.').pop()?.toLowerCase() || ''
}

export function getMimeCategory(mimeType, name) {
  const ext = getFileExt(name)
  if (!mimeType && !ext) return 'other'

  if (mimeType?.startsWith('image/') || ['jpg','jpeg','png','gif','webp','svg','bmp','ico','tiff','avif'].includes(ext)) return 'image'
  if (mimeType === 'application/pdf' || ext === 'pdf') return 'pdf'
  if (mimeType?.startsWith('text/') || ['txt','md','csv','json','xml','html','htm','yaml','yml','toml','log','sh','py','js','jsx','ts','tsx','css','sql'].includes(ext)) return 'text'
  if (mimeType?.startsWith('audio/') || ['mp3','wav','ogg','flac','aac','m4a'].includes(ext)) return 'audio'
  if (mimeType?.startsWith('video/') || ['mp4','webm','mov','avi','mkv','m4v'].includes(ext)) return 'video'
  if (['zip','tar','gz','rar','7z','bz2'].includes(ext)) return 'archive'
  if (['doc','docx'].includes(ext)) return 'word'
  if (['xls','xlsx'].includes(ext)) return 'excel'
  if (['ppt','pptx'].includes(ext)) return 'powerpoint'
  return 'other'
}

export function getTypeLabel(mimeType, name) {
  const cat = getMimeCategory(mimeType, name)
  const ext = getFileExt(name).toUpperCase()
  const labels = {
    image: 'Image',
    pdf: 'PDF Document',
    text: ext ? `${ext} File` : 'Text File',
    audio: 'Audio File',
    video: 'Video File',
    archive: 'Archive',
    word: 'Word Document',
    excel: 'Spreadsheet',
    powerpoint: 'Presentation',
    other: ext ? `${ext} File` : 'File',
  }
  return labels[cat] || 'File'
}

// Colors per category
export const FILE_COLORS = {
  image:       '#8b5cf6',
  pdf:         '#ef4444',
  text:        '#3b82f6',
  audio:       '#f59e0b',
  video:       '#10b981',
  archive:     '#6b7280',
  word:        '#2563eb',
  excel:       '#16a34a',
  powerpoint:  '#ea580c',
  other:       '#6b7280',
}
