function Badge({ tone = 'neutral', icon: Icon, children }) {
    return (
        <span className={`ui-badge ui-badge--${tone}`}>
            {Icon ? <Icon size={13} aria-hidden="true" /> : null}
            {children}
        </span>
    )
}

export default Badge