import React, { useState } from 'react';
import api from '../utils/axiosInstance';
import './ResetPassword.css';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirm) return alert('Passwords do not match');
    try {
      await api.post('/users/reset-password', { email, phone, newPassword });
      alert('Password reset successful. Please login.');
    } catch (err) {
      alert(err.response?.data?.msg || 'Reset failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Registered Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Phone Number</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} required />
        <label>New Password</label>
        <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
        <label>Confirm New Password</label>
        <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
