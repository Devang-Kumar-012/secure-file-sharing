import { LoaderCircle } from 'lucide-react'

function Button({ as: Component = 'button', variant = 'primary', loading = false, className = '', children, ...props }) {
    return (
        <Component
            className={`ui-button ui-button--${variant} ${className}`.trim()}
            aria-busy={loading || undefined}
            {...props}
            disabled={Component === 'button' ? loading || props.disabled : undefined}
        >
            {loading ? <LoaderCircle className="ui-button__loader" size={17} aria-hidden="true" /> : null}
            {children}
        </Component>
    )
}

export default Button