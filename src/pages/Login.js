import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email: email.toLowerCase(), password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      if (user.profileType === 'worker') navigate('/worker');
      else if (user.profileType === 'customer') navigate('/customer');
      else navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ECONNABORTED') alert('Request timed out. Please try again.');
      else alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <div className="form-footer">
        <a href="/reset-password">Forgot Password?</a>
        <a href="/register">Register</a>
      </div>
    </div>
  );
}
