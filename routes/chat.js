'use strict';

const express = require('express');
const { randomUUID: uuidv4 } = require('crypto');
const groqService = require('../services/groqService');
const hindsightService = require('../services/hindsightService');

const router = express.Router();

// ─── System Prompt ────────────────────────────────────────────────────────────
const systemPromptData = require('../data/System Prompt.json');

/**
 * Build the system prompt by injecting recalled memories as context.
 * @param {Array<{type: string, text: string}>} memories
 * @returns {string}
 */
function buildSystemPrompt(memories) {
  const memoryBlock =
    memories.length > 0
      ? memories.map((m, i) => `[Memory ${i + 1}] (${m.type}): ${m.text}`).join('\n')
      : 'No specific memories retrieved for this query.';

  return `${systemPromptData.content}

=== RELEVANT MEMORY CONTEXT ===
${memoryBlock}
================================`;
}

// ─── POST /api/chat ───────────────────────────────────────────────────────────
/**
 * @route  POST /api/chat
 * @desc   Main chat pipeline: recall memories → build prompt → Groq → respond
 * @access Public (add auth middleware later if needed)
 *
 * Request body:
 *   { message: string, sessionId?: string, history?: Array<{role, content}> }
 *
 * Response:
 *   { reply: string, sessionId: string, sources: Array<{type, text}> }
 */
router.post('/', async (req, res) => {
  try {
    const { message, sessionId, history = [] } = req.body;

    // ── Validate ──────────────────────────────────────────────────────────────
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '"message" field is required and must be a non-empty string.',
      });
    }

    const currentSessionId = sessionId || uuidv4();

    // ── Step 1: Recall relevant memories from Hindsight ───────────────────────
    let memories = [];
    try {
      memories = await hindsightService.recall(message.trim());
    } catch (err) {
      // Non-fatal: if Hindsight is unavailable, continue without context
      console.warn('[chat] Hindsight recall failed, proceeding without context:', err.message);
    }

    // ── Step 2: Build message array for Groq ──────────────────────────────────
    const systemPrompt = buildSystemPrompt(memories);

    const messages = [
      { role: 'system', content: systemPrompt },
      // Inject previous turns (up to 10 to avoid token overflow)
      ...history.slice(-10).map(({ role, content }) => ({ role, content })),
      { role: 'user', content: message.trim() },
    ];

    // ── Step 3: Call Groq ─────────────────────────────────────────────────────
    const reply = await groqService.chat(messages, {
      temperature: 0.65,
      maxTokens: 1024,
    });

    // ── Step 4: Return JSON response ──────────────────────────────────────────
    return res.status(200).json({
      reply,
      sessionId: currentSessionId,
      sources: memories.map((m) => ({ type: m.type, text: m.text })),
      model: 'qwen/qwen3-32b',
    });
  } catch (err) {
    console.error('[chat] Unhandled error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Something went wrong processing your request.',
    });
  }
});

module.exports = router;
