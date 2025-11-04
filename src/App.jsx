import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { PermissionProvider } from './contexts/PermissionContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  )

  // Escuchar cambios en el localStorage
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true')
    }

    // Verificar autenticación al cargar
    checkAuth()

    // Escuchar evento personalizado de login
    window.addEventListener('storage', checkAuth)
    window.addEventListener('loginSuccess', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('loginSuccess', checkAuth)
    }
  }, [])

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
