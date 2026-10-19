import axios from 'axios';

export function getApiBaseUrl() {
  const rawUrl = import.meta.env.VITE_API_URL;
  if (!rawUrl) return '/api/v1';
  const clean = rawUrl.replace(/\/+$/, '');
  return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Send cookies on every request
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token from localStorage as Bearer header
// (for future Flutter compatibility; cookie is primary for web)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
