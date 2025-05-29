// frontend/src/pages/admin/TaskPaymentApproval.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/axiosInstance';
import './TaskPaymentApproval.css';

export default function TaskPaymentApproval() {
  const [subs, setSubs] = useState([]);

  const fetchSubs = async () => {
    try {
      const res = await api.get('/admin/task-submissions');
      setSubs(res.data);
    } catch (err) {
      alert('Failed to load submissions');
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleApprove = async submissionId => {
    try {
      await api.post(`/admin/approve-submission/${submissionId}`);
      alert('Approved and wallet credited');
      fetchSubs(); // refresh list with updated approved statuses
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  return (
    <div className="task-approval">
      <h2>Approve Task Payments</h2>
      {subs.length === 0 ? (
        <p>No completed submissions.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Task</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.submissionId}>
                <td>{s.userName} ({s.userEmail})</td>
                <td>{s.taskTitle}</td>
                <td>${s.amount}</td>
                <td>
                  <button
                    onClick={() => handleApprove(s.submissionId)}
                    disabled={s.approved}
                  >
                    {s.approved ? 'Approved' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
