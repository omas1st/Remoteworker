// frontend/src/utils/axiosInstance.js
import axios from 'axios';

// In production, use the deployed backend’s /api base.
// In development, fall back to REACT_APP_API_URL (http://localhost:5000/api).
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://rjbbackend.vercel.app/api'
    : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

// Auto-redirect to login on 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
