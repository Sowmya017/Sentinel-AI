'use strict';

const express = require('express');
const TELEMETRY_EVENTS = require('../data/Live Telemetry Stream.json');

const router = express.Router();

/**
 * @route  GET /api/telemetry/latest
 * @desc   Returns the next telemetry event from the simulated live telemetry stream.
 *         The list cycles endlessly. Use `?index=N` to jump to a specific event.
 * @access Public
 */
router.get('/latest', (req, res) => {
  try {
    const total = TELEMETRY_EVENTS.length;

    let rawIndex = parseInt(req.query.index, 10);
    if (isNaN(rawIndex) || rawIndex < 0) {
      rawIndex = 0;
    }

    const index = rawIndex % total;
    const event = TELEMETRY_EVENTS[index];
    const nextIndex = (index + 1) % total;

    return res.status(200).json({
      telemetry: event,
      index,
      nextIndex,
      total,
    });
  } catch (err) {
    console.error('[telemetry] Unhandled error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Failed to retrieve telemetry event.',
    });
  }
});

/**
 * @route  GET /api/telemetry
 * @desc   Returns all telemetry events
 * @access Public
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    telemetry: TELEMETRY_EVENTS,
    total: TELEMETRY_EVENTS.length,
  });
});

module.exports = router;
