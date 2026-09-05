import { ArrowRight, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

function RoutePlaceholder({ label }) {
    return (
        <main className="route-placeholder">
            <div className="route-placeholder__content">
                <span className="route-placeholder__icon"><LockKeyhole size={20} /></span>
                <span className="route-placeholder__eyebrow">{label}</span>
                <h2>Coming next.</h2>
                <p>This workspace area is ready for the next SecureShare workflow.</p>
                <Link className="route-placeholder__link" to="/dashboard">Return to dashboard <ArrowRight size={15} /></Link>
            </div>
        </main>
    )
}

export default RoutePlaceholder