'use strict';

require('dotenv').config();

// ─── Required env vars ────────────────────────────────────────────────────────
const REQUIRED = [
  'GROQ_API_KEY',
  'HINDSIGHT_BASE_URL',
  'HINDSIGHT_API_KEY',
  'HINDSIGHT_BANK_ID',
];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[config] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[config] Copy .env.example to .env and fill in your values.');
  process.exit(1);
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  port: parseInt(process.env.PORT || '3001', 10),

  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'qwen/qwen3.8-27b',              // model locked per project spec
  },

  hindsight: {
    baseUrl: process.env.HINDSIGHT_BASE_URL,
    apiKey: process.env.HINDSIGHT_API_KEY,
    bankId: process.env.HINDSIGHT_BANK_ID,
  },

  cors: {
    // Allow a comma-separated list of origins, or default to localhost dev ports
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
      .split(',')
      .map((o) => o.trim()),
  },
};
