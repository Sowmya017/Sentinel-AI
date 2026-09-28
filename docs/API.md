# Sentinel-AI Backend — API Documentation

> **For the frontend teammate**: Everything you need to connect your React/Vite/Tailwind frontend to this backend.

---

## Base URL

| Environment | URL |
|---|---|
| Local development | `http://localhost:3001` |
| Production | *(to be configured)* |

---

## CORS

The backend allows requests from these origins by default:
- `http://localhost:5173` *(Vite dev server)*
- `http://localhost:3000`

Additional origins can be added via the `ALLOWED_ORIGINS` environment variable.

---

## Endpoints

### 1. Health Check

```
GET /api/health
```

Use this to verify the backend is running before making other requests.

**Response `200`:**
```json
{
  "status": "ok",
  "service": "Sentinel-AI Backend",
  "version": "1.0.0",
  "model": "qwen/qwen3-32b",
  "hindsightBank": "sentinel-ai",
  "timestamp": "2024-12-01T14:30:00.000Z"
}
```

---

### 2. Chat — Main AI Pipeline

```
POST /api/chat
Content-Type: application/json
```

This is the **primary endpoint**. It:
1. Recalls relevant Sentinel-AI memories from Hindsight based on the user's message
2. Injects those memories as context into the system prompt
3. Calls Groq (`qwen/qwen3-32b`) with the full conversation
4. Returns the AI reply

**Request Body:**
```json
{
  "message": "string (required) — the user's message",
  "sessionId": "string (optional) — pass back the sessionId from previous response to maintain continuity",
  "history": [
    { "role": "user", "content": "Previous user message" },
    { "role": "assistant", "content": "Previous AI reply" }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | ✅ Yes | The user's current message |
| `sessionId` | string | ❌ No | Pass the `sessionId` from the last response. If omitted, a new UUID is generated. |
| `history` | array | ❌ No | Previous `{role, content}` pairs. Up to last 10 are used. |

**Response `200`:**
```json
{
  "reply": "Based on Sentinel-AI's threat intelligence, the LockBit-X ransomware variant was detected on 2024-02-03...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "sources": [
    {
      "type": "experience",
      "text": "Sentinel-AI successfully neutralized a ransomware variant LockBit-X on 2024-02-03..."
    }
  ],
  "model": "qwen/qwen3-32b"
}
```

| Field | Type | Description |
|---|---|---|
| `reply` | string | The AI-generated response |
| `sessionId` | string | Echo it back on the next request to maintain session |
| `sources` | array | Memory snippets used as context (show as citations if desired) |
| `model` | string | The model that generated the response |

**Error `400`:**
```json
{
  "error": "Bad Request",
  "message": "\"message\" field is required and must be a non-empty string."
}
```

**Error `500`:**
```json
{
  "error": "Internal Server Error",
  "message": "..."
}
```

**Example `fetch()` call:**
```javascript
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Tell me about the LockBit-X incident',
    sessionId: previousSessionId,   // undefined on first message
    history: conversationHistory,   // [] on first message
  }),
});

const data = await response.json();
// data.reply    → AI response string
// data.sessionId → save this for next request
// data.sources   → memory citations array
```

---

### 3. Live Demo Event — Latest

```
GET /api/events/latest
GET /api/events/latest?index=3
```

Returns the next Sentinel-AI event from a deterministic list of 20 events.  
To build a **live feed**, store `nextIndex` from the response and pass it as `?index=` on the next call.

**Query Params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `index` | integer | `0` | Which event to return. Cycles via modulo (0–19). |

**Response `200`:**
```json
{
  "event": {
    "id": "EVT-2024-001",
    "type": "malware-detection",
    "severity": "critical",
    "title": "LockBit-X Ransomware Detected on Endpoint",
    "description": "LockBit-X ransomware variant detected on workstation WS-FINANCE-047...",
    "source": "Sentinel-AI EDR",
    "affectedAssets": ["WS-FINANCE-047", "SRV-FILE-003"],
    "timestamp": "2024-02-03T02:14:22Z",
    "status": "contained",
    "mitreTactic": "TA0040 — Impact"
  },
  "index": 0,
  "nextIndex": 1,
  "total": 20
}
```

**Event Schema:**

| Field | Type | Values |
|---|---|---|
| `id` | string | Unique ID e.g. `EVT-2024-001` |
| `type` | string | `malware-detection`, `ddos-attack`, `insider-threat`, `zero-day-exploit`, `supply-chain-attack`, `apt-campaign`, `ot-intrusion`, `phishing`, `credential-stuffing`, `cloud-misconfiguration`, `lateral-movement`, `data-breach`, `honeypot-alert`, `vulnerability-alert`, `compliance-violation`, `brute-force`, `threat-intelligence`, `predictive-alert`, `ai-copilot-action` |
| `severity` | string | `info` \| `low` \| `medium` \| `high` \| `critical` |
| `title` | string | Short one-line title |
| `description` | string | Full incident detail |
| `source` | string | Originating Sentinel-AI subsystem |
| `affectedAssets` | array | Asset IDs/names affected |
| `timestamp` | string | ISO-8601 datetime |
| `status` | string | `active` \| `investigating` \| `contained` \| `resolved` |
| `mitreTactic` | string \| null | MITRE ATT&CK tactic (null if N/A) |

**Example — Polling for a live feed (every 5 seconds):**
```javascript
let eventIndex = 0;

async function pollLatestEvent() {
  const response = await fetch(`http://localhost:3001/api/events/latest?index=${eventIndex}`);
  const data = await response.json();
  
  displayEvent(data.event);     // render the event in your UI
  eventIndex = data.nextIndex;  // advance the cursor
}

setInterval(pollLatestEvent, 5000);
```

---

### 4. All Events

```
GET /api/events
```

Returns all 20 demo events at once. Useful for preloading or showing a full timeline.

**Response `200`:**
```json
{
  "events": [ ...array of 20 event objects... ],
  "total": 20
}
```

---

## Suggested Severity Color Mapping

```javascript
const SEVERITY_COLORS = {
  critical: '#FF2D55',   // red
  high:     '#FF9500',   // orange
  medium:   '#FFCC00',   // yellow
  low:      '#34C759',   // green
  info:     '#007AFF',   // blue
};
```

---

## Quick Integration Checklist

- [ ] Run `npm install` and `npm run dev` in the backend directory
- [ ] Copy `.env.example` to `.env` and fill in `GROQ_API_KEY`, `HINDSIGHT_BASE_URL`, `HINDSIGHT_API_KEY`
- [ ] Verify `GET http://localhost:3001/api/health` returns `{ status: "ok" }`
- [ ] Point your frontend fetch calls to `http://localhost:3001`
- [ ] Handle `sessionId` — save it from the first chat response and pass it back on subsequent messages
- [ ] Pass `history` array to maintain multi-turn conversation context
- [ ] For the live event feed, use the `nextIndex` polling pattern above

---

## Error Codes Reference

| HTTP Code | Meaning |
|---|---|
| `200` | Success |
| `400` | Bad Request — check request body/params |
| `404` | Endpoint not found |
| `500` | Internal Server Error — check backend logs |
