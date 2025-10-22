// Servicio de autenticación que maneja cookies y localStorage
// Útil para dispositivos móviles (iOS Safari) donde las cookies pueden fallar

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Guarda el token en localStorage (fallback para iOS)
 */
export const saveToken = (token) => {
  if (token) {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log('✅ Token guardado en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar token:', error);
    }
  }
};

/**
 * Obtiene el token de localStorage
 */
export const getToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('❌ Error al leer token:', error);
    return null;
  }
};

/**
 * Elimina el token de localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    console.log('✅ Token eliminado de localStorage');
  } catch (error) {
    console.error('❌ Error al eliminar token:', error);
  }
};

/**
 * Verifica si hay un token guardado
 */
export const hasToken = () => {
  return !!getToken();
};

/**
 * Crea los headers de autorización con el token
 * Útil para peticiones que requieren autenticación
 */
export const getAuthHeaders = () => {
  const token = getToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};

/**
 * Verifica si el usuario está autenticado
 * Intenta usar cookies primero, luego localStorage
 */
export const isAuthenticated = async (apiBase) => {
  try {
    // Intentar primero con cookies (preferido)
    const res = await fetch(`${apiBase}/auth/verificar`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log('✅ Autenticado con cookies');
      return { authenticated: true, data };
    }

    // Si falla, intentar con token de localStorage
    const token = getToken();
    if (token) {
      const resWithToken = await fetch(`${apiBase}/auth/verificar`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resWithToken.ok) {
        const data = await resWithToken.json();
        console.log('✅ Autenticado con token de localStorage');
        return { authenticated: true, data };
      }
    }

    console.log('❌ No autenticado');
    return { authenticated: false, data: null };
  } catch (error) {
    console.error('❌ Error al verificar autenticación:', error);
    return { authenticated: false, data: null };
  }
};

export default {
  saveToken,
  getToken,
  removeToken,
  hasToken,
  getAuthHeaders,
  isAuthenticated
};
