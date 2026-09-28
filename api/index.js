'use strict';

const config = require('../config');
const express = require('express');
const cors = require('cors');

const chatRoute = require('../routes/chat');
const eventsRoute = require('../routes/events');
const telemetryRoute = require('../routes/telemetry');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/chat', chatRoute);
app.use('/api/events', eventsRoute);
app.use('/api/telemetry', telemetryRoute);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Sentinel-AI Backend',
    version: '1.0.0',
    model: config.groq.model,
    hindsightBank: config.hindsight.bankId,
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Sentinel-AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET  /api/health',
      chat: 'POST /api/chat',
      latestEvent: 'GET  /api/events/latest',
      allEvents: 'GET  /api/events',
      latestTelemetry: 'GET  /api/telemetry/latest',
      allTelemetry: 'GET  /api/telemetry',
    },
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'This endpoint does not exist.' });
});

app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;
