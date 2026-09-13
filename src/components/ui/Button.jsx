import { Loader2 } from 'lucide-react'
import './button.css'

function Button({ as: Tag = 'button', variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ')
  return (
    <Tag
      className={classes}
      aria-busy={loading || undefined}
      {...props}
      disabled={Tag === 'button' ? (loading || props.disabled) : undefined}
    >
      {loading && <Loader2 className="btn__spinner" size={16} aria-hidden />}
      {children}
    </Tag>
  )
}

export default Button
