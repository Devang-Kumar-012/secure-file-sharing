import { useCallback, useEffect, useState } from 'react'
import { mockFiles } from './mockData.js'
import FileDataContext from './fileContext.js'
import { createProtectedFile, STORAGE_KEY } from './fileStore.js'

function getInitialFiles() {
    if (typeof window === 'undefined') return mockFiles

    try {
        const storedFiles = window.localStorage.getItem(STORAGE_KEY)
        return storedFiles ? JSON.parse(storedFiles) : mockFiles
    } catch {
        return mockFiles
    }
}

function FileDataProvider({ children }) {
    const [files, setFiles] = useState(getInitialFiles)

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
        } catch {
            return undefined
        }
    }, [files])

    const addFile = useCallback((file) => {
        const protectedFile = createProtectedFile(file)
        setFiles((currentFiles) => [protectedFile, ...currentFiles])
        return protectedFile
    }, [])

    return <FileDataContext.Provider value={{ files, addFile }}>{children}</FileDataContext.Provider>
}

export { FileDataProvider }
