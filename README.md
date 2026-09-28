# Sentinel-AI: Physical Infrastructure Incident Response Agent

## Overview
Sentinel-AI is an edge-computing Threat Intelligence Dashboard designed for physical security command centers. Built for the **Engineering & DevOps: Incident Response Agent** problem statement, Sentinel-AI replaces generic "blind" security monitors with a memory-augmented AI copilot. 

Instead of relying on human operators to manually track vehicle anomalies across 72-hour shifts, Sentinel-AI uses Hindsight to remember the "Pattern-of-Life" of every vehicle, automatically flagging sophisticated reconnaissance threats.

## The Problem
Standard computer vision (like YOLOv5) can identify an object, but it has zero memory. A camera knows a commercial van is at the North Gate today, but it completely forgets that the same van was idling at the East Perimeter three nights ago. Standard RAG (Retrieval-Augmented Generation) fails to solve this because it lacks strict temporal reasoning.

## The Solution
Sentinel-AI leverages an Edge-to-Dashboard architecture powered by **Hindsight's Temporal Memory**:
1. **Edge Telemetry:** Simulated edge cameras push lightweight JSON telemetry (bounding boxes, timestamps, license plates) to the dashboard instead of streaming heavy 4K video.
2. **Multi-View Command Interface:** A clean, modular React application featuring dedicated, uncrowded views for live camera feeds, historical telemetry logs, and the AI copilot to ensure a distraction-free operator experience.
3. **Memory-Augmented Threat Assessment:** By passing edge logs into Hindsight's `retain()` API, the system builds a timeline. When an operator queries the copilot, the `recall()` API fetches the vehicle's historical context, allowing the Groq LLM to warn operators of multi-day threat patterns.
4.
5. ## Tech Stack
* **Frontend:** React (Vite), Tailwind CSS (Dark Mode UI)
* **AI Memory:** Hindsight API (`retain` and `recall` endpoints)
* **LLM Reasoning:** Groq API (`qwen3-32b` / `gpt-oss-120b`)
* **Data Simulation:** Node.js JSON payload generation

## How to Run Locally
1. Clone the repository: `git clone [YOUR_REPO_URL]`
2. Install dependencies: `npm install`
3. Set your environment variables in `.env`:
   * `VITE_GROQ_API_KEY=your_key`
   * `VITE_HINDSIGHT_API_KEY=your_key`
4. Start the development server: `npm run dev`
