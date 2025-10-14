import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete, Search, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchAuth } from '../utils/fetchAuth';

function Clientes() {
  // Estados
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para paginación
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  
  // Estados para formularios
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
    telefono: '',
    direccion: ''
  });

  // Cargar clientes con paginación
  const fetchClientes = async (currentPage = page, currentRowsPerPage = rowsPerPage) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentRowsPerPage.toString(),
        sortBy,
        sortOrder
      });

      const res = await fetchAuth(`https://api-renacer.onrender.com/clientes?${params}`, {
        method: "GET"
      });
      
      if (res.ok) {
        const data = await res.json();
        setClientes(data.clientes || []);
        setTotalPages(data.pagination?.totalPages || 0);
        setTotalClientes(data.pagination?.totalClientes || 0);
        setIsSearching(false);
      } else {
        throw new Error('Error al obtener clientes');
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes con paginación
  const searchClientes = async (currentPage = 1) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setPage(1);
      fetchClientes(1, rowsPerPage);
      return;
    }
    
    try {
      setLoading(true);
      setIsSearching(true);
      const params = new URLSearchParams({
        q: searchTerm,
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
        sortBy,
        sortOrder
      });

      const res = await fetchAuth(`https://api-renacer.onrender.com/clientes/search?${params}`, {
        method: "GET"
      });
      
      if (res.ok) {
        const data = await res.json();
        setClientes(data.clientes || []);
        setTotalPages(data.pagination?.totalPages || 0);
        setTotalClientes(data.pagination?.totalResults || 0);
        setPage(currentPage);
      } else {
        throw new Error('Error en la búsqueda');
      }
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  // Crear cliente
  const createCliente = async () => {
    try {
      const res = await fetchAuth("https://api-renacer.onrender.com/clientes", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        setSuccess('Cliente creado exitosamente');
        setShowCreateModal(false);
        resetForm();
        refreshData();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear cliente');
      }
    } catch (error) {
      console.error("Error al crear cliente:", error);
      setError(error.message);
    }
  };

  // Actualizar cliente
  const updateCliente = async () => {
    try {
      const res = await fetchAuth(`https://api-renacer.onrender.com/clientes/${selectedCliente.ci}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          direccion: formData.direccion
        })
      });
      
      if (res.ok) {
        setSuccess('Cliente actualizado exitosamente');
        setShowEditModal(false);
        resetForm();
        refreshData();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar cliente');
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      setError(error.message);
    }
  };

  // Eliminar cliente
  const deleteCliente = async () => {
    try {
      const res = await fetchAuth(`https://api-renacer.onrender.com/clientes/${selectedCliente.ci}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        setSuccess('Cliente eliminado exitosamente');
        setShowDeleteModal(false);
        refreshData();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar cliente');
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setError(error.message);
    }
  };

  // Funciones auxiliares
  const resetForm = () => {
    setFormData({
      ci: '',
      nombre: '',
      telefono: '',
      direccion: ''
    });
    setSelectedCliente(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openEditModal = (cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      ci: cliente.ci,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    });
    setShowEditModal(true);
  };

  const openViewModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowViewModal(true);
  };

  const openDeleteModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowDeleteModal(true);
  };

  // Manejar cambio de página
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (isSearching) {
      searchClientes(newPage);
    } else {
      fetchClientes(newPage, rowsPerPage);
    }
  };

  // Manejar cambio de filas por página
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    if (isSearching) {
      searchClientes(1);
    } else {
      fetchClientes(1, newRowsPerPage);
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setPage(1);
    fetchClientes(1, rowsPerPage);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Refrescar datos después de operaciones CRUD
  const refreshData = () => {
    if (isSearching) {
      searchClientes(page);
    } else {
      fetchClientes(page, rowsPerPage);
    }
  };
   
  return (
  <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1, sm: 2 }, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3
        }}
      >
        <Typography variant="h5">Gestión de Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: "#ff8c42" }}
          onClick={() => setShowCreateModal(true)}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* Controles de búsqueda y paginación */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sm={7}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar cliente por CI, nombre, teléfono o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchClientes()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => searchClientes(1)}
                      sx={{ backgroundColor: "#ff8c42" }}
                    >
                      Buscar
                    </Button>
                    {isSearching && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={clearSearch}
                      >
                        Limpiar
                      </Button>
                    )}
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{ mb: { xs: 1, sm: 0 } }}
          />
        </Grid>
  <Grid item xs={12} md={4} sm={5}>
          <FormControl fullWidth size="small">
            <InputLabel>Filas por página</InputLabel>
            <Select
              value={rowsPerPage}
              label="Filas por página"
              onChange={handleRowsPerPageChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Información de resultados */}
  <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {isSearching ? (
            `Mostrando ${clientes.length} de ${totalClientes} resultados para "${searchTerm}"`
          ) : (
            `Mostrando ${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, totalClientes)} de ${totalClientes} clientes`
          )}
        </Typography>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        )}
      </Box>

      {/* Tabla de clientes */}
  <Paper sx={{ width: "100%", overflowX: "auto", boxShadow: { xs: 0, sm: 1 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: { xs: 340, sm: 440 } }}>
            <Table size="small" stickyHeader>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ minWidth: 80 }}>CI</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Nombre</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Teléfono</TableCell>
                  <TableCell sx={{ minWidth: 140 }}>Dirección</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.ci} hover>
                      <TableCell>{cliente.ci}</TableCell>
                      <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cliente.nombre}</TableCell>
                      <TableCell sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cliente.telefono}</TableCell>
                      <TableCell sx={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cliente.direccion}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          <IconButton 
                            color="info" 
                            size="small"
                            onClick={() => openViewModal(cliente)}
                            title="Ver detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => openEditModal(cliente)}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => openDeleteModal(cliente)}
                            title="Eliminar"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Paginación inferior */}
        {totalPages > 1 && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              siblingCount={window.innerWidth < 600 ? 0 : 1}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
            />
          </Box>
        )}
      </Paper>

      {/* Modal Crear Cliente */}
      <Dialog 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="ci"
              label="Cédula de Identidad"
              type="number"
              value={formData.ci}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="nombre"
              label="Nombre Completo"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="telefono"
              label="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="direccion"
              label="Dirección"
              value={formData.direccion}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowCreateModal(false); resetForm(); }}>
            Cancelar
          </Button>
          <Button 
            onClick={createCliente}
            variant="contained"
            sx={{ backgroundColor: "#ff8c42" }}
          >
            Crear Cliente
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Editar Cliente */}
      <Dialog 
        open={showEditModal} 
        onClose={() => setShowEditModal(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="ci"
              label="Cédula de Identidad"
              value={formData.ci}
              fullWidth
              disabled
            />
            <TextField
              name="nombre"
              label="Nombre Completo"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="telefono"
              label="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="direccion"
              label="Dirección"
              value={formData.direccion}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowEditModal(false); resetForm(); }}>
            Cancelar
          </Button>
          <Button 
            onClick={updateCliente}
            variant="contained"
            sx={{ backgroundColor: "#ff8c42" }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Ver Cliente */}
      <Dialog 
        open={showViewModal} 
        onClose={() => setShowViewModal(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Detalles del Cliente</DialogTitle>
        <DialogContent>
          {selectedCliente && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Cédula de Identidad"
                value={selectedCliente.ci}
                fullWidth
                disabled
              />
              <TextField
                label="Nombre Completo"
                value={selectedCliente.nombre}
                fullWidth
                disabled
              />
              <TextField
                label="Teléfono"
                value={selectedCliente.telefono}
                fullWidth
                disabled
              />
              <TextField
                label="Dirección"
                value={selectedCliente.direccion}
                fullWidth
                multiline
                rows={2}
                disabled
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewModal(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Eliminar Cliente */}
      <Dialog 
        open={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar al cliente{' '}
            <strong>{selectedCliente?.nombre}</strong> (CI: {selectedCliente?.ci})?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={deleteCliente}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars para mensajes */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
      >
        <Alert 
          onClose={() => setSuccess('')} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Clientes;
