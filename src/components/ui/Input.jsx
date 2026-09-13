import './input.css'

function Input({ label, error, hint, icon: Icon, rightElement, id, className = '', ...props }) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field__label" htmlFor={id}>{label}</label>}
      <div className={`field__wrap ${error ? 'field__wrap--error' : ''}`}>
        {Icon && <Icon className="field__icon" size={17} aria-hidden />}
        <input id={id} className="field__input" aria-invalid={Boolean(error)} {...props} />
        {rightElement && <div className="field__right">{rightElement}</div>}
      </div>
      {error && <p className="field__error" role="alert">{error}</p>}
      {hint && !error && <p className="field__hint">{hint}</p>}
    </div>
  )
}

export default Input
