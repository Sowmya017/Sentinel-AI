'use strict';

const express = require('express');
const EVENTS = require('../data/events');

const router = express.Router();

// ─── GET /api/events/latest ───────────────────────────────────────────────────
/**
 * @route  GET /api/events/latest
 * @desc   Returns the next event from the deterministic Sentinel-AI event list.
 *         The list cycles endlessly. Use `?index=N` to jump to a specific event.
 *
 * @access Public
 *
 * Query params:
 *   index (optional) – integer 0..N, cycles via modulo
 *
 * Response:
 *   {
 *     event: { id, type, severity, title, description, source, affectedAssets, timestamp, status, mitreTactic },
 *     index: number,       // the index used for this response
 *     nextIndex: number,   // pass this as ?index= on the next call
 *     total: number        // total number of events in the list
 *   }
 */
router.get('/latest', (req, res) => {
  try {
    const total = EVENTS.length;

    // Parse and validate the index query param
    let rawIndex = parseInt(req.query.index, 10);
    if (isNaN(rawIndex) || rawIndex < 0) {
      rawIndex = 0;
    }

    // Cycle deterministically
    const index = rawIndex % total;
    const event = EVENTS[index];
    const nextIndex = (index + 1) % total;

    return res.status(200).json({
      event,
      index,
      nextIndex,
      total,
    });
  } catch (err) {
    console.error('[events] Unhandled error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Failed to retrieve event.',
    });
  }
});

// ─── GET /api/events (list all) ───────────────────────────────────────────────
/**
 * @route  GET /api/events
 * @desc   Returns all events (useful for the frontend to preload or display a feed)
 * @access Public
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    events: EVENTS,
    total: EVENTS.length,
  });
});

module.exports = router;
