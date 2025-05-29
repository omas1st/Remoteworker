import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './Register.css';
import countryList from 'react-select-country-list';

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
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCountries(countryList().getData());
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return alert('Passwords do not match');
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

      // Store JWT & set default header
      const token = res.data.token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on profileType
      if (form.profileType === 'worker') {
        navigate('/worker-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Profile Type</label>
        <select
          name="profileType"
          value={form.profileType}
          onChange={handleChange}
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
        />

        <label>Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Country</label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          required
        >
          <option value="">Select country</option>
          {countries.map(c => (
            <option key={c.value} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
