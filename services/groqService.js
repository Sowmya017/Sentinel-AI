'use strict';

const Groq = require('groq-sdk');
const config = require('../config');

// ─── Client (singleton) ───────────────────────────────────────────────────────
const groq = new Groq({ apiKey: config.groq.apiKey });

/**
 * Send a chat completion request to Groq using qwen/qwen3-32b.
 *
 * @param {Array<{role: string, content: string}>} messages  - Full message history
 * @param {object} [options]
 * @param {number} [options.temperature=0.7]
 * @param {number} [options.maxTokens=1024]
 * @returns {Promise<string>} The assistant's reply text
 */
async function chat(messages, options = {}) {
  const { temperature = 0.7, maxTokens = 1024 } = options;

  const completion = await groq.chat.completions.create({
    model: config.groq.model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const reply = completion.choices?.[0]?.message?.content ?? '';
  return reply.trim();
}

module.exports = { chat };
