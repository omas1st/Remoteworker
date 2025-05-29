// frontend/src/pages/admin/VerifyWithdrawalAdmin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import './VerifyWithdrawalAdmin.css';

export default function VerifyWithdrawalAdmin() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  // ensure still logged in as admin
  useEffect(() => {
    api.get('/admin/users')
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleSet = async e => {
    e.preventDefault();
    try {
      await api.post('/admin/verify-pin', { email, pin });
      alert('PIN set successfully');
      setEmail(''); setPin('');
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Session expired—please log in again.');
        return navigate('/admin/login');
      }
      alert(err.response?.data?.message || 'Failed to set PIN');
    }
  };

  return (
    <div className="form-container">
      <h2>Set Withdrawal Verify PIN</h2>
      <form onSubmit={handleSet}>
        <label>User Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>5-digit PIN</label>
        <input
          type="text"
          value={pin}
          onChange={e => setPin(e.target.value)}
          maxLength={5}
          required
        />
        <button type="submit">Set PIN</button>
      </form>
    </div>
  );
}
