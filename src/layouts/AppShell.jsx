import { FileDataProvider } from '../data/FileDataContext.jsx'

function AppShell({ children }) {
    return <FileDataProvider><div className="app-shell">{children}</div></FileDataProvider>
}

export default AppShell