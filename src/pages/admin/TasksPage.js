import React, { useEffect, useState } from 'react';
import api from '../../utils/axiosInstance';
import './TasksPage.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', amount:'', externalUrl:'' });

  useEffect(() => {
    api.get('/admin/tasks').then(res=>setTasks(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/admin/tasks', form);
    setForm({ title:'', description:'', amount:'', externalUrl:'' });
    setTasks(await api.get('/admin/tasks').then(r=>r.data));
  };

  const handleDelete = async id => {
    await api.delete(`/admin/tasks/${id}`);
    setTasks(tasks.filter(t=>t._id!==id));
  };

  return (
    <div className="admin-page">
      <h2>Manage Tasks</h2>
      <form onSubmit={handleAdd} className="task-form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <input name="externalUrl" placeholder="External URL" value={form.externalUrl} onChange={handleChange} required />
        <button type="submit">Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map(t=>(
          <li key={t._id}>
            {t.title} — ${t.amount}
            <button onClick={()=>handleDelete(t._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
