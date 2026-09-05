import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import AppShell from './layouts/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import MyFiles from './pages/MyFiles.jsx'
import UploadFile from './pages/UploadFile.jsx'
import RoutePlaceholder from './pages/RoutePlaceholder.jsx'
import './App.css'

const routes = [
  { path: '/', label: 'Landing Page' },
  { path: '/login', label: 'Login Page' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/files', label: 'My Files' },
  { path: '/upload', label: 'Upload File' },
  { path: '/shared', label: 'Shared Files' },
  { path: '/access', label: 'Secure Access' },
  { path: '/settings', label: 'Settings' },
]

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/files" element={<AppLayout><MyFiles /></AppLayout>} />
          <Route path="/upload" element={<AppLayout><UploadFile /></AppLayout>} />
          {routes
            .filter(({ path }) => !['/', '/login', '/dashboard', '/files', '/upload'].includes(path))
            .map(({ path, label }) => (
              <Route key={path} path={path} element={<AppLayout><RoutePlaceholder label={label} /></AppLayout>} />
            ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
