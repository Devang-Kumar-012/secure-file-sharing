function Input({ label, error, icon: Icon, rightElement, id, ...props }) {
    return (
        <div className="ui-field">
            <label className="ui-field__label" htmlFor={id}>
                {label}
            </label>
            <div className={`ui-field__control ${error ? 'ui-field__control--error' : ''}`.trim()}>
                {Icon ? <Icon className="ui-field__icon" size={17} aria-hidden="true" /> : null}
                <input id={id} aria-invalid={Boolean(error)} {...props} />
                {rightElement}
            </div>
            {error ? <p className="ui-field__error" role="alert">{error}</p> : null}
        </div>
    )
}

export default Input