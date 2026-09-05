import { FileArchive, FileSpreadsheet, FileText, MoreHorizontal, Presentation } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'

const fileIcons = { pdf: FileText, xlsx: FileSpreadsheet, pptx: Presentation, zip: FileArchive, csv: FileSpreadsheet }

function FileItem({ file, onOpen }) {
    const extension = file.name.split('.').pop()
    const Icon = fileIcons[extension] || FileText

    return (
        <article className="file-object">
            <button className="file-object__main" type="button" onClick={() => onOpen(file)}>
                <span className="file-object__icon"><Icon size={20} aria-hidden="true" /></span>
                <span className="file-object__identity"><strong>{file.name}</strong><small>{file.type} <i>·</i> {file.size}</small></span>
            </button>
            <span className="file-object__date"><small>Modified</small>{file.modifiedAt}</span>
            <span className="file-object__status"><StatusBadge status={file.protectionStatus} /><StatusBadge status={file.shared ? 'Shared' : 'Private'} /></span>
            <button className="icon-button file-object__action" type="button" aria-label={`Open details for ${file.name}`} onClick={() => onOpen(file)}><MoreHorizontal size={18} /></button>
        </article>
    )
}

export default FileItem