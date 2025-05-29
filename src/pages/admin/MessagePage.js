import React, { useState } from 'react';
import api from '../../utils/axiosInstance';
import './MessagePage.css';

export default function MessagePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSend = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('email', email);
    data.append('message', message);
    if (file) data.append('file', file);
    await api.post('/admin/message', data);
    alert('Sent');
  };

  return (
    <div className="form-container">
      <h2>Send Message</h2>
      <form onSubmit={handleSend} encType="multipart/form-data">
        <label>User Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Message</label>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} required />
        <label>Attach File</label>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
