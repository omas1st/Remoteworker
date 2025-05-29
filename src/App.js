// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ContactUs from './pages/ContactUs';

import WorkerDashboard from './pages/WorkerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Withdraw from './pages/Withdraw';
import VerifyWithdrawal from './pages/VerifyWithdrawal';
import AccountInsurance from './pages/AccountInsurance';
import TaskPage from './pages/TaskPage';

import AdminLogin from './pages/AdminLogin';          // ← added
import AdminPanel from './pages/AdminPanel';
import UsersProfile from './pages/admin/UsersProfile';
import MessagePage from './pages/admin/MessagePage';
import WalletPage from './pages/admin/WalletPage';
import VerifyWithdrawalAdmin from './pages/admin/VerifyWithdrawalAdmin';
import TasksPage from './pages/admin/TasksPage';
import PaymentURLPage from './pages/admin/PaymentURLPage';
import TaskPaymentApproval from './pages/admin/TaskPaymentApproval';
import StartTaskPage from './pages/admin/StartTaskPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact-us" element={<ContactUs />} />

        {/* Worker */}
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/verify-withdrawal" element={<VerifyWithdrawal />} />
        <Route path="/account-insurance" element={<AccountInsurance />} />
        <Route path="/task/:id" element={<TaskPage />} />

        {/* Customer */}
        <Route path="/customer" element={<CustomerDashboard />} />

        {/* Admin authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />         {/* ← added */}

        {/* Admin (protected) */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/users" element={<UsersProfile />} />
        <Route path="/admin/messages" element={<MessagePage />} />
        <Route path="/admin/wallet" element={<WalletPage />} />
        <Route path="/admin/verify-pin" element={<VerifyWithdrawalAdmin />} />
        <Route path="/admin/tasks" element={<TasksPage />} />
        <Route path="/admin/payment-urls" element={<PaymentURLPage />} />
        <Route path="/admin/approve-tasks" element={<TaskPaymentApproval />} />
        <Route path="/admin/start-task-urls" element={<StartTaskPage />} />
      </Routes>
    </BrowserRouter>
  );
}
