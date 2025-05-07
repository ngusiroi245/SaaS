import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const tenantId = "tenant-abc"; // bạn có thể lấy từ login/token thực tế

  useEffect(() => {
    fetch(`${API_URL}/tasks`, {
      headers: { "x-tenant-id": tenantId }
    })
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const createTask = () => {
    fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-tenant-id": tenantId
      },
      body: JSON.stringify({ title })
    })
      .then(res => res.json())
      .then(newTask => setTasks([...tasks, newTask]));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Multi-Tenant Tasks</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={createTask}>Add Task</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
