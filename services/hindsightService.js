'use strict';

const { HindsightClient } = require('@vectorize-io/hindsight-client');
const config = require('../config');

// ─── Client (singleton) ───────────────────────────────────────────────────────
const client = new HindsightClient({
  baseUrl: config.hindsight.baseUrl,
  apiKey: config.hindsight.apiKey,
});

const BANK_ID = config.hindsight.bankId;

/**
 * Store a memory in the Sentinel-AI Hindsight bank.
 *
 * @param {string} text            - The memory text to store
 * @param {object} [meta]          - Optional metadata
 * @param {string} [meta.context]  - Source context label
 * @param {object} [meta.metadata] - Arbitrary key-value metadata
 * @returns {Promise<void>}
 */
async function retain(text, meta = {}) {
  await client.retain(BANK_ID, text, {
    timestamp: new Date(),
    context: meta.context || 'sentinel-ai-system',
    metadata: meta.metadata || {},
  });
}

/**
 * Search for relevant memories from the Sentinel-AI bank.
 *
 * @param {string} query           - The search query
 * @param {number} [topK=5]        - Number of results to return (not directly
 *                                   supported by SDK; we slice the results)
 * @returns {Promise<Array<{type: string, text: string}>>} Matching memory objects
 */
async function recall(query, topK = 5) {
  const response = await client.recall(BANK_ID, query);
  // response.results is an array of { type, text, ... }
  const results = response?.results ?? [];
  return results.slice(0, topK);
}

module.exports = { retain, recall };
