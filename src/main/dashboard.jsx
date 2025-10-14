import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material'
import { TrendingUp, People, DirectionsBike, Build, Inventory, Receipt } from '@mui/icons-material'
import { useEffect, useState } from 'react'

function Dashboard() {
  const [stats, setStats] = useState([
    { title: 'Clientes Activos', value: 'Cargando...', icon: <People />, color: '#ff8c42', loading: true },
  //  { title: 'Motos Registradas', value: '89', icon: <DirectionsBike />, color: '#4caf50' },
  //  { title: 'Servicios Pendientes', value: '23', icon: <Build />, color: '#2196f3' },
  //  { title: 'Repuestos en Stock', value: '342', icon: <Inventory />, color: '#9c27b0' },
  //  { title: 'Facturas del Mes', value: '45', icon: <Receipt />, color: '#f44336' },
  //  { title: 'Ingresos del Mes', value: '$12,450', icon: <TrendingUp />, color: '#4caf50' },
  ])

  // Cargar estadísticas desde la API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener total de clientes
        const clientesRes = await fetch('https://api-renacer.onrender.com/clientes?page=1&limit=1', {
          method: 'GET',
          credentials: 'include',
        })
        
        if (clientesRes.ok) {
          const clientesData = await clientesRes.json()
          const totalClientes = clientesData.pagination?.totalClientes || 0
          
          setStats(prevStats => 
            prevStats.map(stat => 
              stat.title === 'Clientes Activos' 
                ? { ...stat, value: totalClientes.toString(), loading: false }
                : stat
            )
          )
        } else {
          // En caso de error, mostrar 0
          setStats(prevStats => 
            prevStats.map(stat => 
              stat.title === 'Clientes Activos' 
                ? { ...stat, value: '0', loading: false }
                : stat
            )
          )
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
        // En caso de error, mostrar 0
        setStats(prevStats => 
          prevStats.map(stat => 
            stat.title === 'Clientes Activos' 
              ? { ...stat, value: '0', loading: false }
              : stat
          )
        )
      }
    }

    fetchStats()
  }, [])

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1, sm: 2 }, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: { xs: 'center', sm: 'left' } }}>
        Dashboard Principal
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              border: '1px solid #ddd',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { xs: 180, sm: 200 },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: stat.color,
                    color: 'white',
                    mr: 2,
                    minWidth: 40,
                    minHeight: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: { xs: 22, sm: 28 }
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" component="div" sx={{ fontSize: { xs: 16, sm: 20 } }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary" fontWeight="bold" sx={{ fontSize: { xs: 28, sm: 34 } }}>
                  {stat.loading ? (
                    <CircularProgress size={24} sx={{ color: stat.color }} />
                  ) : (
                    stat.value
                  )}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                <Button size="small" sx={{ color: stat.color, fontSize: { xs: 13, sm: 15 } }}>
                  Ver detalles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Dashboard
