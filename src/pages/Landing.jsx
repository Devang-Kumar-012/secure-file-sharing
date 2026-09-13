import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Upload, Search, Eye, Lock, Zap, ChevronRight,
  Menu, X, Check, HardDrive, FileText, FileImage, FileArchive, File
} from 'lucide-react'
import './landing.css'

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="landing">
      {/* ── NAV ── */}
      <nav className="lnav">
        <div className="lnav__inner">
          <Link to="/" className="lnav__brand">
            <Shield size={22} /> SecureShare
          </Link>

          <div className={`lnav__links ${menuOpen ? 'lnav__links--open' : ''}`}>
            <a href="#features" className="lnav__link" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#security" className="lnav__link" onClick={() => setMenuOpen(false)}>Security</a>
            <a href="#how-it-works" className="lnav__link" onClick={() => setMenuOpen(false)}>How It Works</a>
            <Link to="/login" className="lnav__link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/signup" className="lnav__cta" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>

          <button
            className="lnav__toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__text">
            <div className="hero__kicker">
              <Shield size={14} /> Private · Secure · Yours
            </div>
            <h1 className="hero__headline">
              Your files.<br />
              Your space.<br />
              <span className="hero__accent">Your control.</span>
            </h1>
            <p className="hero__sub">
              Upload, organise, and access your files from anywhere.
              Every file is stored privately — only you can see them.
            </p>
            <div className="hero__ctas">
              <Link to="/signup" className="btn btn--primary btn--xl">
                Get Started Free <ChevronRight size={20} />
              </Link>
              <Link to="/login" className="btn btn--secondary btn--xl">
                Sign In
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="features__inner">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need.</h2>
          <div className="features__grid">
            {[
              { icon: Lock,     title: 'Private Storage',     desc: 'Files are stored privately in your account. No public access without your permission.' },
              { icon: Zap,      title: 'Instant Access',      desc: 'Upload once, access anywhere. Files load quickly with signed secure URLs.' },
              { icon: Search,   title: 'Search & Sort',       desc: 'Find any file instantly with real-time search and flexible sorting.' },
              { icon: Eye,      title: 'Built-in Preview',    desc: 'Preview images, PDFs, text files, audio, and video directly in the browser.' },
              { icon: Upload,   title: 'Drag & Drop Upload',  desc: 'Drop any file to upload instantly. Supports any file type up to 500 MB.' },
              { icon: HardDrive,title: 'Storage Insights',    desc: 'See your real storage usage with a clear breakdown by file type.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-card__icon">
                  <Icon size={22} />
                </div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section className="security-section" id="security">
        <div className="security-section__inner">
          <div>
            <div className="section-label">Security</div>
            <h2 className="section-title">Built for privacy.</h2>
            <p className="security-section__intro">
              SecureShare uses Supabase Storage with Row Level Security policies
              to ensure your files are completely private. No one else can access
              what you upload.
            </p>
            <div className="security-checks">
              {[
                'Row Level Security enforced at database level',
                'Private storage bucket — no public file access',
                'Signed, time-limited URLs for file access',
                'Authentication required for every operation',
                'Your files are isolated from other users',
              ].map(item => (
                <div key={item} className="security-check">
                  <Check size={16} color="var(--success)" strokeWidth={2.5} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="security-section__visual">
            <SecurityCard />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-it-works__inner">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Three steps.</h2>
          <div className="steps">
            {[
              { n: '01', title: 'Create an account', desc: 'Sign up with your email. No credit card required.' },
              { n: '02', title: 'Upload your files',  desc: 'Drag and drop or click to upload any file type.' },
              { n: '03', title: 'Access anywhere',    desc: 'Preview, download, rename, or delete your files anytime.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="step">
                <span className="step__num">{n}</span>
                <h3 className="step__title">{title}</h3>
                <p className="step__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="final-cta">
        <div className="final-cta__inner">
          <h2 className="final-cta__headline">
            Start storing<br />files securely.
          </h2>
          <p className="final-cta__sub">Free to use. No setup required.</p>
          <Link to="/signup" className="btn btn--accent btn--xl">
            Get Started <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="lfooter__inner">
          <div className="lfooter__brand">
            <Shield size={18} /> SecureShare
          </div>
          <p className="lfooter__copy">Built with React, Vite &amp; Supabase.</p>
          <div className="lfooter__links">
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Dashboard mockup visual ──
function DashboardMockup() {
  const files = [
    { icon: FileImage,   name: 'design-final.png',  size: '2.4 MB',  color: '#8b5cf6' },
    { icon: FileText,    name: 'report-q3.pdf',      size: '1.1 MB',  color: '#ef4444' },
    { icon: FileArchive, name: 'assets-v2.zip',      size: '18.2 MB', color: '#6b7280' },
    { icon: File,        name: 'notes.txt',           size: '14 KB',   color: '#3b82f6' },
  ]
  return (
    <div className="mockup">
      <div className="mockup__bar">
        <div className="mockup__dots">
          <span /><span /><span />
        </div>
        <span className="mockup__title">My Files</span>
      </div>
      <div className="mockup__search">
        <Search size={13} color="#8a8a8a" />
        <span>Search files…</span>
      </div>
      <div className="mockup__files">
        {files.map(({ icon: Icon, name, size, color }) => (
          <div key={name} className="mockup__file">
            <Icon size={18} color={color} />
            <span className="mockup__fname">{name}</span>
            <span className="mockup__fsize">{size}</span>
          </div>
        ))}
      </div>
      <div className="mockup__storage">
        <span>Storage</span>
        <div className="mockup__sbar"><div className="mockup__sfill" /></div>
        <span>21.7 MB / 1 GB</span>
      </div>
    </div>
  )
}

// ── Security card visual ──
function SecurityCard() {
  return (
    <div className="sec-card">
      <div className="sec-card__header">
        <Shield size={24} color="var(--success)" />
        <span>Access Control</span>
      </div>
      <div className="sec-card__rows">
        {[
          ['RLS Policy',     'Enabled',  'success'],
          ['Private Bucket', 'Active',   'success'],
          ['Auth Required',  'Yes',      'success'],
          ['Signed URLs',    '60s TTL',  'neutral'],
        ].map(([label, value, tone]) => (
          <div key={label} className="sec-card__row">
            <span className="sec-card__label">{label}</span>
            <span className={`sec-card__val sec-card__val--${tone}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Landing
