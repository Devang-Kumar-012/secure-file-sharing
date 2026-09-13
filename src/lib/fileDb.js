/**
 * File storage using:
 *   - localStorage  → file metadata (id, userId, name, size, mimeType, createdAt, updatedAt)
 *   - IndexedDB     → file blobs (actual binary data)
 *
 * IndexedDB is used for blobs because localStorage has a ~5 MB size limit.
 */

// ── localStorage metadata ─────────────────────────────────────────────────────

const META_KEY = 'ss_file_meta'

function readAllMeta() {
  try { return JSON.parse(localStorage.getItem(META_KEY)) || [] } catch { return [] }
}
function writeAllMeta(list) {
  localStorage.setItem(META_KEY, JSON.stringify(list))
}

function generateFileId() {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ── IndexedDB blobs ───────────────────────────────────────────────────────────

const DB_NAME    = 'SecureShareFiles'
const DB_VERSION = 1
const STORE_NAME = 'blobs'

let _db = null

function openDb() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    req.onsuccess = e => { _db = e.target.result; resolve(_db) }
    req.onerror   = e => reject(e.target.error)
  })
}

function idbPut(id, blob) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req   = store.put({ id, blob })
    req.onsuccess = () => resolve()
    req.onerror   = e => reject(e.target.error)
  }))
}

function idbGet(id) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req   = store.get(id)
    req.onsuccess = e => resolve(e.target.result?.blob || null)
    req.onerror   = e => reject(e.target.error)
  }))
}

function idbDelete(id) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req   = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror   = e => reject(e.target.error)
  }))
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns metadata array for a given userId, sorted newest first. */
export function getFilesForUser(userId) {
  return readAllMeta()
    .filter(f => f.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * Save a file (File object from browser).
 * Writes metadata to localStorage and blob to IndexedDB.
 * Returns the metadata record.
 */
export async function saveFile(userId, file) {
  const id  = generateFileId()
  const now = new Date().toISOString()
  const meta = {
    id,
    userId,
    name:      file.name,
    size:      file.size,
    mime_type: file.type || '',
    createdAt: now,
    updatedAt: now,
  }
  await idbPut(id, file)
  const all = readAllMeta()
  writeAllMeta([...all, meta])
  return meta
}

/** Rename a file in metadata only. Returns updated meta or throws. */
export function renameFile(userId, fileId, newName) {
  const all  = readAllMeta()
  const idx  = all.findIndex(f => f.id === fileId && f.userId === userId)
  if (idx === -1) throw new Error('File not found.')
  all[idx] = { ...all[idx], name: newName, updatedAt: new Date().toISOString() }
  writeAllMeta(all)
  return all[idx]
}

/** Delete metadata + blob. */
export async function deleteFile(userId, fileId) {
  const all = readAllMeta()
  const file = all.find(f => f.id === fileId && f.userId === userId)
  if (!file) throw new Error('File not found.')
  writeAllMeta(all.filter(f => f.id !== fileId))
  await idbDelete(fileId)
}

/**
 * Retrieve the Blob for a file.
 * Returns a temporary object URL string — caller must revoke it when done.
 */
export async function getFileObjectUrl(userId, fileId) {
  // Ownership check via metadata
  const all  = readAllMeta()
  const meta = all.find(f => f.id === fileId && f.userId === userId)
  if (!meta) throw new Error('File not found or access denied.')
  const blob = await idbGet(fileId)
  if (!blob) throw new Error('File data not found in storage.')
  return URL.createObjectURL(blob)
}

/** Return the raw Blob (for download with correct filename). */
export async function getFileBlob(userId, fileId) {
  const all  = readAllMeta()
  const meta = all.find(f => f.id === fileId && f.userId === userId)
  if (!meta) throw new Error('File not found or access denied.')
  const blob = await idbGet(fileId)
  if (!blob) throw new Error('File data not found in storage.')
  return { blob, meta }
}
