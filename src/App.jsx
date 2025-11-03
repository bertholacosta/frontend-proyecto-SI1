import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { PermissionProvider } from './contexts/PermissionContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  return (
    <PermissionProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </PermissionProvider>
  )
}

export default App
