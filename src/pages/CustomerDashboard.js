// frontend/src/pages/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);

  // Load profile & messages
  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));

    api.get('/users/messages')
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]));
  }, []);

  const handleSend = async e => {
    e.preventDefault();
    try {
      await api.post('/users/message-admin', { content });
      alert('Message sent to our sales team');
      setContent('');
      const res = await api.get('/users/messages');
      setMessages(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="customer-dashboard">
      <h2>Welcome, {user.firstName} {user.lastName}</h2>

      <section className="contact-sales">
        <h3>Contact Our Sales Team</h3>
        <form onSubmit={handleSend}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Your message"
            required
          />
          <button type="submit">Send</button>
        </form>
      </section>

      <section className="messages-section">
        <h3>Your Messages</h3>
        {messages.length === 0 ? (
          <p>No messages.</p>
        ) : (
          <ul>
            {messages.map((m, i) => (
              <li key={i}>
                <small>{new Date(m.date).toLocaleString()}</small>
                <p>{m.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
