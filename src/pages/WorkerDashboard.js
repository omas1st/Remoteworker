import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import './WorkerDashboard.css';
import { useNavigate } from 'react-router-dom';

export default function WorkerDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showMsgs, setShowMsgs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use Promise.all for parallel requests
      const [userResponse, tasksResponse, messagesResponse] = await Promise.all([
        api.get('/auth/me'),
        api.get('/tasks'),
        api.get('/users/messages')
      ]);
      
      setUser(userResponse.data);
      setTasks(tasksResponse.data);
      setMessages(messagesResponse.data);

      // Build progress
      const subs = tasksResponse.data.flatMap(task =>
        (task.submissions || [])
          .filter(s => s.user.toString() === userResponse.data._id)
          .map(s => ({ 
            title: task.title, 
            amount: task.amount, 
            status: s.status 
          }))
      );
      setProgress(subs);
    } catch (err) {
      console.error('Worker Dashboard Error:', err);
      setError('Failed to load dashboard data. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h2>Welcome, {user.firstName} {user.lastName}</h2>
          <p className="profile-type">Remote Worker</p>
        </div>
        
        <button 
          className={`msg-btn ${messages.length > 0 ? 'has-messages' : ''}`}
          onClick={() => setShowMsgs(!showMsgs)}
        >
          📨 {messages.length > 0 ? messages.length : ''}
        </button>
      </header>

      {showMsgs && (
        <div className="messages-panel">
          <div className="panel-header">
            <h3>Your Notifications</h3>
            <button className="close-btn" onClick={() => setShowMsgs(false)}>✕</button>
          </div>
          
          {messages.length === 0 ? (
            <p className="no-messages">No new notifications</p>
          ) : (
            <ul className="messages-list">
              {messages.map((m, i) => (
                <li key={i} className="message-item">
                  <div className="message-header">
                    <span className="message-sender">{m.from}</span>
                    <span className="message-time">
                      {new Date(m.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="message-content">{m.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="wallet-section">
        <div className="balance-card">
          <span className="balance-label">Wallet Balance:</span>
          <span className="balance-amount">${user.walletBalance.toFixed(2)}</span>
        </div>
        <button 
          className="withdraw-btn"
          onClick={handleWithdrawNav}
        >
          Withdraw Funds
        </button>
      </div>

      <div className="tasks-section">
        <h3>Available Tasks</h3>
        
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks available at the moment</p>
        ) : (
          <div className="task-grid">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <h4 className="task-title">{task.title}</h4>
                <p className="task-pay">Pay: ${task.amount}</p>
                <button 
                  className="task-button"
                  onClick={() => navigate(`/task/${task._id}`)}
                >
                  View Task Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="progress-section">
        <h3>Your Task Progress</h3>
        
        {progress.length === 0 ? (
          <p className="no-progress">You haven't started any tasks yet</p>
        ) : (
          <div className="progress-list">
            {progress.map((p, i) => (
              <div key={i} className="progress-item">
                <div className="progress-header">
                  <span className="task-name">{p.title}</span>
                  <span className="task-amount">${p.amount}</span>
                </div>
                <div className="progress-status">
                  Status: <span className={`status-${p.status}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}