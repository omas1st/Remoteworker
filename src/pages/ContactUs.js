import React, { useState } from 'react';
import api from '../utils/axiosInstance';
import './ContactUs.css';

export default function ContactUs() {
  const [message, setMessage] = useState('');

  const handleSend = async e => {
    e.preventDefault();
    try {
      await api.post('/users/contact', { message });
      alert('Message sent!');
      setMessage('');
    } catch {
      alert('Send failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSend}>
        <label>Your Message</label>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
