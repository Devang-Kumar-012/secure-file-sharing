import './badge.css'

function Badge({ tone = 'neutral', icon: Icon, children, size = 'md' }) {
  return (
    <span className={`badge badge--${tone} badge--${size}`}>
      {Icon && <Icon size={tone === 'sm' ? 11 : 13} aria-hidden />}
      {children}
    </span>
  )
}

export default Badge
