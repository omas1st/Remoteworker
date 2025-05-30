import axios from 'axios';

// Use environment variables
const baseURL = process.env.REACT_APP_API_URL || 'https://remoteworkerbackend.vercel.app/api';
const backendURL = process.env.REACT_APP_BACKEND_URL || 'https://remoteworkerbackend.vercel.app';

// Create instance
const api = axios.create({
  baseURL,
  headers: { 
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  
  // Add backend URL to all requests
  config.headers['X-Backend-URL'] = backendURL;
  
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      message: error.response?.data?.message || 'Network error',
      status: error.response?.status || 500
    });
  }
);

export default api;