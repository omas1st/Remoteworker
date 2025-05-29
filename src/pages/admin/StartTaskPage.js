import React, { useEffect, useState } from 'react';
import api from '../../utils/axiosInstance';
import './StartTaskPage.css';

export default function StartTaskPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/admin/tasks').then(res=>setTasks(res.data));
  }, []);

  const handleChangeUrl = async (id, url) => {
    await api.post(`/admin/tasks/${id}/url`, { externalUrl: url });
    alert('URL updated');
  };

  return (
    <div className="admin-page">
      <h2>Change Task Redirect URLs</h2>
      {tasks.map(t=>(
        <div key={t._id} className="url-slot">
          <span>{t.title}</span>
          <input
            defaultValue={t.externalUrl}
            onBlur={e=>handleChangeUrl(t._id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
