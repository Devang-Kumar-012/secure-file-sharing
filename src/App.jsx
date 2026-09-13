import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { FilesProvider } from './context/FilesContext.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'

import Landing        from './pages/Landing.jsx'
import Login          from './pages/Login.jsx'
import Signup         from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword  from './pages/ResetPassword.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import MyFiles        from './pages/MyFiles.jsx'
import UploadFile     from './pages/UploadFile.jsx'
import Recent         from './pages/Recent.jsx'
import Storage        from './pages/Storage.jsx'
import SettingsPage   from './pages/SettingsPage.jsx'

import './App.css'

// AppLayout using render-props for pages that need searchQuery injected
function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* FilesProvider lives here so it persists across route changes
            and has access to AuthContext at all times */}
        <FilesProvider>
          <Routes>
            {/* Public */}
            <Route path="/"                element={<Landing />} />
            <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup"          element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password"  element={<ResetPassword />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedLayout><Dashboard /></ProtectedLayout>
            } />
            <Route path="/files" element={
              <ProtectedLayout>
                {(props) => <MyFiles {...props} />}
              </ProtectedLayout>
            } />
            <Route path="/upload" element={
              <ProtectedLayout><UploadFile /></ProtectedLayout>
            } />
            <Route path="/recent" element={
              <ProtectedLayout>
                {(props) => <Recent {...props} />}
              </ProtectedLayout>
            } />
            <Route path="/storage" element={
              <ProtectedLayout><Storage /></ProtectedLayout>
            } />
            <Route path="/settings" element={
              <ProtectedLayout><SettingsPage /></ProtectedLayout>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FilesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
