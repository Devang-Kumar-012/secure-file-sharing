import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    BadgeCheck,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Download,
    FileLock2,
    KeyRound,
    LockKeyhole,
    Menu,
    ShieldCheck,
    Sparkles,
    UsersRound,
    X,
} from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import './pages.css'

const features = [
    {
        icon: FileLock2,
        title: 'Encrypted Files',
        description: 'Files are represented as protected before secure storage.',
    },
    {
        icon: UsersRound,
        title: 'Controlled Access',
        description: 'Define who can access a shared file and what they can do.',
    },
    {
        icon: KeyRound,
        title: 'Secure Tokens',
        description: 'Generate access tokens for controlled file sharing.',
    },
    {
        icon: Clock3,
        title: 'Expiring Access',
        description: 'Limit access using expiration times and download limits.',
    },
]

const steps = [
    { number: '01', title: 'Upload', text: 'Choose a file and define its sharing context.' },
    { number: '02', title: 'Protect', text: 'Mark it protected before it enters secure storage.' },
    { number: '03', title: 'Share', text: 'Set permissions, expiry, and download limits.' },
    { number: '04', title: 'Verify & Download', text: 'Confirm the token before authorized access.' },
]

function SecurityVisualization() {
    return (
        <div className="hero-visual" aria-label="Secure file sharing visualization">
            <div className="hero-visual__grid" aria-hidden="true" />
            <div className="hero-visual__halo hero-visual__halo--one" aria-hidden="true" />
            <div className="hero-visual__halo hero-visual__halo--two" aria-hidden="true" />
            <div className="visual-orbit visual-orbit--top"><LockKeyhole size={15} /> Encrypted</div>
            <div className="visual-orbit visual-orbit--right"><BadgeCheck size={15} /> Verified</div>
            <div className="visual-orbit visual-orbit--bottom"><KeyRound size={15} /> Token ready</div>
            <div className="secure-file-card">
                <div className="secure-file-card__topline">
                    <span className="file-type-icon"><FileLock2 size={20} /></span>
                    <Badge tone="success" icon={CheckCircle2}>Protected</Badge>
                </div>
                <div className="secure-file-card__name">Project_Report.pdf</div>
                <div className="secure-file-card__meta">4.2 MB <span>•</span> Secured just now</div>
                <div className="secure-file-card__progress">
                    <span><ShieldCheck size={14} /> Secure storage</span>
                    <strong>100%</strong>
                </div>
                <div className="secure-file-card__bar"><span /></div>
            </div>
            <div className="visual-token-card">
                <span className="visual-token-card__icon"><KeyRound size={16} /></span>
                <span><small>Access token</small><strong>SS-••••-7K2P</strong></span>
                <Check size={16} />
            </div>
        </div>
    )
}

function Landing() {
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => setMenuOpen(false)

    return (
        <div className="landing-page">
            <header className="landing-nav">
                <Link className="landing-brand" to="/" onClick={closeMenu} aria-label="SecureShare home">
                    <span className="landing-brand__mark"><ShieldCheck size={18} strokeWidth={2.4} /></span>
                    <span>SecureShare</span>
                </Link>
                <button
                    className="mobile-menu-toggle"
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-controls="landing-navigation"
                    aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <nav id="landing-navigation" className={`landing-navigation ${menuOpen ? 'landing-navigation--open' : ''}`}>
                    <a href="#features" onClick={closeMenu}>Features</a>
                    <a href="#security" onClick={closeMenu}>Security</a>
                    <a href="#how-it-works" onClick={closeMenu}>How It Works</a>
                    <span className="landing-navigation__divider" aria-hidden="true" />
                    <Link className="landing-nav__login" to="/login" onClick={closeMenu}>Log In</Link>
                    <Button as={Link} to="/login" variant="primary" className="landing-nav__cta" onClick={closeMenu}>Get Started</Button>
                </nav>
            </header>

            <main>
                <section className="landing-hero page-section">
                    <div className="landing-hero__content reveal-up">
                        <div className="section-kicker"><span className="kicker-dot" /> Secure sharing, thoughtfully designed</div>
                        <h1>Share Files.<br /><span>Keep Them Secure.</span></h1>
                        <p className="landing-hero__description">Secure file sharing with encrypted storage, controlled access, and time-sensitive sharing.</p>
                        <div className="landing-hero__actions">
                            <Button as={Link} to="/login" variant="primary">Get Started <ArrowRight size={17} /></Button>
                            <a className="text-link" href="#how-it-works">See How It Works <ChevronRight size={16} /></a>
                        </div>
                        <div className="landing-hero__note"><LockKeyhole size={14} /> Frontend prototype for secure sharing workflows</div>
                    </div>
                    <SecurityVisualization />
                </section>

                <section className="trust-strip" aria-label="Security capabilities">
                    <div><LockKeyhole size={17} /><span>AES-256 Protected</span></div>
                    <div><UsersRound size={17} /><span>Controlled Access</span></div>
                    <div><KeyRound size={17} /><span>Secure Tokens</span></div>
                    <div><Clock3 size={17} /><span>Time-Limited Sharing</span></div>
                </section>

                <section id="features" className="landing-section page-section">
                    <div className="section-heading reveal-up">
                        <div className="section-kicker">Core protections</div>
                        <h2>Security built into every share.</h2>
                        <p>This prototype makes each part of a secure sharing workflow clear, visible, and easy to understand.</p>
                    </div>
                    <div className="feature-grid">
                        {features.map(({ icon: Icon, title, description }) => (
                            <article className="feature-card reveal-up" key={title}>
                                <span className="feature-card__icon"><Icon size={20} /></span>
                                <h3>{title}</h3>
                                <p>{description}</p>
                                <span className="feature-card__line" aria-hidden="true" />
                            </article>
                        ))}
                    </div>
                </section>

                <section id="how-it-works" className="landing-section workflow-section page-section">
                    <div className="section-heading reveal-up">
                        <div className="section-kicker">The workflow</div>
                        <h2>From upload to authorized download.</h2>
                        <p>A clear four-step path that keeps the owner in control at every stage.</p>
                    </div>
                    <div className="workflow-grid">
                        {steps.map(({ number, title, text }, index) => (
                            <div className="workflow-step reveal-up" key={number}>
                                <div className="workflow-step__number">{number}</div>
                                <div className="workflow-step__copy"><h3>{title}</h3><p>{text}</p></div>
                                {index < steps.length - 1 ? <span className="workflow-step__connector" aria-hidden="true" /> : null}
                            </div>
                        ))}
                    </div>
                </section>

                <section id="security" className="security-section page-section">
                    <div className="security-section__copy reveal-up">
                        <div className="section-kicker">Control by design</div>
                        <h2>Your files.<br /><span>Your control.</span></h2>
                        <p>Make the intended recipient, permitted action, and access window visible before a download can happen.</p>
                        <div className="security-section__checks">
                            <span><CheckCircle2 size={16} /> Protected before sharing</span>
                            <span><CheckCircle2 size={16} /> Authorized recipient access</span>
                            <span><CheckCircle2 size={16} /> Token verified at download</span>
                        </div>
                    </div>
                    <div className="security-flow reveal-up" aria-label="Secure file access flow">
                        <div className="security-flow__node"><FileLock2 size={19} /><span>File</span></div>
                        <ArrowRight className="security-flow__arrow" size={18} />
                        <div className="security-flow__node security-flow__node--active"><ShieldCheck size={19} /><span>Protected</span><small>Ready</small></div>
                        <ArrowRight className="security-flow__arrow" size={18} />
                        <div className="security-flow__node"><UsersRound size={19} /><span>Access controlled</span></div>
                        <ArrowRight className="security-flow__arrow" size={18} />
                        <div className="security-flow__node"><KeyRound size={19} /><span>Token verified</span></div>
                        <ArrowRight className="security-flow__arrow" size={18} />
                        <div className="security-flow__node"><Download size={19} /><span>Download</span></div>
                    </div>
                </section>

                <section className="landing-cta page-section reveal-up">
                    <span className="landing-cta__icon"><Sparkles size={19} /></span>
                    <h2>Ready to share securely?</h2>
                    <p>Experience the SecureShare workflow.</p>
                    <Button as={Link} to="/login" variant="primary">Get Started <ArrowRight size={17} /></Button>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="landing-footer__brand"><span className="landing-brand__mark"><ShieldCheck size={17} /></span><span><strong>SecureShare</strong><small>Secure file sharing, simplified.</small></span></div>
                <nav className="landing-footer__links" aria-label="Footer navigation">
                    <a href="#features">Features</a><a href="#security">Security</a><a href="#how-it-works">How It Works</a><Link to="/login">Login</Link>
                </nav>
                <span className="landing-footer__meta">Academic Project • Secure File Sharing System</span>
            </footer>
        </div>
    )
}

export default Landing