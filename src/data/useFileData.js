import { useContext } from 'react'
import FileDataContext from './fileContext.js'

export function useFileData() {
    const context = useContext(FileDataContext)
    if (!context) throw new Error('useFileData must be used inside FileDataProvider')
    return context
}
