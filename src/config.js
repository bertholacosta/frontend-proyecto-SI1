// Configuración centralizada de la aplicación

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const config = {
  apiUrl: API_URL,
  tokenKey: 'token',
  userEmailKey: 'userEmail',
  isAuthenticatedKey: 'isAuthenticated',
  tokenExpirationTime: 24 * 60 * 60 * 1000, // 24 horas
}

export default config
