// frontend/src/pages/admin/WalletPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import './WalletPage.css';

export default function WalletPage() {
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState('');
  const navigate = useNavigate();

  // Verify admin token on mount
  useEffect(() => {
    api.get('/admin/users')
      .catch(() => {
        // if unauthorized, redirect to admin login
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      // Call protected admin endpoint
      await api.post('/admin/wallet', { email, balance: Number(balance) });
      alert('Balance updated successfully');
      setEmail('');
      setBalance('');
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        alert(err.response?.data?.message || 'Update failed');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Wallet Balance</h2>
      <form onSubmit={handleUpdate}>
        <label>User Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>New Balance ($)</label>
        <input
          type="number"
          value={balance}
          onChange={e => setBalance(e.target.value)}
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
