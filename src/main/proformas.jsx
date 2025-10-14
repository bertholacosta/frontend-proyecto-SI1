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
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete, Search, Visibility, RemoveCircleOutline } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { fetchAuth } from "../utils/fetchAuth";

const API_BASE = "https://api-renacer.onrender.com";
const ESTADOS = ["PENDIENTE", "APROBADA", "ANULADA"];

const emptyForm = {
  fecha: "",
  estado: "PENDIENTE",
  cliente_ci: "",
  diagnostico_id: "",
  total: "",
};

const emptyDetalle = () => ({ descripcion: "", cantidad: "1", precio_unit: "0" });

function Proformas() {
  const [proformas, setProformas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProformas, setTotalProformas] = useState(0);
  const [sortBy, setSortBy] = useState("fecha");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSearching, setIsSearching] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProforma, setSelectedProforma] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [detalles, setDetalles] = useState([emptyDetalle()]);

  const detallesTotal = useMemo(() => {
    return detalles.reduce((acc, item) => {
      const cantidad = Number(item.cantidad);
      const precio = Number(item.precio_unit);
      if (!Number.isFinite(cantidad) || !Number.isFinite(precio)) return acc;
      return acc + cantidad * precio;
    }, 0);
  }, [detalles]);

  const totalVisual = formData.total !== "" ? Number(formData.total) : detallesTotal;

  const fetchClientes = async () => {
    try {
      const params = new URLSearchParams({ limit: "100", sortBy: "nombre", sortOrder: "asc" });
      const res = await fetchAuth(`${API_BASE}/clientes?${params}`, { method: "GET" });
      if (!res.ok) throw new Error("No se pudieron cargar los clientes");
      const data = await res.json();
      setClientes(data.clientes || []);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const fetchProformas = async (currentPage = page, currentRows = rowsPerPage) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentRows.toString(),
        sortBy,
        sortOrder,
      });
      const res = await fetchAuth(`${API_BASE}/proformas?${params}`, { method: "GET" });
      if (!res.ok) throw new Error("Error al obtener proformas");
      const data = await res.json();
      setProformas(data.proformas || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalProformas(data.pagination?.totalProformas || 0);
      setIsSearching(false);
    } catch (err) {
      console.error("Error al obtener proformas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchProformas = async (currentPage = 1) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setPage(1);
      fetchProformas(1, rowsPerPage);
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
        sortOrder,
      });
      const res = await fetchAuth(`${API_BASE}/proformas/search?${params}`, { method: "GET" });
      if (!res.ok) throw new Error("Error en la búsqueda de proformas");
      const data = await res.json();
      setProformas(data.proformas || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalProformas(data.pagination?.totalResults || 0);
      setPage(currentPage);
    } catch (err) {
      console.error("Error al buscar proformas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProforma = async () => {
    try {
      const payload = {
        ...formData,
        cliente_ci: formData.cliente_ci ? Number(formData.cliente_ci) : null,
        diagnostico_id: formData.diagnostico_id || null,
        total: formData.total !== "" ? Number(formData.total) : undefined,
        detalles: detalles
          .filter((detalle) => detalle.descripcion.trim())
          .map((detalle) => ({
            descripcion: detalle.descripcion,
            cantidad: Number(detalle.cantidad),
            precio_unit: Number(detalle.precio_unit),
          })),
      };

      if (!payload.cliente_ci) {
        throw new Error("Debe seleccionar un cliente");
      }

      if (!payload.fecha) {
        payload.fecha = new Date().toISOString();
      }

      const res = await fetchAuth(`${API_BASE}/proformas`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al crear proforma");
      }

      setSuccess("Proforma creada exitosamente");
      setShowCreateModal(false);
      resetForm();
      refreshData();
    } catch (err) {
      console.error("Error al crear proforma:", err);
      setError(err.message);
    }
  };

  const updateProforma = async () => {
    if (!selectedProforma) return;
    try {
      const payload = {
        ...formData,
        cliente_ci: formData.cliente_ci ? Number(formData.cliente_ci) : undefined,
        diagnostico_id:
          formData.diagnostico_id === "" ? null : formData.diagnostico_id,
        total: formData.total !== "" ? Number(formData.total) : undefined,
        detalles: detalles
          .filter((detalle) => detalle.descripcion.trim())
          .map((detalle) => ({
            descripcion: detalle.descripcion,
            cantidad: Number(detalle.cantidad),
            precio_unit: Number(detalle.precio_unit),
          })),
      };

      const res = await fetchAuth(`${API_BASE}/proformas/${selectedProforma.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al actualizar proforma");
      }

      setSuccess("Proforma actualizada exitosamente");
      setShowEditModal(false);
      resetForm();
      refreshData();
    } catch (err) {
      console.error("Error al actualizar proforma:", err);
      setError(err.message);
    }
  };

  const deleteProforma = async () => {
    if (!selectedProforma) return;
    try {
      const res = await fetchAuth(`${API_BASE}/proformas/${selectedProforma.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al eliminar proforma");
      }
      setSuccess("Proforma eliminada exitosamente");
      setShowDeleteModal(false);
      refreshData();
    } catch (err) {
      console.error("Error al eliminar proforma:", err);
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setDetalles([emptyDetalle()]);
    setSelectedProforma(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetalleChange = (index, field, value) => {
    setDetalles((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  const addDetalle = () => {
    setDetalles((prev) => [...prev, emptyDetalle()]);
  };

  const removeDetalle = (index) => {
    setDetalles((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (proforma) => {
    setSelectedProforma(proforma);
    setFormData({
      fecha: proforma.fecha ? proforma.fecha.split("T")[0] : "",
      estado: proforma.estado || "PENDIENTE",
      cliente_ci: proforma.cliente_ci?.toString() || proforma.cliente?.ci?.toString() || "",
      diagnostico_id: proforma.diagnostico_id ? proforma.diagnostico_id.toString() : "",
      total: "",
    });
    setDetalles(
      proforma.detalle_proforma?.length
        ? proforma.detalle_proforma.map((detalle) => ({
            descripcion: detalle.descripcion,
            cantidad: detalle.cantidad.toString(),
            precio_unit: detalle.precio_unit.toString(),
          }))
        : [emptyDetalle()]
    );
    setShowEditModal(true);
  };

  const openViewModal = (proforma) => {
    setSelectedProforma(proforma);
    setShowViewModal(true);
  };

  const openDeleteModal = (proforma) => {
    setSelectedProforma(proforma);
    setShowDeleteModal(true);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    if (isSearching) {
      searchProformas(newPage);
    } else {
      fetchProformas(newPage, rowsPerPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(1);
    if (isSearching) {
      searchProformas(1);
    } else {
      fetchProformas(1, newRows);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setPage(1);
    fetchProformas(1, rowsPerPage);
  };

  const refreshData = () => {
    if (isSearching) {
      searchProformas(page);
    } else {
      fetchProformas(page, rowsPerPage);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchProformas();
  }, []);

  const clienteNombre = (proforma) => {
    if (proforma.cliente?.nombre) return proforma.cliente.nombre;
    const cliente = clientes.find((c) => c.ci === proforma.cliente_ci);
    return cliente?.nombre || "-";
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1, sm: 2 }, width: "100%", maxWidth: "1200px", mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5">Gestión de Proformas</Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: "#ff8c42" }} onClick={openCreateModal}>
          Nueva Proforma
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sm={7}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por cliente, estado, ID o detalle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchProformas()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => searchProformas(1)}
                      sx={{ backgroundColor: "#ff8c42" }}
                    >
                      Buscar
                    </Button>
                    {isSearching && (
                      <Button variant="outlined" size="small" onClick={clearSearch}>
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
            <Select value={rowsPerPage} label="Filas por página" onChange={handleRowsPerPageChange}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {isSearching
            ? `Mostrando ${proformas.length} de ${totalProformas} resultados para "${searchTerm}"`
            : `Mostrando ${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, totalProformas)} de ${totalProformas} proformas`}
        </Typography>
        {totalPages > 1 && (
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="small" />
        )}
      </Box>

      <Paper sx={{ width: "100%", overflowX: "auto", boxShadow: { xs: 0, sm: 1 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : proformas.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {isSearching ? "No se encontraron proformas para la búsqueda" : "No hay proformas registradas"}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proformas.map((proforma) => (
                  <TableRow key={proforma.id} hover>
                    <TableCell>{proforma.id}</TableCell>
                    <TableCell>
                      {proforma.fecha ? new Date(proforma.fecha).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{clienteNombre(proforma)}</TableCell>
                    <TableCell>
                      <Chip
                        label={proforma.estado}
                        size="small"
                        sx={{
                          backgroundColor:
                            proforma.estado === "APROBADA"
                              ? "#c8e6c9"
                              : proforma.estado === "ANULADA"
                              ? "#ffcdd2"
                              : "#ffe0b2",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {Number(proforma.total || 0).toLocaleString(undefined, {
                        style: "currency",
                        currency: "BOB",
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => openViewModal(proforma)}>
                        <Visibility />
                      </IconButton>
                      <IconButton color="warning" onClick={() => openEditModal(proforma)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => openDeleteModal(proforma)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Registrar proforma</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                fullWidth
                value={formData.fecha}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select name="estado" label="Estado" value={formData.estado} onChange={handleInputChange}>
                  {ESTADOS.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  name="cliente_ci"
                  label="Cliente"
                  value={formData.cliente_ci}
                  onChange={handleInputChange}
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.ci} value={cliente.ci}>
                      {cliente.ci} - {cliente.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Diagnóstico (opcional)"
                name="diagnostico_id"
                fullWidth
                value={formData.diagnostico_id}
                onChange={handleInputChange}
                placeholder="ID del diagnóstico"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total (opcional)"
                name="total"
                fullWidth
                value={formData.total}
                onChange={handleInputChange}
                helperText="Si se deja vacío se calculará automáticamente con los detalles"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Detalles
          </Typography>

          <Stack spacing={2}>
            {detalles.map((detalle, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Descripción"
                      fullWidth
                      value={detalle.descripcion}
                      onChange={(e) => handleDetalleChange(index, "descripcion", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Cantidad"
                      fullWidth
                      value={detalle.cantidad}
                      onChange={(e) => handleDetalleChange(index, "cantidad", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Precio unitario"
                      fullWidth
                      value={detalle.precio_unit}
                      onChange={(e) => handleDetalleChange(index, "precio_unit", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={1} sx={{ textAlign: "center" }}>
                    <IconButton color="error" onClick={() => removeDetalle(index)}>
                      <RemoveCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" onClick={addDetalle}>
              Añadir detalle
            </Button>
            <Typography variant="subtitle1">
              Total estimado: {Number(totalVisual).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createProforma} sx={{ backgroundColor: "#ff8c42" }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Editar proforma</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                fullWidth
                value={formData.fecha}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select name="estado" label="Estado" value={formData.estado} onChange={handleInputChange}>
                  {ESTADOS.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  name="cliente_ci"
                  label="Cliente"
                  value={formData.cliente_ci}
                  onChange={handleInputChange}
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.ci} value={cliente.ci}>
                      {cliente.ci} - {cliente.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Diagnóstico (opcional)"
                name="diagnostico_id"
                fullWidth
                value={formData.diagnostico_id}
                onChange={handleInputChange}
                placeholder="ID del diagnóstico"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total (opcional)"
                name="total"
                fullWidth
                value={formData.total}
                onChange={handleInputChange}
                helperText="Si se deja vacío se recalculará con los detalles"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Detalles
          </Typography>

          <Stack spacing={2}>
            {detalles.map((detalle, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Descripción"
                      fullWidth
                      value={detalle.descripcion}
                      onChange={(e) => handleDetalleChange(index, "descripcion", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Cantidad"
                      fullWidth
                      value={detalle.cantidad}
                      onChange={(e) => handleDetalleChange(index, "cantidad", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Precio unitario"
                      fullWidth
                      value={detalle.precio_unit}
                      onChange={(e) => handleDetalleChange(index, "precio_unit", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={1} sx={{ textAlign: "center" }}>
                    <IconButton color="error" onClick={() => removeDetalle(index)}>
                      <RemoveCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" onClick={addDetalle}>
              Añadir detalle
            </Button>
            <Typography variant="subtitle1">
              Total estimado: {Number(totalVisual).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={updateProforma} sx={{ backgroundColor: "#ff8c42" }}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Detalle de proforma</DialogTitle>
        <DialogContent dividers>
          {selectedProforma && (
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography>
                <strong>ID:</strong> {selectedProforma.id}
              </Typography>
              <Typography>
                <strong>Fecha:</strong> {selectedProforma.fecha ? new Date(selectedProforma.fecha).toLocaleDateString() : "-"}
              </Typography>
              <Typography>
                <strong>Cliente:</strong> {clienteNombre(selectedProforma)}
              </Typography>
              <Typography>
                <strong>Estado:</strong> {selectedProforma.estado}
              </Typography>
              <Typography>
                <strong>Diagnóstico:</strong> {selectedProforma.diagnostico_id || "-"}
              </Typography>
              <Typography>
                <strong>Total:</strong> {Number(selectedProforma.total || 0).toLocaleString(undefined, {
                  style: "currency",
                  currency: "BOB",
                  minimumFractionDigits: 2,
                })}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Detalles</Typography>
              {selectedProforma.detalle_proforma?.length ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Precio unitario</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProforma.detalle_proforma.map((detalle) => (
                      <TableRow key={detalle.id}>
                        <TableCell>{detalle.descripcion}</TableCell>
                        <TableCell align="right">{Number(detalle.cantidad).toLocaleString()}</TableCell>
                        <TableCell align="right">{Number(detalle.precio_unit).toFixed(2)}</TableCell>
                        <TableCell align="right">{Number(detalle.subtotal).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin detalles registrados.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar proforma</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Seguro que deseas eliminar la proforma #{selectedProforma?.id}? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={deleteProforma}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={5000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess("")} severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Proformas;
