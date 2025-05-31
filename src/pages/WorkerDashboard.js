// frontend/src/pages/WorkerDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import './WorkerDashboard.css';

export default function WorkerDashboard() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = unauthenticated
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showMsgs, setShowMsgs] = useState(false);

  const loadData = async () => {
    try {
      // Fetch current user
      const { data: u } = await api.get('/auth/me');
      setUser(u);

      // Fetch tasks
      const { data: t } = await api.get('/tasks');
      setTasks(t);

      // Build task progress for this user
      const subs = t.flatMap(task =>
        (task.submissions || [])
          .filter(s => s.user === u._id)
          .map(s => ({ title: task.title, amount: task.amount, status: s.status }))
      );
      setProgress(subs);

      // Fetch inbox messages
      const { data: msgs } = await api.get('/users/messages');
      setMessages(msgs);
    } catch (err) {
      // Any error (including 401) => treat as unauthenticated
      setUser(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Loading state
  if (user === undefined) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  // Unauthenticated => redirect to login
  if (user === null) {
    window.location.href = '/login';
    return null;
  }

  // Authenticated => render dashboard
  const handleWithdrawNav = () => {
    if (user.walletBalance < 200) {
      return alert('Minimum withdrawal is $200');
    }
    const registeredDate = new Date(user.registeredAt);
    const now = new Date();
    const diffDays = (now - registeredDate) / (1000 * 60 * 60 * 24);
    if (diffDays < 7) {
      return alert('You can only withdraw after 7 days of registration');
    }
    window.location.href = '/withdraw';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Welcome, {user.firstName} {user.lastName}</h2>
        <button className="msg-btn" onClick={() => setShowMsgs(!showMsgs)}>
          📨 {messages.length}
        </button>
      </header>

      {showMsgs && (
        <div className="messages-panel">
          <h3>Your Notifications</h3>
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
        </div>
      )}

      <p>Wallet Balance: ${user.walletBalance.toFixed(2)}</p>
      <button onClick={handleWithdrawNav}>Withdraw</button>

      <h3>Available Tasks</h3>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className="job-card">
            <h4>{task.title}</h4>
            <p>Pay: ${task.amount}</p>
            <button onClick={() => window.location.href = `/task/${task._id}`}>
              Go to Task
            </button>
          </div>
        ))}
      </div>

      <h3>Task Progress</h3>
      {progress.length === 0 ? (
        <p>No tasks started yet.</p>
      ) : (
        <ul className="progress-list">
          {progress.map((p, i) => (
            <li key={i}>
              {p.title} — ${p.amount} — <strong>{p.status}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
