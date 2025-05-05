const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware gán tenantId từ header
app.use((req, res, next) => {
  req.tenantId = req.headers['x-tenant-id'] || null;
  if (!req.tenantId) return res.status(400).send("Missing tenant ID");
  next();
});

// GET tất cả tasks cho tenant
app.get('/tasks', async (req, res) => {
  const result = await db.query('SELECT * FROM tasks WHERE tenant_id = $1', [req.tenantId]);
  res.json(result.rows);
});

// POST tạo task mới
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const result = await db.query(
    'INSERT INTO tasks (title, tenant_id) VALUES ($1, $2) RETURNING *',
    [title, req.tenantId]
  );
  res.status(201).json(result.rows[0]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
