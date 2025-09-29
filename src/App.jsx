import { useState } from 'react'
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
import Motos from './main/motos'
import Servicios from './main/servicios'
import Inventario from './main/inventario'
import Facturas from './main/facturas'
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
function DashboardPrincipal() {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'clientes', label: 'Clientes', icon: <PeopleIcon /> },
    { id: 'motos', label: 'Motos', icon: <BikeIcon /> },
    { id: 'servicios', label: 'Servicios', icon: <BuildIcon /> },
    { id: 'inventario', label: 'Inventario', icon: <InventoryIcon /> },
    { id: 'facturas', label: 'Facturas', icon: <ReceiptIcon /> },
    { id: 'configuracion', label: 'Configuración', icon: <SettingsIcon /> },
  ]
// cerrar sesion
  const handleLogout = async () => {
    try{
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // MUY IMPORTANTE para cookies
    });
    }catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };



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
                onClick={handleLogout}
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!usuario || !password) {
      setError('Debes ingresar usuario y contraseña')
      return
    }
    
    // Validación de credenciales
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // MUY IMPORTANTE para cookies
      body: JSON.stringify({ usuario, contrasena: password })
    });
    if (res.ok) {
      setError('')
      setIsLoggedIn(true)
      console.log('Login exitoso')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  // Si está logueado, mostrar el dashboard
  if (isLoggedIn) {
    return <DashboardPrincipal />
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
