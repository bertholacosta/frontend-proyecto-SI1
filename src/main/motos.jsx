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
  Chip
} from "@mui/material";
import { Add, Edit, Delete, Search, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchAuth } from "../utils/fetchAuth";

const API_BASE = "https://api-renacer.onrender.com";

function Motos() {
  const [motos, setMotos] = useState([]);
  const [marcaOptions, setMarcaOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMotos, setTotalMotos] = useState(0);
  const [sortBy, setSortBy] = useState("placa");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState(null);

  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    year: "",
    chasis: "",
    marca_id: ""
  });

  const loadMarcas = async () => {
    try {
      const res = await fetchAuth(`${API_BASE}/marcamoto`, { method: "GET" });
      if (!res.ok) throw new Error("No se pudieron cargar las marcas");
      const data = await res.json();
      setMarcaOptions(data.marcas || []);
    } catch (err) {
      console.error("Error al cargar marcas:", err);
    }
  };

  const fetchMotos = async (currentPage = page, currentRows = rowsPerPage) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentRows.toString(),
        sortBy,
        sortOrder
      });
      const res = await fetchAuth(`${API_BASE}/motos?${params}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error("Error al obtener motos");
      const data = await res.json();
      setMotos(data.motos || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalMotos(data.pagination?.totalMotos || 0);
      setIsSearching(false);
    } catch (err) {
      console.error("Error al obtener motos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchMotos = async (currentPage = 1) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setPage(1);
      fetchMotos(1, rowsPerPage);
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
      const res = await fetchAuth(`${API_BASE}/motos/search?${params}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error("Error al buscar motos");
      const data = await res.json();
      setMotos(data.motos || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalMotos(data.pagination?.totalResults || 0);
      setPage(currentPage);
    } catch (err) {
      console.error("Error al buscar motos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMoto = async () => {
    try {
      if (!formData.placa || !formData.modelo || !formData.year || !formData.marca_id) {
        setError("Completa placa, modelo, año y marca");
        return;
      }
      const payload = {
        ...formData,
        placa: formData.placa.toUpperCase().trim(),
        modelo: formData.modelo.trim(),
        year: Number(formData.year),
        chasis: formData.chasis ? formData.chasis.toUpperCase().trim() : null,
        marca_id: Number(formData.marca_id)
      };
      const res = await fetchAuth(`${API_BASE}/motos`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear moto");
      }
      setSuccess("Moto creada exitosamente");
      setShowCreateModal(false);
      resetForm();
      refreshData();
    } catch (err) {
      console.error("Error al crear moto:", err);
      setError(err.message);
    }
  };

  const updateMoto = async () => {
    if (!selectedMoto) return;
    try {
      if (!formData.modelo || !formData.year || !formData.marca_id) {
        setError("Completa modelo, año y marca");
        return;
      }
      const payload = {
        modelo: formData.modelo.trim(),
        year: Number(formData.year),
        chasis: formData.chasis ? formData.chasis.toUpperCase().trim() : null,
        marca_id: Number(formData.marca_id)
      };
      const res = await fetchAuth(`${API_BASE}/motos/${selectedMoto.placa}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al actualizar moto");
      }
      setSuccess("Moto actualizada exitosamente");
      setShowEditModal(false);
      resetForm();
      refreshData();
    } catch (err) {
      console.error("Error al actualizar moto:", err);
      setError(err.message);
    }
  };

  const deleteMoto = async () => {
    if (!selectedMoto) return;
    try {
      const res = await fetchAuth(`${API_BASE}/motos/${selectedMoto.placa}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al eliminar moto");
      }
      setSuccess("Moto eliminada exitosamente");
      setShowDeleteModal(false);
      refreshData();
    } catch (err) {
      console.error("Error al eliminar moto:", err);
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      placa: "",
      modelo: "",
      year: "",
      chasis: "",
      marca_id: ""
    });
    setSelectedMoto(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "placa" || name === "chasis" ? value.toUpperCase() : value
    }));
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (moto) => {
    setSelectedMoto(moto);
    setFormData({
      placa: moto.placa,
      modelo: moto.modelo || "",
      year: moto.year || "",
      chasis: moto.chasis || "",
      marca_id: moto.marca_id || ""
    });
    setShowEditModal(true);
  };

  const openViewModal = (moto) => {
    setSelectedMoto(moto);
    setShowViewModal(true);
  };

  const openDeleteModal = (moto) => {
    setSelectedMoto(moto);
    setShowDeleteModal(true);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    if (isSearching) {
      searchMotos(newPage);
    } else {
      fetchMotos(newPage, rowsPerPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(1);
    if (isSearching) {
      searchMotos(1);
    } else {
      fetchMotos(1, newRows);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setPage(1);
    fetchMotos(1, rowsPerPage);
  };

  const refreshData = () => {
    if (isSearching) {
      searchMotos(page);
    } else {
      fetchMotos(page, rowsPerPage);
    }
  };

  useEffect(() => {
    loadMarcas();
    fetchMotos();
  }, []);

  useEffect(() => {
    if (!showCreateModal && !showEditModal) return;
    if (marcaOptions.length === 0) {
      loadMarcas();
    }
  }, [showCreateModal, showEditModal]);

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1, sm: 2 }, width: "100%", maxWidth: "1200px", mx: "auto" }}>
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
        <Typography variant="h5">Gestión de Motos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: "#ff8c42" }}
          onClick={openCreateModal}
        >
          Nueva Moto
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sm={7}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar moto por placa, modelo, chasis, año o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchMotos()}
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
                      onClick={() => searchMotos(1)}
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
              )
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
          gap: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {isSearching
            ? `Mostrando ${motos.length} de ${totalMotos} resultados para "${searchTerm}"`
            : `Mostrando ${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, totalMotos)} de ${totalMotos} motos`}
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
        ) : motos.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {isSearching ? "No se encontraron motos para la búsqueda" : "No hay motos registradas"}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Placa</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell align="right">Año</TableCell>
                  <TableCell>Chasis</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {motos.map((moto) => (
                  <TableRow key={moto.placa} hover>
                    <TableCell>{moto.placa}</TableCell>
                    <TableCell>{moto.modelo}</TableCell>
                    <TableCell align="right">{moto.year}</TableCell>
                    <TableCell>{moto.chasis || "-"}</TableCell>
                    <TableCell>
                      {moto.marca_moto ? (
                        <Chip label={moto.marca_moto.nombre} size="small" sx={{ backgroundColor: "#ffe1cc" }} />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => openViewModal(moto)}>
                        <Visibility />
                      </IconButton>
                      <IconButton color="warning" onClick={() => openEditModal(moto)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => openDeleteModal(moto)}>
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

      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar moto</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Placa"
                name="placa"
                fullWidth
                value={formData.placa}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="marca-create-label">Marca</InputLabel>
                <Select
                  labelId="marca-create-label"
                  label="Marca"
                  name="marca_id"
                  value={formData.marca_id}
                  onChange={handleInputChange}
                >
                  {marcaOptions.map((marca) => (
                    <MenuItem key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Modelo"
                name="modelo"
                fullWidth
                value={formData.modelo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Año"
                name="year"
                type="number"
                fullWidth
                value={formData.year}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Chasis"
                name="chasis"
                fullWidth
                value={formData.chasis}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createMoto} sx={{ backgroundColor: "#ff8c42" }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar moto</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField label="Placa" fullWidth value={formData.placa} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Modelo"
                name="modelo"
                fullWidth
                value={formData.modelo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Año"
                name="year"
                type="number"
                fullWidth
                value={formData.year}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Chasis"
                name="chasis"
                fullWidth
                value={formData.chasis}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="marca-edit-label">Marca</InputLabel>
                <Select
                  labelId="marca-edit-label"
                  label="Marca"
                  name="marca_id"
                  value={formData.marca_id}
                  onChange={handleInputChange}
                >
                  {marcaOptions.map((marca) => (
                    <MenuItem key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={updateMoto} sx={{ backgroundColor: "#ff8c42" }}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Detalle de moto</DialogTitle>
        <DialogContent dividers>
          {selectedMoto && (
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography><strong>Placa:</strong> {selectedMoto.placa}</Typography>
              <Typography><strong>Modelo:</strong> {selectedMoto.modelo}</Typography>
              <Typography><strong>Año:</strong> {selectedMoto.year}</Typography>
              <Typography><strong>Chasis:</strong> {selectedMoto.chasis || "-"}</Typography>
              <Typography>
                <strong>Marca:</strong> {selectedMoto.marca_moto?.nombre || "-"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar moto</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Seguro que deseas eliminar la moto con placa {selectedMoto?.placa}? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={deleteMoto}>
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

export default Motos;
