import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import './WorkerDashboard.css';
import { useNavigate } from 'react-router-dom';

export default function WorkerDashboard() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = error
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showMsgs, setShowMsgs] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const { data: u } = await api.get('/auth/me');
      setUser(u);

      const { data: t } = await api.get('/tasks');
      setTasks(t);

      // build progress - FIXED: convert ObjectId to string
      const subs = t.flatMap(task =>
        (task.submissions || [])
          .filter(s => s.user.toString() === u._id)
          .map(s => ({ 
            title: task.title, 
            amount: task.amount, 
            status: s.status 
          }))
      );
      setProgress(subs);

      // fetch messages
      const { data: msgs } = await api.get('/users/messages');
      setMessages(msgs);
    } catch (err) {
      console.error('Session error:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetry = () => {
    // Clear invalid token and reload
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (user === undefined) {
    return <div className="dashboard-loading">Loading...</div>;
  }
  
  if (user === null) {
    return (
      <div className="session-error">
        <p>Session expired or not authenticated.</p>
        <button onClick={handleRetry}>Retry</button>
        <p>Or <a href="/login">login again</a></p>
      </div>
    );
  }

  const handleWithdrawNav = () => {
    // Check minimum balance
    if (user.walletBalance < 200) {
      return alert('Minimum withdrawal is $200');
    }
    // Check 7-day requirement
    const registeredDate = new Date(user.registeredAt);
    const now = new Date();
    const diffMs = now - registeredDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 7) {
      return alert('You can only withdraw after 7 days of registration');
    }
    // Passed checks
    navigate('/withdraw');
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
          {messages.length === 0 ? <p>No messages.</p> : (
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
            <button onClick={() => navigate(`/task/${task._id}`)}>
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