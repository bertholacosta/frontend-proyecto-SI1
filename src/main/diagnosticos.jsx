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
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Search, Visibility, RemoveCircleOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchAuth } from "../utils/fetchAuth";

const API_BASE = "https://api-renacer.onrender.com";

const emptyForm = {
  fecha: "",
  hora: "",
  placa_moto: "",
  empleado_ci: "",
};

const emptyDetalle = () => ({ descripcion: "" });

const formatDateForInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
};

const formatTimeForInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().substring(11, 16);
  }
  if (typeof value === "string" && value.includes(":")) {
    return value.substring(0, 5);
  }
  return "";
};

const formatDateDisplay = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const formatTimeDisplay = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const nowDate = () => new Date().toISOString().split("T")[0];
const nowTime = () => new Date().toISOString().substring(11, 16);

function Diagnosticos() {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [motos, setMotos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDiagnosticos, setTotalDiagnosticos] = useState(0);
  const [sortBy, setSortBy] = useState("fecha");
  const [sortOrder, setSortOrder] = useState("desc");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDiagnostico, setSelectedDiagnostico] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [detalles, setDetalles] = useState([emptyDetalle()]);

  const fetchMotos = async () => {
    try {
      const params = new URLSearchParams({ limit: "100", sortBy: "placa", sortOrder: "asc" });
      const res = await fetchAuth(`${API_BASE}/motos?${params}`, { method: "GET" });
      if (!res.ok) throw new Error("No se pudieron cargar las motos");
      const data = await res.json();
      setMotos(data.motos || []);
    } catch (err) {
      console.error("Error al cargar motos:", err);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const params = new URLSearchParams({ limit: "100", sortBy: "nombre", sortOrder: "asc" });
      const res = await fetchAuth(`${API_BASE}/empleados?${params}`, { method: "GET" });
      if (!res.ok) throw new Error("No se pudieron cargar los empleados");
      const data = await res.json();
      setEmpleados(data.empleados || []);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
  };

  const fetchDiagnosticos = async (currentPage = page, currentRows = rowsPerPage) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentRows.toString(),
        sortBy,
        sortOrder,
      });
      const res = await fetchAuth(`${API_BASE}/diagnosticos?${params}`, { method: "GET" });
      if (!res.ok) throw new Error("Error al obtener diagnósticos");
      const data = await res.json();
      setDiagnosticos(data.diagnosticos || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalDiagnosticos(data.pagination?.totalDiagnosticos || 0);
      setIsSearching(false);
    } catch (err) {
      console.error("Error al obtener diagnósticos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchDiagnosticos = async (currentPage = 1) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setPage(1);
      fetchDiagnosticos(1, rowsPerPage);
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
      const res = await fetchAuth(`${API_BASE}/diagnosticos/search?${params}`, { method: "GET" });
      if (!res.ok) throw new Error("Error en la búsqueda de diagnósticos");
      const data = await res.json();
      setDiagnosticos(data.diagnosticos || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalDiagnosticos(data.pagination?.totalResults || 0);
      setPage(currentPage);
    } catch (err) {
      console.error("Error al buscar diagnósticos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDiagnostico = async () => {
    try {
      if (!formData.fecha || !formData.hora || !formData.placa_moto || !formData.empleado_ci) {
        setError("Completa fecha, hora, moto y empleado");
        return;
      }
      const detallesValidos = detalles
        .map((detalle) => ({ descripcion: detalle.descripcion.trim() }))
        .filter((detalle) => detalle.descripcion.length > 0);

      if (detallesValidos.length === 0) {
        setError("Añade al menos un detalle del diagnóstico");
        return;
      }

      const payload = {
        fecha: formData.fecha,
        hora: formData.hora,
        placa_moto: formData.placa_moto.trim().toUpperCase(),
        empleado_ci: Number(formData.empleado_ci),
        detalles: detallesValidos,
      };

      const res = await fetchAuth(`${API_BASE}/diagnosticos`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear diagnóstico");
      }

      setSuccess("Diagnóstico creado exitosamente");
      setShowCreateModal(false);
      resetForm();
      refreshData();
    } catch (err) {
      console.error("Error al crear diagnóstico:", err);
      setError(err.message);
    }
  };

  const updateDiagnostico = async () => {
    if (!selectedDiagnostico) return;
    try {
      const detallesValidos = detalles
        .map((detalle) => ({ descripcion: detalle.descripcion.trim() }))
        .filter((detalle) => detalle.descripcion.length > 0);

      if (detallesValidos.length === 0) {
        setError("Añade al menos un detalle del diagnóstico");
        return;
      }

      const payload = {
        fecha: formData.fecha,
        hora: formData.hora,
        placa_moto: formData.placa_moto.trim().toUpperCase(),
        empleado_ci: formData.empleado_ci ? Number(formData.empleado_ci) : undefined,
        detalles: detallesValidos,
      };

      const res = await fetchAuth(`${API_BASE}/diagnosticos/${selectedDiagnostico.nro}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al actualizar diagnóstico");
      }

      setSuccess("Diagnóstico actualizado exitosamente");
      setShowEditModal(false);
      resetForm();
      refreshData();
    } catch (err) {
      console.error("Error al actualizar diagnóstico:", err);
      setError(err.message);
    }
  };

  const deleteDiagnostico = async () => {
    if (!selectedDiagnostico) return;
    try {
      const res = await fetchAuth(`${API_BASE}/diagnosticos/${selectedDiagnostico.nro}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al eliminar diagnóstico");
      }
      setSuccess("Diagnóstico eliminado exitosamente");
      setShowDeleteModal(false);
      refreshData();
    } catch (err) {
      console.error("Error al eliminar diagnóstico:", err);
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setDetalles([emptyDetalle()]);
    setSelectedDiagnostico(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetalleChange = (index, value) => {
    setDetalles((prev) => {
      const copy = [...prev];
      copy[index] = { descripcion: value };
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
    setFormData({
      fecha: nowDate(),
      hora: nowTime(),
      placa_moto: "",
      empleado_ci: "",
    });
    setShowCreateModal(true);
  };

  const openEditModal = (diagnostico) => {
    setSelectedDiagnostico(diagnostico);
    setFormData({
      fecha: formatDateForInput(diagnostico.fecha),
      hora: formatTimeForInput(diagnostico.hora),
      placa_moto: diagnostico.placa_moto || "",
      empleado_ci: diagnostico.empleado_ci?.toString() || "",
    });
    setDetalles(
      diagnostico.detalle_diagnostico?.length
        ? diagnostico.detalle_diagnostico.map((detalle) => ({ descripcion: detalle.descripcion }))
        : [emptyDetalle()]
    );
    setShowEditModal(true);
  };

  const openViewModal = (diagnostico) => {
    setSelectedDiagnostico(diagnostico);
    setShowViewModal(true);
  };

  const openDeleteModal = (diagnostico) => {
    setSelectedDiagnostico(diagnostico);
    setShowDeleteModal(true);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    if (isSearching) {
      searchDiagnosticos(newPage);
    } else {
      fetchDiagnosticos(newPage, rowsPerPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(1);
    if (isSearching) {
      searchDiagnosticos(1);
    } else {
      fetchDiagnosticos(1, newRows);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setPage(1);
    fetchDiagnosticos(1, rowsPerPage);
  };

  const refreshData = () => {
    if (isSearching) {
      searchDiagnosticos(page);
    } else {
      fetchDiagnosticos(page, rowsPerPage);
    }
  };

  useEffect(() => {
    fetchMotos();
    fetchEmpleados();
    fetchDiagnosticos();
  }, []);

  useEffect(() => {
    if ((!showCreateModal && !showEditModal) || (motos.length && empleados.length)) return;
    fetchMotos();
    fetchEmpleados();
  }, [showCreateModal, showEditModal]);

  const motoDescripcion = (diagnostico) => {
    const moto = diagnostico.moto || motos.find((item) => item.placa === diagnostico.placa_moto);
    if (!moto) return diagnostico.placa_moto || "-";
    const marca = moto.marca_moto?.nombre ? ` (${moto.marca_moto.nombre})` : "";
    return `${moto.placa} - ${moto.modelo || ""}${marca}`.trim();
  };

  const empleadoNombre = (diagnostico) => {
    if (diagnostico.empleado?.nombre) return diagnostico.empleado.nombre;
    const empleado = empleados.find((item) => item.ci === diagnostico.empleado_ci);
    return empleado?.nombre || diagnostico.empleado_ci || "-";
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
        <Typography variant="h5">Gestión de Diagnósticos</Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: "#ff8c42" }} onClick={openCreateModal}>
          Nuevo Diagnóstico
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sm={7}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por placa, empleado, detalle o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchDiagnosticos()}
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
                      onClick={() => searchDiagnosticos(1)}
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
            ? `Mostrando ${diagnosticos.length} de ${totalDiagnosticos} resultados para "${searchTerm}"`
            : totalDiagnosticos === 0
            ? "No hay diagnósticos registrados"
            : `Mostrando ${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, totalDiagnosticos)} de ${totalDiagnosticos} diagnósticos`}
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
        ) : diagnosticos.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {isSearching ? "No se encontraron diagnósticos para la búsqueda" : "No hay diagnósticos registrados"}
            </Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nro</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Moto</TableCell>
                <TableCell>Empleado</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell align="center">Proforma</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diagnosticos.map((diagnostico) => (
                <TableRow key={diagnostico.nro} hover>
                  <TableCell>{diagnostico.nro}</TableCell>
                  <TableCell>{formatDateDisplay(diagnostico.fecha)}</TableCell>
                  <TableCell>{formatTimeDisplay(diagnostico.hora)}</TableCell>
                  <TableCell>{motoDescripcion(diagnostico)}</TableCell>
                  <TableCell>{empleadoNombre(diagnostico)}</TableCell>
                  <TableCell>{diagnostico.detalle_diagnostico?.length || 0}</TableCell>
                  <TableCell align="center">
                    {diagnostico.proforma ? (
                      <Chip
                        label={`Proforma #${diagnostico.proforma.id}`}
                        size="small"
                        sx={{ backgroundColor: "#c8e6c9" }}
                      />
                    ) : (
                      <Chip label="Sin proforma" size="small" sx={{ backgroundColor: "#ffe0b2" }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => openViewModal(diagnostico)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color="warning" onClick={() => openEditModal(diagnostico)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => openDeleteModal(diagnostico)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Registrar diagnóstico</DialogTitle>
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
              <TextField
                label="Hora"
                name="hora"
                type="time"
                fullWidth
                value={formData.hora}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Moto</InputLabel>
                <Select name="placa_moto" label="Moto" value={formData.placa_moto} onChange={handleInputChange}>
                  {motos.map((moto) => (
                    <MenuItem key={moto.placa} value={moto.placa}>
                      {moto.placa} - {moto.modelo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Empleado</InputLabel>
                <Select name="empleado_ci" label="Empleado" value={formData.empleado_ci} onChange={handleInputChange}>
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.ci} value={empleado.ci}>
                      {empleado.ci} - {empleado.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  <Grid item xs={12} md={11}>
                    <TextField
                      label="Descripción"
                      fullWidth
                      value={detalle.descripcion}
                      onChange={(e) => handleDetalleChange(index, e.target.value)}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createDiagnostico} sx={{ backgroundColor: "#ff8c42" }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Editar diagnóstico</DialogTitle>
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
              <TextField
                label="Hora"
                name="hora"
                type="time"
                fullWidth
                value={formData.hora}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Moto</InputLabel>
                <Select name="placa_moto" label="Moto" value={formData.placa_moto} onChange={handleInputChange}>
                  {motos.map((moto) => (
                    <MenuItem key={moto.placa} value={moto.placa}>
                      {moto.placa} - {moto.modelo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Empleado</InputLabel>
                <Select name="empleado_ci" label="Empleado" value={formData.empleado_ci} onChange={handleInputChange}>
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.ci} value={empleado.ci}>
                      {empleado.ci} - {empleado.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  <Grid item xs={12} md={11}>
                    <TextField
                      label="Descripción"
                      fullWidth
                      value={detalle.descripcion}
                      onChange={(e) => handleDetalleChange(index, e.target.value)}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={updateDiagnostico} sx={{ backgroundColor: "#ff8c42" }}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Detalle del diagnóstico</DialogTitle>
        <DialogContent dividers>
          {selectedDiagnostico && (
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography>
                <strong>Nro:</strong> {selectedDiagnostico.nro}
              </Typography>
              <Typography>
                <strong>Fecha:</strong> {formatDateDisplay(selectedDiagnostico.fecha)}
              </Typography>
              <Typography>
                <strong>Hora:</strong> {formatTimeDisplay(selectedDiagnostico.hora)}
              </Typography>
              <Typography>
                <strong>Moto:</strong> {motoDescripcion(selectedDiagnostico)}
              </Typography>
              <Typography>
                <strong>Empleado:</strong> {empleadoNombre(selectedDiagnostico)}
              </Typography>
              <Typography>
                <strong>Proforma vinculada:</strong> {selectedDiagnostico.proforma ? `#${selectedDiagnostico.proforma.id}` : "Sin proforma"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Detalles</Typography>
              {selectedDiagnostico.detalle_diagnostico?.length ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Descripción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDiagnostico.detalle_diagnostico.map((detalle, index) => (
                      <TableRow key={detalle.id || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{detalle.descripcion}</TableCell>
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
        <DialogTitle>Eliminar diagnóstico</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Seguro que deseas eliminar el diagnóstico #{selectedDiagnostico?.nro}? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={deleteDiagnostico}>
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

export default Diagnosticos;
