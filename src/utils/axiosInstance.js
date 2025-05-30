import axios from 'axios';

// Use environment variable for API URL
const baseURL = process.env.REACT_APP_API_URL || 'https://remoteworkerbackend.vercel.app/api';

// Create instance with timeout
const api = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds timeout
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  
  // Add cache-busting parameter
  config.params = {
    ...config.params,
    _: Date.now()
  };
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = 'Network error. Please check your connection.';
    
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      errorMessage = error.response.data?.message || 
                    `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else {
        errorMessage = 'No response from server. Please try again later.';
      }
    }
    
    // Return consistent error format
    return Promise.reject({
      message: errorMessage,
      code: error.code,
      status: error.response?.status,
      response: error.response?.data
    });
  }
);

export default api;