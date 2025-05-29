import axios from 'axios';

// 1) Use the env var when available (your Vercel-deployed backend)
// 2) Otherwise default to localhost for local development
const baseURL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, '') // strip trailing slash
  : 'http://localhost:5000/api';

console.log('📡 API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  // If you ever switch to cookie-based auth, you can enable:
  // withCredentials: true
});

export default api;
