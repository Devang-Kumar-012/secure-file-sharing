import { CheckCircle2, Download, FileArchive, FileSpreadsheet, FileText, KeyRound, Presentation, Share2, ShieldCheck, X } from 'lucide-react'
import { useEffect } from 'react'
import StatusBadge from './StatusBadge.jsx'

const fileIcons = { pdf: FileText, xlsx: FileSpreadsheet, pptx: Presentation, zip: FileArchive, csv: FileSpreadsheet }

function FileDetails({ file, onClose, onDownload, onShare }) {
    const extension = file.name.split('.').pop()
    const Icon = fileIcons[extension] || FileText

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose()
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    return (
        <div className="file-details-layer">
            <button className="file-details__scrim" type="button" aria-label="Close file details" onClick={onClose} />
            <aside className="file-details" role="dialog" aria-modal="true" aria-labelledby="file-details-title">
                <div className="file-details__top"><span className="panel-eyebrow">File details</span><button className="icon-button" type="button" aria-label="Close file details" onClick={onClose}><X size={18} /></button></div>
                <div className="file-details__identity"><span className="file-details__icon"><Icon size={24} /></span><div><h2 id="file-details-title">{file.name}</h2><p>{file.type} <i>·</i> {file.size}</p></div></div>
                <div className="file-details__badges"><StatusBadge status={file.protectionStatus} /><StatusBadge status={file.shared ? 'Shared' : 'Private'} /></div>
                <dl className="file-details__meta">
                    <div><dt>Uploaded</dt><dd>{file.uploadedAt}</dd></div>
                    <div><dt>Modified</dt><dd>{file.modifiedAt}</dd></div>
                    <div><dt>Owner</dt><dd>{file.owner}</dd></div>
                    <div><dt>Downloads</dt><dd>{file.downloads}</dd></div>
                </dl>
                <section className="file-details__security"><div className="file-details__section-heading"><span>Security & access</span><ShieldCheck size={16} /></div><div className="security-detail"><CheckCircle2 size={15} /><span><small>Protection</small><strong>AES-256 Protected</strong></span></div><div className="security-detail"><KeyRound size={15} /><span><small>Access</small><strong>{file.shared ? 'Access Controlled' : 'Private workspace'}</strong></span></div><div className="security-detail"><CheckCircle2 size={15} /><span><small>Integrity</small><strong>Verified <em>Demo state</em></strong></span></div></section>
                <div className="file-details__actions"><button className="file-details__primary" type="button" onClick={onDownload}><Download size={16} /> Demo download</button><button className="file-details__secondary" type="button" onClick={onShare}><Share2 size={16} /> Share</button></div>
                <p className="file-details__disclaimer">Security states are simulated for this frontend prototype.</p>
            </aside>
        </div>
    )
}

export default FileDetails