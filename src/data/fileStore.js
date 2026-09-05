export const STORAGE_KEY = 'secureshare-demo-files'

function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileType(file) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const typeNames = {
        pdf: 'PDF Document',
        xlsx: 'Excel Spreadsheet',
        pptx: 'PowerPoint Presentation',
        zip: 'ZIP Archive',
        csv: 'CSV Dataset',
        doc: 'Word Document',
        docx: 'Word Document',
    }

    return typeNames[extension] || file.type || `${extension?.toUpperCase() || 'Document'} File`
}

export function createProtectedFile(file) {
    return {
        id: `uploaded-${Date.now()}`,
        name: file.name,
        type: getFileType(file),
        size: formatFileSize(file.size),
        uploadedAt: 'Just now',
        modifiedAt: 'Just now',
        owner: 'Alex Morgan',
        protectionStatus: 'Protected',
        shared: false,
        sharedWith: null,
        accessType: 'Private',
        downloads: 0,
    }
}
