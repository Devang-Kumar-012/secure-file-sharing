import { HardDrive } from 'lucide-react'
import { useFiles } from '../context/FilesContext'
import { fmtBytes, getTypeLabel, getMimeCategory, FILE_COLORS } from '../lib/fileUtils'
import './storage.css'

const STORAGE_LIMIT = 1 * 1024 * 1024 * 1024

function Storage() {
  const { files, loading, storageUsed } = useFiles()
  const usePct = Math.min(100, (storageUsed / STORAGE_LIMIT) * 100)
  const free = STORAGE_LIMIT - storageUsed

  // Group by category
  const byCategory = files.reduce((acc, f) => {
    const cat = getMimeCategory(f.mime_type, f.name)
    if (!acc[cat]) acc[cat] = { count: 0, size: 0 }
    acc[cat].count += 1
    acc[cat].size += f.size || 0
    return acc
  }, {})

  const categories = Object.entries(byCategory)
    .map(([cat, data]) => ({ cat, ...data, color: FILE_COLORS[cat] }))
    .sort((a, b) => b.size - a.size)

  return (
    <div className="storage-page">
      <div className="storage-header">
        <h2 className="storage-title">Storage</h2>
        <p className="storage-sub">Your storage usage overview</p>
      </div>

      <div className="storage-overview">
        <div className="storage-overview__icon">
          <HardDrive size={28} color="var(--accent)" />
        </div>
        <div className="storage-overview__info">
          <p className="storage-overview__used">{fmtBytes(storageUsed)}</p>
          <p className="storage-overview__of">of 1 GB used</p>
        </div>
        <div className="storage-overview__pct">{usePct.toFixed(1)}%</div>
      </div>

      <div className="storage-bar">
        <div className="storage-bar__track">
          <div className="storage-bar__fill" style={{ width: `${usePct}%` }} />
        </div>
        <div className="storage-bar__labels">
          <span>{fmtBytes(storageUsed)} used</span>
          <span>{fmtBytes(free)} free</span>
        </div>
      </div>

      <div className="storage-breakdown">
        <h3 className="storage-breakdown__title">Breakdown by type</h3>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>
        ) : categories.length === 0 ? (
          <div className="storage-empty">No files uploaded yet.</div>
        ) : (
          <div className="storage-categories">
            {categories.map(({ cat, count, size, color }) => {
              const pct = storageUsed > 0 ? (size / storageUsed * 100).toFixed(1) : 0
              return (
                <div key={cat} className="storage-category">
                  <div className="storage-category__dot" style={{ background: color }} />
                  <div className="storage-category__info">
                    <span className="storage-category__name">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                    <span className="storage-category__count">{count} file{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="storage-category__bar">
                    <div className="storage-category__fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="storage-category__size">{fmtBytes(size)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Storage
