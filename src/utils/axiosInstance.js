import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://remoteworkerbackend.vercel.app/api';

const api = axios.create({
  baseURL,
  timeout: 30000, // 30-second timeout
  headers: { 
    'Content-Type': 'application/json',
    'X-Timeout': '30000' 
  },
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle session timeouts
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT'
      });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Session keep-alive function
api.keepAlive = async () => {
  try {
    await api.get('/auth/keep-alive');
  } catch (err) {
    console.error('Keep-alive failed:', err);
  }
};

// Start session keep-alive interval
setInterval(() => {
  if (localStorage.getItem('token')) {
    api.keepAlive();
  }
}, 300000); // Every 5 minutes

export default api;