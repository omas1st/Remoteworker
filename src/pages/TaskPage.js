// frontend/src/pages/TaskPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';
import './TaskPage.css';

export default function TaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${id}`)
      .then(res => {
        setTask(res.data);
        const sub = res.data.submissions.find(s => s.user === res.data.userId);
        setSubmission(sub || null);
      })
      .catch(() => alert('Failed to load task'));
  }, [id]);

  const handleStart = async () => {
    try {
      await api.post(`/tasks/start/${id}`);
      setSubmission({ status: 'in-progress' });
      let url = task.externalUrl || '';
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      window.open(url, '_blank');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not start task');
    }
  };

  const handleAttempt = async () => {
    try {
      await api.post(`/tasks/attempt/${id}`);
      setSubmission({ status: 'completed' });
      alert('Task marked completed');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not record attempt');
    }
  };

  if (!task) return <div>Loading task...</div>;

  // find this user’s submission
  const mySub = task.submissions.find(s => s.user === task.userId) || submission;

  return (
    <div className="task-page">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Pay: ${task.amount}</p>

      <button
        onClick={handleStart}
        disabled={mySub != null}
      >
        {mySub ? 'Started' : 'Start Task'}
      </button>

      <button
        onClick={handleAttempt}
        disabled={!mySub || mySub.status === 'completed'}
      >
        {mySub?.status === 'completed' ? 'Completed' : 'Task Attempted'}
      </button>

      {mySub && (
        <small>Status: <strong>{mySub.status}</strong></small>
      )}
    </div>
  );
}
