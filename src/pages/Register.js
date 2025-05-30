import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    profileType: 'worker',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    country: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Generic handler for all form fields
  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password match
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate length
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        profileType: form.profileType,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.toLowerCase(),
        phone: form.phone,
        gender: form.gender,
        country: form.country,
        password: form.password
      };

      const res = await api.post('/auth/register', payload);
      localStorage.setItem('token', res.data.token);

      // Redirect based on profile type
      if (form.profileType === 'worker') {
        navigate('/worker');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.status === 400) {
        setError(err.response?.message || 'Validation error');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Profile Type</label>
        <select
          name="profileType"
          value={form.profileType}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="worker">Remote Worker</option>
          <option value="customer">Customer</option>
        </select>

        <label>First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Gender</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Country</label>
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Password (min 6 characters)</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
          {loading ? (
            <>
              <span className="spinner"></span> Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <div className="form-footer">
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
