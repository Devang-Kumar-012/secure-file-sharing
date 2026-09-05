import { Download, FileArchive, FileSpreadsheet, FileText, MoreHorizontal, Presentation } from 'lucide-react'
import { useState } from 'react'
import StatusBadge from './StatusBadge.jsx'

const fileIcons = { pdf: FileText, xlsx: FileSpreadsheet, pptx: Presentation, zip: FileArchive, csv: FileSpreadsheet }

function FileRow({ file }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const extension = file.name.split('.').pop()
    const Icon = fileIcons[extension] || FileText

    return (
        <article className="file-row">
            <div className="file-row__identity">
                <span className="file-row__icon"><Icon size={19} aria-hidden="true" /></span>
                <span className="file-row__name"><strong>{file.name}</strong><small>{file.type} <i>·</i> {file.size}</small></span>
            </div>
            <span className="file-row__modified"><small>Modified</small>{file.modifiedAt}</span>
            <div className="file-row__status"><StatusBadge status={file.protectionStatus} /><StatusBadge status={file.shared ? 'Shared' : 'Private'} /></div>
            <div className="file-row__actions">
                <button className="icon-button" type="button" aria-label={`Actions for ${file.name}`} onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>
                    <MoreHorizontal size={18} />
                </button>
                {menuOpen ? (
                    <div className="file-row__menu">
                        <button type="button">View details</button>
                        <button type="button">Share file</button>
                        <button type="button"><Download size={14} /> Demo download</button>
                    </div>
                ) : null}
            </div>
        </article>
    )
}

export default FileRow