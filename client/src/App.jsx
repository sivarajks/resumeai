import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ResumeProvider } from './context/ResumeContext'
import Navbar from './components/layout/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResumeForm from './pages/ResumeForm'
import TemplateSelect from './pages/TemplateSelect'
import JobMatch from './pages/JobMatch'
import ResumePreview from './pages/ResumePreview'

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? <Navigate to="/dashboard" replace /> : children
}

const HIDE_NAV = ['/login', '/register']

function Layout() {
  const location = useLocation()
  const showNav = !HIDE_NAV.includes(location.pathname)
  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/resume-form" element={<ProtectedRoute><ResumeForm /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><TemplateSelect /></ProtectedRoute>} />
        <Route path="/job-match" element={<ProtectedRoute><JobMatch /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <Layout />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: { borderRadius: '12px', fontSize: '14px', fontWeight: '500' },
              success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
            }}
          />
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

