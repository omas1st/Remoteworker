import axios from 'axios';

// Make sure this matches exactly your deployed backend URL:
const baseURL = process.env.REACT_APP_API_URL || 'https://remoteworker-nine.vercel.app/api';

const api = axios.create({
  baseURL,
  timeout: 20000, // 20s to cover slower cold starts
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  // cache-bust
  config.params = { ...config.params, _: Date.now() };
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    let message = 'Network error. Please check your connection.';
    if (error.response) {
      message = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please try again.';
    } else if (error.request) {
      message = 'No response from server. Please try again later.';
    }
    return Promise.reject({ message, code: error.code, status: error.response?.status, response: error.response?.data });
  }
);

export default api;
