// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-renacer.onrender.com';

export const apiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${suffix}`;
};

export default API_BASE_URL;