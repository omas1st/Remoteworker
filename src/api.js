// frontend/src/api.js
import axios from 'axios';

// In production, point to https://remoteworkerbackend.vercel.app/ (no /api here).
// In development, use whatever REACT_APP_API_URL is (which should be http://localhost:5000).
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://localhost:5000/'
    : process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export default api;
