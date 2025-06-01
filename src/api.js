// frontend/src/api.js
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://rjbbackend.vercel.app/api'
    : process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export default api;
