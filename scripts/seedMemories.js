'use strict';

const hindsightService = require('../services/hindsightService');
const MEMORIES = require('../data/memories');

/**
 * Seeds the 20 historical Sentinel-AI memories into Hindsight.
 *
 * This is idempotent in the sense that Hindsight deduplicates by content —
 * running it multiple times will just reinforce existing memories.
 *
 * Called once at server startup.
 */
async function seedMemories() {
  console.log(`[seed] Starting memory seeding — ${MEMORIES.length} memories to load...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < MEMORIES.length; i++) {
    const memory = MEMORIES[i];
    try {
      await hindsightService.retain(memory.text, {
        context: memory.context,
        metadata: memory.metadata,
      });
      successCount++;
      console.log(`[seed] ✓ (${i + 1}/${MEMORIES.length}) Stored: "${memory.text.slice(0, 60)}..."`);
    } catch (err) {
      failCount++;
      console.warn(`[seed] ✗ (${i + 1}/${MEMORIES.length}) Failed to store memory: ${err.message}`);
    }
  }

  console.log(`[seed] Complete — ${successCount} stored, ${failCount} failed.`);
}

module.exports = { seedMemories };
