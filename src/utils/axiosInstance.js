import axios from 'axios';

// Base URL from env or fallback
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create instance
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// If a token is already in localStorage, use it
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
