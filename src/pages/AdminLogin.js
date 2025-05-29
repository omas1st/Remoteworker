// frontend/src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';  // ← use api instance, not axios directly
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async e => {
    e.preventDefault();
    try {
      // Calls http://localhost:5000/api/admin/auth/login
      const res = await api.post('/admin/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err.response || err);
      alert(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleAdminLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}
