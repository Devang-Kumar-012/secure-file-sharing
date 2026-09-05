import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    FileLock2,
    KeyRound,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import './pages.css'

const DEMO_EMAIL = 'demo@secureshare.local'
const DEMO_PASSWORD = 'demo123'

function LoginSecurityVisual() {
    return (
        <div className="login-visual" aria-label="SecureShare protection overview">
            <div className="login-visual__grid" aria-hidden="true" />
            <div className="login-visual__lock"><LockKeyhole size={29} /></div>
            <div className="login-visual__ring login-visual__ring--one" aria-hidden="true" />
            <div className="login-visual__ring login-visual__ring--two" aria-hidden="true" />
            <span className="login-visual__float login-visual__float--one"><FileLock2 size={15} /> Protected</span>
            <span className="login-visual__float login-visual__float--two"><KeyRound size={15} /> Token based</span>
            <span className="login-visual__float login-visual__float--three"><ShieldCheck size={15} /> Verified</span>
        </div>
    )
}

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(false)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')

    const validate = () => {
        const nextErrors = {}
        if (!email) nextErrors.email = 'Email is required.'
        else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.'
        if (!password) nextErrors.password = 'Password is required.'
        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const completeLogin = (nextEmail = email, nextPassword = password) => {
        if (nextEmail !== DEMO_EMAIL || nextPassword !== DEMO_PASSWORD) {
            setStatus('error')
            return
        }
        setStatus('loading')
        window.setTimeout(() => {
            setStatus('success')
            window.setTimeout(() => navigate('/dashboard'), 450)
        }, 700)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (validate()) completeLogin()
    }

    const handleDemoLogin = () => {
        setEmail(DEMO_EMAIL)
        setPassword(DEMO_PASSWORD)
        setErrors({})
        completeLogin(DEMO_EMAIL, DEMO_PASSWORD)
    }

    const passwordToggle = (
        <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
    )

    return (
        <main className="login-page">
            <section className="login-brand-panel">
                <Link className="login-brand" to="/"><span className="landing-brand__mark"><ShieldCheck size={18} /></span><span>SecureShare</span></Link>
                <div className="login-brand-panel__content">
                    <div className="section-kicker"><span className="kicker-dot" /> A safer way to share</div>
                    <h1>Secure access<br /><span>to your files.</span></h1>
                    <p>Bring protected storage, controlled access, and verified downloads into one focused workflow.</p>
                    <LoginSecurityVisual />
                    <div className="login-trust-list">
                        <span><CheckCircle2 size={16} /> Protected Files</span>
                        <span><CheckCircle2 size={16} /> Controlled Access</span>
                        <span><CheckCircle2 size={16} /> Secure Sharing</span>
                    </div>
                </div>
                <span className="login-brand-panel__footer">Secure File Sharing System <span>•</span> Academic prototype</span>
            </section>

            <section className="login-form-panel">
                <Link className="login-back-link" to="/"><ArrowLeft size={15} /> Back to home</Link>
                <div className="login-card">
                    <div className="login-card__heading">
                        <span className="login-card__icon"><LockKeyhole size={19} /></span>
                        <div><h2>Welcome back</h2><p>Sign in to continue to your SecureShare dashboard.</p></div>
                    </div>
                    {status === 'success' ? <div className="login-feedback login-feedback--success" role="status"><CheckCircle2 size={17} /> Authentication successful. Opening your workspace...</div> : null}
                    {status === 'error' ? <div className="login-feedback login-feedback--error" role="alert">Invalid demo credentials. Please check your email and password.</div> : null}
                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <Input id="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setStatus('idle') }} error={errors.email} icon={Mail} required />
                        <Input id="password" label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => { setPassword(event.target.value); setStatus('idle') }} error={errors.password} icon={LockKeyhole} rightElement={passwordToggle} required />
                        <div className="login-form__options">
                            <label className="checkbox-label"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>Remember me</span></label>
                            <button className="forgot-button" type="button">Forgot password?</button>
                        </div>
                        <Button type="submit" variant="primary" className="login-submit" loading={status === 'loading'}>{status === 'success' ? 'Authenticated' : 'Sign In'}</Button>
                    </form>
                    <div className="login-divider"><span>or</span></div>
                    <Button type="button" variant="secondary" className="demo-login-button" onClick={handleDemoLogin} loading={status === 'loading'}><SparkleIcon /> Continue with Demo Account</Button>
                    <p className="demo-hint"><span>Demo access</span> {DEMO_EMAIL} <b>•</b> {DEMO_PASSWORD}</p>
                </div>
                <p className="login-disclaimer"><ShieldCheck size={14} /> Frontend-only demonstration. No real credentials are stored.</p>
            </section>
        </main>
    )
}

function SparkleIcon() {
    return <KeyRound size={16} aria-hidden="true" />
}

export default Login