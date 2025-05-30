import axios from 'axios';

// Base URL from env or fallback
const baseURL = process.env.REACT_APP_API_URL || 'https://remoteworkerbackend.vercel.app/api';

// Create instance
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // Send cookies with requests
});

// If a token is already in localStorage, use it
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;