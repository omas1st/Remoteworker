import React, { useState } from 'react';
import api from '../../utils/axiosInstance';
import './MessagePage.css';

export default function MessagePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async e => {
    e.preventDefault();
    await api.post('/admin/message', { email, message });
    alert('Message sent successfully');
  };

  return (
    <div className="form-container">
      <h2>Send Message</h2>
      <form onSubmit={handleSend}>
        <label>User Email</label>
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        
        <label>Message</label>
        <textarea 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          required 
        />
        
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}