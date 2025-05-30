import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { io } from 'socket.io-client';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    // Session keep-alive on admin panel
    const sessionTimer = setInterval(() => {
      api.keepAlive();
    }, 4 * 60 * 1000); // Every 4 minutes
    
    // Verify admin token
    const verifySession = async () => {
      try {
        await api.get('/admin/users');
      } catch (err) {
        navigate('/admin/login');
      }
    };
    
    verifySession();

    // Listen for real-time updates
    const socket = io(process.env.REACT_APP_API_URL || 'https://remoteworkerbackend.vercel.app', {
      timeout: 30000
    });
    
    socket.on('adminNotification', data => {
      console.log('Admin notification:', data);
    });
    
    return () => {
      clearInterval(sessionTimer);
      socket.disconnect();
    };
  }, [navigate]);

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      <nav className="admin-nav">
        <Link to="/admin/users">Users Profile</Link>
        <Link to="/admin/messages">Send Messages</Link>
        <Link to="/admin/wallet">Edit Wallet</Link>
        <Link to="/admin/verify-pin">Verify Withdrawal PIN</Link>
        <Link to="/admin/tasks">Manage Tasks</Link>
        <Link to="/admin/payment-urls">Payment URLs</Link>
        <Link to="/admin/approve-tasks">Approve Task Payments</Link>
        <Link to="/admin/start-task-urls">Start Task URLs</Link>
      </nav>
    </div>
  );
}