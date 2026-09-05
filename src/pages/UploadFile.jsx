import { Check, CheckCircle2, FileArchive, FileSpreadsheet, FileText, FileUp, LoaderCircle, LockKeyhole, Presentation, ShieldCheck, UploadCloud, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFileData } from '../data/useFileData.js'
import './upload.css'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const workflowSteps = ['Preparing file', 'Encrypting file', 'Verifying integrity', 'Securing file access']
const supportedExtensions = new Set(['pdf', 'xlsx', 'pptx', 'zip', 'csv', 'doc', 'docx', 'png', 'jpg', 'jpeg'])
const fileIcons = { pdf: FileText, xlsx: FileSpreadsheet, pptx: Presentation, zip: FileArchive, csv: FileSpreadsheet }
const fileTypeLabels = { pdf: 'PDF Document', xlsx: 'Excel Spreadsheet', pptx: 'PowerPoint Presentation', zip: 'ZIP Archive', csv: 'CSV Dataset', doc: 'Word Document', docx: 'Word Document' }

function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadFile() {
    const { addFile } = useFileData()
    const inputRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState('')
    const [status, setStatus] = useState('idle')
    const [workflowStep, setWorkflowStep] = useState(0)

    useEffect(() => {
        if (status !== 'processing') return undefined

        const stepTimers = workflowSteps.map((_, index) => window.setTimeout(() => setWorkflowStep(index), index * 550))
        const completeTimer = window.setTimeout(() => {
            if (selectedFile) {
                addFile(selectedFile)
                setStatus('complete')
            }
        }, workflowSteps.length * 550)

        return () => {
            stepTimers.forEach((timer) => window.clearTimeout(timer))
            window.clearTimeout(completeTimer)
        }
    }, [addFile, selectedFile, status])

    const validateFile = (file) => {
        if (!file || file.size === 0) return 'This file is empty. Choose a file with content.'
        if (file.size > MAX_FILE_SIZE) return 'This file is larger than the 100 MB demo limit.'
        const extension = file.name.split('.').pop()?.toLowerCase()
        if (!supportedExtensions.has(extension)) return 'This file type is not supported in the demo workflow.'
        return ''
    }

    const selectFile = (file) => {
        const validationError = validateFile(file)
        setError(validationError)
        if (validationError) {
            setSelectedFile(null)
            return
        }
        setSelectedFile(file)
        setStatus('idle')
        setWorkflowStep(0)
    }

    const handleInputChange = (event) => {
        selectFile(event.target.files?.[0])
        event.target.value = ''
    }

    const handleDrop = (event) => {
        event.preventDefault()
        setDragActive(false)
        selectFile(event.dataTransfer.files?.[0])
    }

    const resetUpload = () => {
        setSelectedFile(null)
        setError('')
        setStatus('idle')
        setWorkflowStep(0)
    }

    const startUpload = () => {
        if (!selectedFile) return
        setError('')
        setStatus('processing')
        setWorkflowStep(0)
    }

    const extension = selectedFile?.name.split('.').pop()?.toLowerCase()
    const FileIcon = fileIcons[extension] || FileText
    const selectedFileType = fileTypeLabels[extension] || selectedFile?.type || extension?.toUpperCase()

    return (
        <main className="upload-page">
            <section className="upload-intro">
                <div><span className="upload-kicker">Secure workflow <i /> Demo simulation</span><h2>Upload a file</h2><p>Protect your document and prepare it for secure sharing.</p></div>
                <div className="upload-intro__note"><ShieldCheck size={16} /><span>Security workflow simulated locally</span></div>
            </section>

            {status === 'complete' && selectedFile ? (
                <section className="upload-success" role="status">
                    <div className="upload-success__mark"><Check size={22} /></div>
                    <span className="upload-kicker">Upload complete</span>
                    <h3>File secured successfully.</h3>
                    <p>{selectedFile.name} is protected and ready for the next access-control step.</p>
                    <div className="upload-success__file"><FileIcon size={20} /><span><strong>{selectedFile.name}</strong><small>{selectedFileType} <i>·</i> {formatFileSize(selectedFile.size)}</small></span><CheckCircle2 size={17} /></div>
                    <div className="upload-success__states"><span><CheckCircle2 size={15} /> Protected</span><span><CheckCircle2 size={15} /> Integrity verified</span><span><CheckCircle2 size={15} /> Ready for access control</span></div>
                    <div className="upload-success__actions"><Link className="upload-action upload-action--primary" to="/files">View My Files <FileUp size={15} /></Link><button className="upload-action upload-action--secondary" type="button" onClick={resetUpload}>Upload Another <UploadCloud size={15} /></button><Link className="upload-action upload-action--text" to="/dashboard">Continue <span aria-hidden="true">→</span></Link></div>
                    <p className="upload-disclaimer">AES-256 protection and integrity verification are simulated for this frontend prototype.</p>
                </section>
            ) : status === 'processing' ? (
                <section className="upload-processing" aria-live="polite">
                    <div className="upload-processing__heading"><div><span className="upload-kicker">Secure upload</span><h3>{workflowSteps[workflowStep]}...</h3><p>Preparing your file for the SecureShare workflow.</p></div><LoaderCircle className="upload-processing__spinner" size={23} /></div>
                    <div className="upload-progress"><span style={{ width: `${((workflowStep + 1) / workflowSteps.length) * 100}%` }} /></div>
                    <div className="upload-steps">{workflowSteps.map((step, index) => <div className={`upload-step ${index < workflowStep ? 'upload-step--done' : ''} ${index === workflowStep ? 'upload-step--current' : ''}`} key={step}><span>{index < workflowStep ? <Check size={13} /> : index === workflowStep ? <LoaderCircle size={13} /> : index + 1}</span><strong>{step}</strong><small>{index < workflowStep ? 'Complete' : index === workflowStep ? 'In progress' : 'Queued'}</small></div>)}</div>
                    <p className="upload-processing__note"><LockKeyhole size={14} /> Security workflow simulated locally. No file leaves this browser.</p>
                </section>
            ) : (
                <section className="upload-canvas">
                    <div className="upload-canvas__main">
                        <input ref={inputRef} className="upload-input" type="file" accept=".pdf,.xlsx,.pptx,.zip,.csv,.doc,.docx,.png,.jpg,.jpeg" onChange={handleInputChange} aria-label="Choose a file to upload" />
                        {selectedFile ? <div className="upload-preview"><div className="upload-preview__top"><span className="upload-preview__label">Selected file</span><button className="icon-button" type="button" aria-label="Remove selected file" onClick={resetUpload}><X size={17} /></button></div><div className="upload-preview__file"><span className="upload-preview__icon"><FileIcon size={24} /></span><span><strong title={selectedFile.name}>{selectedFile.name}</strong><small>{selectedFileType} <i>·</i> {formatFileSize(selectedFile.size)}</small></span><CheckCircle2 size={18} /></div><div className="upload-preview__actions"><button className="upload-action upload-action--primary" type="button" onClick={startUpload}>Secure Upload <LockKeyhole size={15} /></button><button className="upload-action upload-action--text" type="button" onClick={() => inputRef.current?.click()}>Change file</button></div></div> : <button className={`upload-dropzone ${dragActive ? 'upload-dropzone--active' : ''}`} type="button" onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }} onDragOver={(event) => { event.preventDefault(); setDragActive(true) }} onDragLeave={(event) => { event.preventDefault(); setDragActive(false) }} onDrop={handleDrop}><span className="upload-dropzone__icon"><UploadCloud size={24} /></span><strong>{dragActive ? 'Release to select your file' : 'Drop a file here or choose one'}</strong><span>PDF, spreadsheets, presentations, archives and images</span><small>Maximum demo file size: 100 MB</small></button>}
                        {error ? <p className="upload-error" role="alert"><X size={15} /> {error}</p> : null}
                    </div>
                    <aside className="upload-canvas__aside"><span className="upload-aside__line" /><span className="upload-kicker">What happens next</span><h3>A clear path to protected sharing.</h3><div className="upload-aside__steps"><span><b>01</b> File prepared</span><span><b>02</b> Security workflow simulated</span><span><b>03</b> Ready for access control</span></div><p><ShieldCheck size={14} /> Your file stays in this browser for this academic prototype.</p></aside>
                </section>
            )}
        </main>
    )
}

export default UploadFile
