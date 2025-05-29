import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './Login.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}