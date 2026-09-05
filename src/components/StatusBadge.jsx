import { CheckCircle2, Clock3, LockKeyhole, Share2 } from 'lucide-react'

const statusIcons = {
    Protected: CheckCircle2,
    Pending: Clock3,
    Shared: Share2,
    Private: LockKeyhole,
}

function StatusBadge({ status }) {
    const Icon = statusIcons[status] || LockKeyhole
    const tone = status === 'Protected' || status === 'Shared' ? 'success' : status === 'Pending' ? 'warning' : 'neutral'

    return (
        <span className={`status-badge status-badge--${tone}`}>
            <Icon size={13} aria-hidden="true" />
            {status}
        </span>
    )
}

export default StatusBadge