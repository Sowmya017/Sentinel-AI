'use strict';

/**
 * 20 historical Sentinel-AI memories seeded into Hindsight on first run.
 *
 * Each entry has:
 *   text     – the memory text (what gets stored and recalled)
 *   context  – a label describing the source / category of the memory
 *   metadata – arbitrary key-value pairs for filtering / tracing
 */
const rawMemories = require('./20 Historical Memories.json');

const MEMORIES = rawMemories.map(m => ({
  text: m.text,
  context: m.text.startsWith('Context Rule') ? 'context-rule' : 'security-log',
  metadata: { id: String(m.id) }
}));

module.exports = MEMORIES;
