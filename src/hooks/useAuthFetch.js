// Hook personalizado para hacer peticiones autenticadas
import { useState } from 'react';

// Función helper para leer sesión desde localStorage
const leerSesionLocal = () => {
  try {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return null;
    
    const parsedData = JSON.parse(sessionData);
    
    // Verificar si la sesión ha expirado
    if (Date.now() > parsedData.expiresAt) {
      localStorage.removeItem('userSession');
      return null;
    }
    
    return parsedData;
  } catch (error) {
    localStorage.removeItem('userSession');
    return null;
  }
};

// Función helper para hacer peticiones autenticadas
export const fetchWithAuth = async (url, options = {}) => {
  const sesionLocal = leerSesionLocal();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Usar token JWT para autenticación (funciona entre dominios)
  if (sesionLocal && sesionLocal.token) {
    headers['Authorization'] = `Bearer ${sesionLocal.token}`;
    console.log('Usando token JWT para petición:', url);
  } else {
    console.warn('No hay token disponible para petición:', url);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Si el token es inválido (401), limpiar sesión local
  if (response.status === 401) {
    console.log('Token inválido, limpiando sesión local');
    localStorage.removeItem('userSession');
    // Recargar página para mostrar login
    window.location.reload();
  }

  return response;
};

// Hook para manejar estados de carga y errores
export const useAuthFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const authFetch = async (url, options = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetchWithAuth(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error en la petición');
      }
      
      return response;
    } catch (err) {
      console.error('Error en authFetch:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    authFetch,
    loading,
    error,
    success,
    setError,
    setSuccess,
    clearMessages
  };
};

export default useAuthFetch;