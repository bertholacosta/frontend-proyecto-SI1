import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Divider
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Badge as BadgeIcon,
  ManageAccounts as ManageAccountsIcon,
  DirectionsBike as BikeIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from '@mui/icons-material'

// Importar componentes de las páginas
import Dashboard from './main/dashboard'
import Clientes from './main/clientes'
import Empleados from './main/empleados'
import Usuarios from './main/usuarios'
import Configuracion from './main/configuracion'

import './App.css'

// Tema personalizado con colores naranja y negro
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff8c42',
      light: '#ff6b1a',
      dark: '#e55a00',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#000000',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h3: {
      fontWeight: 'bold',
      fontSize: '3rem',
    },
    h6: {
      fontWeight: 300,
      fontSize: '1.2rem',
    },
  },
})

// Componente DashboardPrincipal
function DashboardPrincipal({ onLogout, userInfo }) {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState('dashboard')

  // Definir todos los elementos del menú
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, adminOnly: false },
    { id: 'clientes', label: 'Clientes', icon: <PeopleIcon />, adminOnly: false },
    { id: 'empleados', label: 'Empleados', icon: <BadgeIcon />, adminOnly: true },
    { id: 'usuarios', label: 'Usuarios', icon: <ManageAccountsIcon />, adminOnly: true },
   // { id: 'motos', label: 'Motos', icon: <BikeIcon />, adminOnly: false },
   // { id: 'servicios', label: 'Servicios', icon: <BuildIcon />, adminOnly: false },
   // { id: 'inventario', label: 'Inventario', icon: <InventoryIcon />, adminOnly: false },
    //{ id: 'facturas', label: 'Facturas', icon: <ReceiptIcon />, adminOnly: false },
    { id: 'configuracion', label: 'Configuración', icon: <SettingsIcon />, adminOnly: false },
  ]

  // Filtrar elementos del menú según el rol del usuario
  const menuItems = allMenuItems.filter(item => 
    !item.adminOnly || userInfo.isAdmin
  )



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Menú lateral */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? 250 : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              backgroundColor: '#1a1a1a',
              borderRight: '2px solid #ff8c42',
              overflowX: 'hidden',
            },
          }}
        >
          <Box sx={{ p: 2, backgroundColor: '#ff8c42' }}>
            <Typography variant="h6" color="white" fontWeight="bold">
              Multiservicio Renacer
            </Typography>
          </Box>
          
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={selectedItem === item.id}
                  onClick={() => setSelectedItem(item.id)}
                  sx={{
                    color: 'white',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 140, 66, 0.2)',
                      borderRight: '3px solid #ff8c42',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 140, 66, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ backgroundColor: '#ff8c42' }} />
          
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={onLogout}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 140, 66, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Contenido principal */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" sx={{ backgroundColor: '#2a2a2a' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {menuItems.find(item => item.id === selectedItem)?.label || 'Dashboard'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="inherit">
                  {userInfo.usuario}
                </Typography>
                {userInfo.isAdmin && (
                  <Box sx={{ 
                    backgroundColor: '#ff8c42', 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    ADMIN
                  </Box>
                )}
              </Box>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="xl">
              <Typography variant="h4" gutterBottom>
                Bienvenido al Sistema de Gestión
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Panel de control para Multiservicio Renacer - Taller de Motos
              </Typography>
              
              {/* Contenido dinámico según la sección seleccionada */}
              <Box sx={{ mt: 4 }}>
                {selectedItem === 'dashboard' && <Dashboard />}
                {selectedItem === 'clientes' && <Clientes />}
                {selectedItem === 'empleados' && <Empleados />}
                {selectedItem === 'usuarios' && <Usuarios />}
                {selectedItem === 'motos' && <Motos />}
                {selectedItem === 'servicios' && <Servicios />}
                {selectedItem === 'inventario' && <Inventario />}
                {selectedItem === 'facturas' && <Facturas />}
                {selectedItem === 'configuracion' && <Configuracion />}
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function App() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Para mostrar loading mientras verifica sesión
  const [userInfo, setUserInfo] = useState({
    usuario: '',
    email: '',
    isAdmin: false,
    empleado_ci: null
  })

  // Detectar si estamos en producción (Vercel) o desarrollo (localhost)
  const isProduction = window.location.hostname !== 'localhost'
  console.log('Entorno detectado:', isProduction ? 'Producción (Vercel)' : 'Desarrollo (localhost)')

  // Función para guardar sesión en localStorage como respaldo
  const guardarSesionLocal = (userData) => {
    try {
      const sessionData = {
        ...userData,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      };
      localStorage.setItem('userSession', JSON.stringify(sessionData));
      console.log('Sesión guardada en localStorage');
    } catch (error) {
      console.warn('Error al guardar sesión local:', error);
    }
  };

  // Función para leer sesión desde localStorage
  const leerSesionLocal = () => {
    try {
      const sessionData = localStorage.getItem('userSession');
      if (!sessionData) return null;
      
      const parsedData = JSON.parse(sessionData);
      
      // Verificar si la sesión ha expirado
      if (Date.now() > parsedData.expiresAt) {
        localStorage.removeItem('userSession');
        console.log('Sesión local expirada, removida');
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.warn('Error al leer sesión local:', error);
      localStorage.removeItem('userSession');
      return null;
    }
  };

  // Función para limpiar sesión local
  const limpiarSesionLocal = () => {
    try {
      localStorage.removeItem('userSession');
      console.log('Sesión local limpiada');
    } catch (error) {
      console.warn('Error al limpiar sesión local:', error);
    }
  };

  // Función helper para hacer peticiones autenticadas
  const fetchWithAuth = async (url, options = {}) => {
    const sesionLocal = leerSesionLocal();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Si hay token, usarlo; sino, confiar en las cookies
    if (sesionLocal && sesionLocal.token) {
      headers['Authorization'] = `Bearer ${sesionLocal.token}`;
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include' // Para cookies
    });
  };

  // Función helper para verificar conectividad básica con reintentos
  const verificarConectividad = async () => {
    // Primer intento rápido
    try {
      const response = await fetch('https://api-renacer.onrender.com/health', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) return true;
    } catch {}
    
    // Si falla, intentar con el endpoint de verificación directamente
    try {
      const response = await fetch('https://api-renacer.onrender.com/auth/verificar', {
        method: 'HEAD',
        credentials: 'include',
        signal: AbortSignal.timeout(10000) // Más tiempo para servidores dormidos
      });
      return response.status < 500; // Cualquier respuesta que no sea error de servidor
    } catch {
      return false;
    }
  };

  // Verificar sesión al cargar la página
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        console.log('Iniciando verificación de sesión...');
        
        // En producción (Vercel), priorizar cookies del servidor
        // En desarrollo (localhost), usar localStorage como principal
        if (!isProduction) {
          // Solo en desarrollo: verificar localStorage primero
          const sesionLocal = leerSesionLocal();
          if (sesionLocal) {
            console.log('Sesión encontrada en localStorage (desarrollo):', sesionLocal.usuario);
            setIsLoggedIn(true);
            setUsuario(sesionLocal.usuario);
            setUserInfo({
              usuario: sesionLocal.usuario,
              email: sesionLocal.email,
              isAdmin: sesionLocal.isAdmin,
              empleado_ci: sesionLocal.empleado_ci
            });
            setIsLoading(false);
            return; // Usar sesión local sin verificar servidor
          }
        }
        
        // Si no hay sesión local, verificar conectividad con servidor
        console.log('No hay sesión local, verificando con servidor...');
        const tieneConexion = await verificarConectividad();
        if (!tieneConexion) {
          console.log('Servidor no disponible - continuando sin sesión');
          setIsLoading(false);
          return;
        } else {
          console.log('Servidor disponible, procediendo con verificación de sesión');
        }
        
        // Las cookies httpOnly no son accesibles desde JavaScript
        // Siempre intentar verificar con el servidor
        
        // Crear un timeout para la verificación (ajustado según entorno)
        const controller = new AbortController();
        const timeoutMs = isProduction ? 15000 : 30000; // 15s en producción, 30s en desarrollo
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        // Intentar verificar con cookies primero, luego con token si hay uno guardado
        const sesionLocal = leerSesionLocal();
        const headers = { "Content-Type": "application/json" };
        
        // Si hay un token guardado, usarlo en la cabecera Authorization
        if (sesionLocal && sesionLocal.token) {
          headers['Authorization'] = `Bearer ${sesionLocal.token}`;
        }
        
        const res = await fetch("https://api-renacer.onrender.com/auth/verificar", {
          method: "GET",
          headers: headers,
          credentials: "include", // Importante para enviar cookies (si funcionan)
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUsuario(data.usuario);
          setUserInfo({
            usuario: data.usuario,
            email: data.email,
            isAdmin: data.isAdmin,
            empleado_ci: data.empleado_ci
          });
          // Guardar sesión en localStorage (siempre como respaldo, pero especialmente importante en desarrollo)
          guardarSesionLocal(data);
          console.log(`Sesión restaurada exitosamente en ${isProduction ? 'producción' : 'desarrollo'}:`, data.usuario, 'Admin:', data.isAdmin);
          console.log('Método de autenticación:', sesionLocal && sesionLocal.token ? 'Token JWT' : 'Cookies del servidor');
        } else {
          console.log('No hay sesión activa, código:', res.status);
          // Asegurar que el estado esté limpio
          setIsLoggedIn(false);
          setUsuario('');
          setUserInfo({
            usuario: '',
            email: '',
            isAdmin: false,
            empleado_ci: null
          });
        }
      } catch (error) {
        // Manejo completamente silencioso de errores de conectividad
        if (error.name === 'AbortError') {
          console.log('Verificación de sesión: timeout (normal)');
        } else {
          // No mostrar errores de conexión, solo log interno
          console.log('Verificación de sesión: sin conexión o servidor no disponible');
        }
        
        // Limpiar estado silenciosamente
        setIsLoggedIn(false);
        setUsuario('');
        setUserInfo({
          usuario: '',
          email: '',
          isAdmin: false,
          empleado_ci: null
        });
      } finally {
        console.log('Verificación de sesión completada');
        setIsLoading(false);
      }
    };

    verificarSesion();

    // Timeout de seguridad: ajustado según entorno
    const safetyTimeoutMs = isProduction ? 20000 : 35000; // 20s en producción, 35s en desarrollo
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.log(`Timeout de seguridad (${isProduction ? 'producción' : 'desarrollo'}): el servidor tardó demasiado en responder`);
        setIsLoading(false);
      }
    }, safetyTimeoutMs);

    return () => clearTimeout(safetyTimeout);
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const sesionLocal = leerSesionLocal();
      const headers = { "Content-Type": "application/json" };
      
      // Si hay un token, incluirlo en la cabecera
      if (sesionLocal && sesionLocal.token) {
        headers['Authorization'] = `Bearer ${sesionLocal.token}`;
      }
      
      await fetch("https://api-renacer.onrender.com/auth/logout", {
        method: "POST",
        headers: headers,
        credentials: "include", // Para cookies (si funcionan)
      });
      
      console.log('Logout enviado al servidor');
    } catch (error) {
      console.error("Error al cerrar sesión en servidor:", error);
    } finally {
      // SIEMPRE limpiar el estado local, independientemente del servidor
      setIsLoggedIn(false);
      setUsuario('');
      setPassword('');
      setUserInfo({
        usuario: '',
        email: '',
        isAdmin: false,
        empleado_ci: null
      });
      limpiarSesionLocal();
      console.log('Sesión cerrada localmente');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!usuario || !password) {
      setError('Debes ingresar usuario y contraseña')
      return
    }
    
    try {
      // Validación de credenciales
      const res = await fetch("https://api-renacer.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Para cookies (si funcionan)
        body: JSON.stringify({ usuario, contrasena: password })
      });
      
      if (res.ok) {
        const data = await res.json();
        setError('')
        setIsLoggedIn(true)
        setUserInfo({
          usuario: data.usuario,
          email: data.email,
          isAdmin: data.isAdmin,
          empleado_ci: data.empleado_ci
        });
        
        // Guardar toda la información incluyendo token si existe
        const sessionData = {
          ...data,
          token: data.token || null // Guardar token si el backend lo envía
        };
        guardarSesionLocal(sessionData);
        
        console.log('Login exitoso en', isProduction ? 'producción' : 'desarrollo', '- Admin:', data.isAdmin);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || 'Usuario o contraseña incorrectos')
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión. Intenta de nuevo.');
    }
  }

  // Mostrar loading mientras verifica sesión
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #ff8c42',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          mb: 2
        }} />
        <Typography variant="body1" color="text.secondary">
          Verificando sesión...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
          {window.location.hostname !== 'localhost' 
            ? 'Verificando sesión con el servidor (cookies + tokens)...' 
            : 'Si es la primera vez que accedes hoy, el servidor puede tardar unos segundos en responder'
          }
        </Typography>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Box>
    );
  }

  // Si está logueado, mostrar el dashboard
  if (isLoggedIn) {
    return <DashboardPrincipal onLogout={handleLogout} userInfo={userInfo} />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="login-container" sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Lado izquierdo */}
        <Box 
          className="left-side"
          sx={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b1a 50%, #e55a00 100%)',
          }}
        >
          {/* Contenedor de logo y letras en fila */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0, // espacio entre logo y letras
            zIndex: 1,
          }}>
            <img
              src="/logo.png"
              alt="Logo MR"
              style={{
                width: '400px',
                height: '400px',
                objectFit: 'contain',
                filter: 'brightness(1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            />
            <img
              src="/letras.png"
              alt="Multiservicio Renacer"
              style={{
                width: '450px',
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                marginLeft: '-200px',
              }}
            />
          </Box>

          {/* Decorativos circulares */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              animation: 'pulse 2s ease-in-out infinite 1s',
            }}
          />
        </Box>

        {/* Lado derecho */}
        <Box 
          className="right-side"
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/fondo.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.4,
              zIndex: 1,
            }}
          />

          <Container 
            maxWidth="sm" 
            sx={{ 
              position: 'relative', 
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              py: 4
            }}
          >
            <Paper
              elevation={20}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                width: '100%',
                maxWidth: 450,
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(15px)',
                borderRadius: 4,
                textAlign: 'center',
                border: '1px solid rgba(255, 140, 66, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography 
                variant="h3" 
                color="primary" 
                sx={{ 
                  mb: 1,
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
                  background: 'linear-gradient(45deg, #ff8c42, #ff6b1a)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Iniciar Sesión
              </Typography>

              <Typography 
                variant="body1" 
                color="rgba(255, 255, 255, 0.7)" 
                sx={{ mb: 4, fontSize: '1rem' }}
              >
                Accede a tu cuenta
              </Typography>

              {error && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                  }}
                >
                  <Typography 
                    color="error" 
                    sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Usuario"
                  variant="outlined"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 140, 66, 0.5)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 3,
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 500,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 140, 66, 0.5)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 3,
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 500,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #ff8c42, #ff6b1a)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff6b1a, #e55a00)',
                    },
                  }}
                >
                  INGRESAR
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', pt: 2 }}>
                <Link href="#" color="rgba(255, 255, 255, 0.7)" underline="hover" sx={{ fontSize: '0.9rem' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
                <Link href="#" color="rgba(255, 255, 255, 0.7)" underline="hover" sx={{ fontSize: '0.9rem' }}>
                  Crear cuenta nueva
                </Link>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
