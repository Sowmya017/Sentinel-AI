'use strict';

// ── Load config first (validates env vars, exits if missing) ──────────────────
const config = require('./config');

const express = require('express');
const cors = require('cors');
const { seedMemories } = require('./scripts/seedMemories');

const chatRoute = require('./routes/chat');
const eventsRoute = require('./routes/events');
const telemetryRoute = require('./routes/telemetry');

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (config.cors.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin "${origin}" not allowed`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request Logger (dev-friendly) ────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/chat', chatRoute);
app.use('/api/events', eventsRoute);
app.use('/api/telemetry', telemetryRoute);

// ── Health Check ──────────────────────────────────────────────────────────────
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

// ── Root ──────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Sentinel-AI Backend API',
    version: '1.0.0',
    docs: 'See /docs/API.md for full documentation',
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

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'This endpoint does not exist.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  // Seed memories into Hindsight (non-blocking — server starts regardless)
  seedMemories().catch((err) => {
    console.warn('[server] Memory seeding encountered errors:', err.message);
  });

  app.listen(config.port, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║     SENTINEL-AI BACKEND — RUNNING          ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  Port    : ${String(config.port).padEnd(32)}║`);
    console.log(`║  Model   : ${config.groq.model.padEnd(32)}║`);
    console.log(`║  Bank    : ${config.hindsight.bankId.padEnd(32)}║`);
    console.log('╠════════════════════════════════════════════╣');
    console.log('║  Endpoints:                                ║');
    console.log(`║  GET  http://localhost:${config.port}/api/health      ║`);
    console.log(`║  POST http://localhost:${config.port}/api/chat        ║`);
    console.log(`║  GET  http://localhost:${config.port}/api/events/latest║`);
    console.log(`║  GET  http://localhost:${config.port}/api/telemetry/latest║`);
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
  });
}

start();
