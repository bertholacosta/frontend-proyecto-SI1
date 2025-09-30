import { useState, useEffect } from "react";

function NuevoCliente({ show, onClose, clienteEditando }) {
  const [cliente, setCliente] = useState({
    ci: "",
    nombre: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar datos del cliente cuando se abre para editar
  useEffect(() => {
    if (clienteEditando) {
      setCliente({
        ci: clienteEditando.ci || "",
        nombre: clienteEditando.nombre || "",
        telefono: clienteEditando.telefono || "",
        direccion: clienteEditando.direccion || "",
      });
    } else {
      setCliente({
        ci: "",
        nombre: "",
        telefono: "",
        direccion: "",
      });
    }
    setError("");
  }, [clienteEditando, show]);

  const handleChange = (e) =>
    setCliente({ ...cliente, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = clienteEditando 
        ? `http://localhost:3000/cliente/${clienteEditando.id}`
        : "http://localhost:3000/cliente";
      
      const method = clienteEditando ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ci: parseInt(cliente.ci),
          nombre: cliente.nombre,
          telefono: parseInt(cliente.telefono),
          direccion: cliente.direccion
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(clienteEditando ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
        onClose(); // cerrar modal desde el padre
      } else {
        setError(data.error || 'Error al guardar cliente');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; // si show es false, no renderiza nada

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          maxWidth: "90vw",
        }}
      >
        <h2>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
        
        {error && (
          <div style={{
            color: 'red',
            backgroundColor: '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              name="ci"
              placeholder="CI"
              value={cliente.ci}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              name="nombre"
              placeholder="Nombre completo"
              value={cliente.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              name="telefono"
              placeholder="Teléfono"
              value={cliente.telefono}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input
              name="direccion"
              placeholder="Dirección"
              value={cliente.direccion}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: loading ? '#ccc' : '#ff8c42',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoCliente;
