import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes placeholder
app.get('/api/public/cpf', (req, res) => {
  res.json({ error: 'CPF endpoint' });
});

app.post('/api/public/pix', (req, res) => {
  res.json({ error: 'PIX endpoint' });
});

// Serve SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

export default app;
