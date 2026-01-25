// Simple ingest server for debug instrumentation
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json({ limit: '1mb' }));

// Allow CORS from any origin for local debugging
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const LOG_PATH = path.join(process.cwd(), '.cursor', 'debug.log');

app.post('/ingest/:id', (req, res) => {
  try {
    const entry = Object.assign({}, req.body || {}, { timestamp: Date.now() });
    const line = JSON.stringify(entry) + '\n';
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(LOG_PATH, line, 'utf8');
    res.status(200).send('ok');
  } catch (err) {
    console.error(err);
    res.status(500).send('error');
  }
});

app.listen(7242, '127.0.0.1', () => {
  console.log('Ingest server running on http://127.0.0.1:7242');
});