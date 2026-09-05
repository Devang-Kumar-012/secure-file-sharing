import { FileCheck2, Files, KeyRound, Share2 } from 'lucide-react'

const statIcons = { files: Files, shared: Share2, protected: FileCheck2, tokens: KeyRound }

function StatCard({ stat }) {
    const Icon = statIcons[stat.icon] || Files

    return (
        <article className="stat-card">
            <div className="stat-card__topline">
                <span className="stat-card__icon"><Icon size={18} aria-hidden="true" /></span>
                <span className="stat-card__label">{stat.label}</span>
            </div>
            <strong className="stat-card__value">{stat.value}</strong>
            <span className="stat-card__context">{stat.context}</span>
        </article>
    )
}

export default StatCard