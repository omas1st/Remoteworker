import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password
      });

      const { token, user } = res.data;
      // Store token & set default header
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on profileType
      if (user.profileType === 'worker') {
        navigate('/worker');
      } else if (user.profileType === 'customer') {
        navigate('/customer');
      } else if (user.role === 'admin') {
        navigate('/admin/users');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
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
      <div className="form-footer">
        <Link to="/reset-password">Forgot Password?</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
