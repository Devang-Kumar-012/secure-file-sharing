import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import './toast.css'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className={`toast toast--${type}`} role="status" aria-live="polite">
      {type === 'success' ? <CheckCircle2 size={18} aria-hidden /> : <XCircle size={18} aria-hidden />}
      <span>{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast
