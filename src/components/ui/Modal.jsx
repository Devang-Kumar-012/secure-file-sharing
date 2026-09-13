import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import './modal.css'

function Modal({ open, onClose, title, children, width = 480 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    ref.current?.focus()
    return () => prev?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ maxWidth: width }}
        ref={ref}
        tabIndex={-1}
      >
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
