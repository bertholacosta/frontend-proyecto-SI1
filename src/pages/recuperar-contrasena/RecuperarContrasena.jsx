import { useState } from 'react';
import './RecuperarContrasena.css';

/**
 * Componente para recuperar contraseña
 * El usuario debe proporcionar su nombre de usuario y correo electrónico
 */
const RecuperarContrasena = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch('http://localhost:3000/auth/recuperar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({
          tipo: 'success',
          texto: data.message || 'Se ha enviado una nueva contraseña a tu correo electrónico.'
        });
        // Limpiar formulario
        setFormData({ usuario: '', email: '' });
      } else if (response.status === 423) {
        setMensaje({
          tipo: 'warning',
          texto: data.message || 'Tu cuenta está bloqueada temporalmente.'
        });
      } else {
        setMensaje({
          tipo: 'error',
          texto: data.message || data.error || 'Error al procesar la solicitud.'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({
        tipo: 'error',
        texto: 'Error de conexión. Por favor intenta más tarde.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-contrasena-container">
      <div className="recuperar-contrasena-card">
        <div className="recuperar-header">
          <h2>¿Olvidaste tu contraseña?</h2>
          <p>Ingresa tu usuario y correo electrónico para recibir una nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="recuperar-form">
          <div className="form-group">
            <label htmlFor="usuario">
              <i className="icon-user"></i> Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Ingresa tu nombre de usuario"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="icon-email"></i> Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {mensaje.texto && (
            <div className={`mensaje mensaje-${mensaje.tipo}`}>
              {mensaje.tipo === 'success' && '✅ '}
              {mensaje.tipo === 'error' && '❌ '}
              {mensaje.tipo === 'warning' && '⚠️ '}
              {mensaje.texto}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-recuperar"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              'Recuperar Contraseña'
            )}
          </button>

          <div className="recuperar-footer">
            <a href="/login" className="link-volver">
              ← Volver al inicio de sesión
            </a>
          </div>
        </form>

        <div className="info-box">
          <h4>📧 Importante:</h4>
          <ul>
            <li>Recibirás un correo con tu nueva contraseña temporal</li>
            <li>Revisa tu bandeja de entrada y spam</li>
            <li>La contraseña es generada automáticamente por seguridad</li>
            <li>Se recomienda cambiarla después de iniciar sesión</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
