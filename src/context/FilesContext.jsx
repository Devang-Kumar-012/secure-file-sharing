import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  getFilesForUser,
  saveFile,
  renameFile as dbRenameFile,
  deleteFile as dbDeleteFile,
  getFileObjectUrl,
  getFileBlob,
} from '../lib/fileDb'
import { useAuth } from './AuthContext'

const FilesContext = createContext(null)

export function FilesProvider({ children }) {
  const { user } = useAuth()
  const [files, setFiles]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [storageUsed, setStorageUsed] = useState(0)

  const fetchFiles = useCallback(() => {
    if (!user) {
      setFiles([])
      setStorageUsed(0)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const list = getFilesForUser(user.id)
      setFiles(list)
      setStorageUsed(list.reduce((sum, f) => sum + (f.size || 0), 0))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  async function uploadFile(file, onProgress) {
    if (!user) throw new Error('Not authenticated.')
    onProgress?.({ loaded: 0, total: file.size })
    const meta = await saveFile(user.id, file)
    onProgress?.({ loaded: file.size, total: file.size })
    setFiles(prev => [meta, ...prev])
    setStorageUsed(prev => prev + file.size)
    return meta
  }

  function renameFile(fileId, newName) {
    if (!user) throw new Error('Not authenticated.')
    const updated = dbRenameFile(user.id, fileId, newName)
    setFiles(prev => prev.map(f => f.id === fileId ? updated : f))
    return updated
  }

  async function deleteFile(fileId) {
    if (!user) throw new Error('Not authenticated.')
    const file = files.find(f => f.id === fileId)
    await dbDeleteFile(user.id, fileId)
    setFiles(prev => prev.filter(f => f.id !== fileId))
    if (file) setStorageUsed(prev => Math.max(0, prev - (file.size || 0)))
  }

  async function getPreviewUrl(file) {
    if (!user) throw new Error('Not authenticated.')
    return getFileObjectUrl(user.id, file.id)
  }

  async function getDownloadUrl(file) {
    if (!user) throw new Error('Not authenticated.')
    return getFileObjectUrl(user.id, file.id)
  }

  async function downloadFile(file) {
    if (!user) throw new Error('Not authenticated.')
    const { blob, meta } = await getFileBlob(user.id, file.id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = meta.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  return (
    <FilesContext.Provider value={{
      files,
      loading,
      error,
      storageUsed,
      fetchFiles,
      uploadFile,
      renameFile,
      deleteFile,
      getPreviewUrl,
      getDownloadUrl,
      downloadFile,
    }}>
      {children}
    </FilesContext.Provider>
  )
}

export function useFiles() {
  const ctx = useContext(FilesContext)
  if (!ctx) throw new Error('useFiles must be used inside FilesProvider')
  return ctx
}
