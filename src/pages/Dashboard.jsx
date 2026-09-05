import { ArrowUpRight, CheckCircle2, Clock3, FileCheck2, FileUp, KeyRound, LockKeyhole, Search, Share2, ShieldCheck, Upload, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import FileRow from '../components/FileRow.jsx'
import StatCard from '../components/StatCard.jsx'
import { dashboardStats, mockActivities } from '../data/mockData.js'
import { useFileData } from '../data/useFileData.js'
import './dashboard.css'

const activityIcons = { upload: Upload, share: Share2, token: KeyRound, download: FileCheck2, settings: LockKeyhole }

function Dashboard({ searchQuery = '' }) {
    const { files } = useFileData()
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const visibleFiles = normalizedQuery ? files.filter((file) => file.name.toLowerCase().includes(normalizedQuery)) : files

    return (
        <main className="dashboard-page">
            <section className="dashboard-welcome">
                <div>
                    <span className="dashboard-kicker">Personal vault <i /> September 5, 2026</span>
                    <h2>Your secure<br /><em>workspace.</em></h2>
                    <p>Good morning, Alex. A quiet overview of your protected files, active shares, and access activity.</p>
                </div>
                <div className="dashboard-welcome__actions">
                    <Link className="dashboard-button dashboard-button--secondary" to="/shared">View shared files <ArrowUpRight size={15} /></Link>
                    <Link className="dashboard-button dashboard-button--primary" to="/upload">Upload file <FileUp size={15} /></Link>
                </div>
            </section>

            <section className="stats-grid" aria-label="File statistics">
                <div className="metrics-intro"><span>Workspace at a glance</span><strong>Protected by design</strong></div>
                {dashboardStats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
            </section>

            <div className="dashboard-grid dashboard-grid--primary">
                <section className="dashboard-panel recent-files-panel">
                    <div className="panel-heading">
                        <div><span className="panel-eyebrow">The collection</span><h3>Recent files</h3><p>Protected objects in your workspace.</p></div>
                        <Link className="panel-link" to="/files">Open file library <ArrowUpRight size={15} /></Link>
                    </div>
                    <div className="file-table" aria-label="Recent files">
                        {visibleFiles.length ? visibleFiles.map((file) => <FileRow key={file.id} file={file} />) : <div className="empty-search"><Search size={18} /><strong>No files found</strong><span>Try a different file name.</span></div>}
                    </div>
                </section>

                <section className="dashboard-panel security-status-panel">
                    <div className="panel-heading"><div><span className="panel-eyebrow">Control layer</span><h3>Security status</h3><p>Demo workflow active</p></div><span className="security-status__icon"><ShieldCheck size={19} /></span></div>
                    <div className="security-status__summary"><span className="security-status__check"><CheckCircle2 size={18} /></span><div><strong>Your files are protected</strong><p>Security controls configured for this workspace.</p></div></div>
                    <div className="security-check-list">
                        <span><CheckCircle2 size={15} /> Protected file storage</span>
                        <span><CheckCircle2 size={15} /> Access-controlled sharing</span>
                        <span><CheckCircle2 size={15} /> Secure download verification</span>
                    </div>
                    <div className="security-status__note"><LockKeyhole size={14} /> Frontend demonstration only</div>
                </section>
            </div>

            <div className="dashboard-grid dashboard-grid--secondary">
                <section className="dashboard-panel activity-panel">
                    <div className="panel-heading"><div><span className="panel-eyebrow">A short record</span><h3>Recent activity</h3><p>The latest changes across your vault.</p></div><Clock3 size={18} className="panel-heading__icon" /></div>
                    <div className="activity-list">
                        {mockActivities.map((activity) => {
                            const Icon = activityIcons[activity.icon] || LockKeyhole
                            return <div className="activity-item" key={activity.id}><span className="activity-item__icon"><Icon size={15} /></span><span className="activity-item__copy"><strong>{activity.text}</strong><small>{activity.timestamp}</small></span></div>
                        })}
                    </div>
                </section>

                <section className="dashboard-panel quick-actions-panel">
                    <div className="panel-heading"><div><span className="panel-eyebrow">Move with intent</span><h3>Quick actions</h3><p>Common file-sharing tasks.</p></div><UsersRound size={18} className="panel-heading__icon" /></div>
                    <div className="quick-actions-grid">
                        <Link to="/upload" className="quick-action"><span><FileUp size={17} /></span><strong>Upload File</strong><small>Add protected file</small></Link>
                        <Link to="/files" className="quick-action"><span><FileCheck2 size={17} /></span><strong>View My Files</strong><small>Browse your library</small></Link>
                        <Link to="/shared" className="quick-action"><span><Share2 size={17} /></span><strong>Share a File</strong><small>Manage access</small></Link>
                        <Link to="/access" className="quick-action"><span><KeyRound size={17} /></span><strong>Secure Access</strong><small>Verify a token</small></Link>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Dashboard