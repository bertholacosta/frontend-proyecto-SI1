// Utilidad simple para peticiones autenticadas
const leerSesionLocal = () => {
  try {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return null;
    
    const parsedData = JSON.parse(sessionData);
    
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

import { apiUrl } from './apiConfig';

// Función simple para fetch autenticado (acepta rutas relativas o URLs absolutas)
export const fetchAuth = async (url, options = {}) => {
  const sesion = leerSesionLocal();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (sesion && sesion.token) {
    headers['Authorization'] = `Bearer ${sesion.token}`;
  }

  const response = await fetch(apiUrl(url), {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('userSession');
    window.location.reload();
  }

  return response;
};

export default fetchAuth;