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
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { useEffect } from "react";
import { useState } from "react";
import NuevoCliente from "./archivoventanaprueba";

function Clientes() {
  // Datos de ejemplo

  const [clientes, setClientes] = useState([]); // estado accesible en todo el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/cliente", {
        method: "GET",
        credentials: "include", // MUY IMPORTANTE para cookies
      });
      const data = await res.json();
      if (data.success) {
        setClientes(data.data);
      } else {
        console.error("Error del servidor:", data.error);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };
// Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  // Función para eliminar cliente
  const eliminarCliente = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        const res = await fetch(`http://localhost:3000/cliente/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          alert('Cliente eliminado exitosamente');
          cargarClientes(); // Recargar la lista
        } else {
          alert('Error al eliminar cliente: ' + data.error);
        }
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert('Error de conexión al eliminar cliente');
      }
    }
  };

  // Función para abrir modal de edición
  const editarCliente = (cliente) => {
    setClienteEditando(cliente);
    setShowModal(true);
  };

  // Función para cerrar modal y limpiar estado
  const cerrarModal = () => {
    setShowModal(false);
    setClienteEditando(null);
    cargarClientes(); // Recargar lista después de crear/editar
  };
   
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Gestión de Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: "#ff8c42" }}
          onClick={() => setShowModal(true)}
        >
          Nuevo Cliente
        </Button>
      </Box>
      
      <NuevoCliente 
        show={showModal} 
        onClose={cerrarModal}
        clienteEditando={clienteEditando}
      />

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>CI</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">
                      No hay clientes registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id} hover>
                    <TableCell>{cliente.ci}</TableCell>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.direccion}</TableCell>
                    <TableCell>
                      <Chip
                        label="Activo"
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => editarCliente(cliente)}
                        title="Editar cliente"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => eliminarCliente(cliente.id)}
                        title="Eliminar cliente"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Clientes;
