// frontend/src/pages/admin/PaymentURLPage.js
import React, { useState } from 'react';
import api from '../../utils/axiosInstance';
import './PaymentURLPage.css';

export default function PaymentURLPage() {
  const [email, setEmail] = useState('');
  const [urls, setUrls] = useState(
    Array.from({ length: 10 }, (_, i) => ({ slot: i + 1, url: '', approved: false }))
  );

  const handleSearch = async () => {
    try {
      const res = await api.get(`/admin/payment-url?email=${encodeURIComponent(email)}`);
      const returned = res.data;
      // merge into default slots
      setUrls(urls.map(slotObj => {
        const found = returned.find(r => r.slot === slotObj.slot);
        return found ? found : slotObj;
      }));
    } catch {
      alert('User not found or no URLs set');
    }
  };

  const handleChange = (idx, field, value) => {
    const copy = [...urls];
    copy[idx][field] = value;
    setUrls(copy);
  };

  const handleSave = async slotObj => {
    try {
      await api.post('/admin/payment-url', {
        email,
        slot: slotObj.slot,
        url: slotObj.url,
        approved: slotObj.approved
      });
      alert(`Slot ${slotObj.slot} saved`);
    } catch {
      alert('Failed to save');
    }
  };

  return (
    <div className="payment-url-page">
      <h2>Payment URLs</h2>
      <div className="search-row">
        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleSearch}>Load</button>
      </div>
      <div className="slots">
        {urls.map((u, i) => (
          <div key={i} className="slot-row">
            <label>Slot {u.slot}:</label>
            <input
              type="text"
              value={u.url}
              onChange={e => handleChange(i, 'url', e.target.value)}
              placeholder="External URL"
            />
            <button onClick={() => handleChange(i, 'approved', true)}>Approve</button>
            <button onClick={() => handleChange(i, 'approved', false)}>Disapprove</button>
            <button onClick={() => handleSave(u)}>Save</button>
          </div>
        ))}
      </div>
    </div>
  );
}
