# A Small Room — Social Rehearsal

A sparse, mobile-first black-and-white social decision and spoken rehearsal web application inspired by the minimalist aesthetic of *A Dark Room*. 

Built for the AI class assignment (Due October 22, 2026 at 11:59 PM Central; live for October 27 demo).

---

## 1. Architecture Overview

- **Frontend**: React 19 SPA running on Vite, styled with Tailwind CSS (v4) with strict black-and-white typography discipline (Crimson Pro serif narrative, JetBrains Mono labels, 16px+ inputs, outlined buttons, zero gradients or visual clutter).
- **Backend**: Full-stack Express server (`server.ts`) with development Vite middleware mode and production static file serving.
- **Multiple-Choice Responses**:
  - Zero typed responses and zero microphone recording required during gameplay.
  - After choosing an action, players select from 4 authored multiple-choice spoken lines reflecting different interpersonal tones (e.g., *Grounded Presence*, *Curious & Specific*, *Mutual Normalization*, *Warm & Low-Pressure*).
  - Central AI (Google Gemini via `/api/rehearse`) evaluates the chosen response in context, returning simulated in-character reactions, relational strengths, potential pitfalls, and actionable takeaways.
- **End-of-Game Camera Certificate**:
  - Once the player completes all 4 scenarios, they earn the **"I Have Social Intelligence!"** certificate.
  - Uses the device camera (phone front camera or laptop webcam) to snap their official portrait for the certificate.
- **Authored Narrative Graph**:
  - Exactly 13 authored scenarios across layers `1 + 4 + 4 + 4`.
  - Exactly 4 choices per scenario, each pointing to a distinct destination.
  - Exactly 4 reachable endings:
    1. *A Thread to Follow* (connection through curiosity)
    2. *A Bridge Under Repair* (trust built through repair)
    3. *A Room to Breathe* (the dignity of boundaries and introversion)
    4. *Ships in the Evening* (gentle coexistence without forced intimacy)
  - All 256 unique decision routes (`4 × 4 × 4 × 4`) are fully authored and tested.
- **Data Privacy & Storage**:
  - `GEMINI_API_KEY` stored exclusively on the server.
  - Zero logging or server-side persistence of personal audio recordings or transcripts.
  - Client state stores only authored progress and discovered endings in `localStorage` with in-memory fallback for private/blocked browsing.

---

## 2. Setup & Running Locally

### Prerequisites
- Node.js (v20+ or v22+)
- A Google Gemini API Key (configured in the AI Studio Secrets panel or `.env`)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd a-small-room

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

Ensure `GEMINI_API_KEY` is provided in `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Automated Test Suite
Run the test suite verifying all 256 story routes, ending reachability, schema validation, storage fallback, and audio MIME detection:
```bash
npm test
```

### Production Build & Launch
```bash
npm run build
npm start
```

---

## 3. Microphone Permissions & Privacy

- **On-Tap Permission Only**: Microphone permission is never requested on page load. It is only prompted when the user explicitly clicks `[TAP TO RECORD (UP TO 30S)]` in the rehearsal modal.
- **AI Studio Frame Permission**: `metadata.json` includes `requestFramePermissions: ["microphone"]` so the iframe runtime permits audio hardware access.
- **Track Lifecycle**: When recording stops, when the modal closes, or when the user navigates away, `stream.getTracks().forEach(t => t.stop())` is called immediately.
- **Privacy Disclosure**: Users are informed prior to sending that their recording is processed ephemerally by Google Gemini to generate feedback and is not retained or logged.

---

## 4. Real Phone Testing Checklist

> **Note on Verification**: *Automated unit and mock graph tests pass locally. Actual phone testing remains pending until verified on a physical device.*

Before the October 27 class demo, verify on physical mobile devices (iOS Safari and Android Chrome):
- [ ] **Viewport & Layout**: Verify no horizontal scroll or layout shifts on small screens (iPhone SE / Pixel).
- [ ] **Input Focus**: Tap into textareas and confirm iOS Safari does not auto-zoom (enforced via 16px minimum font size).
- [ ] **Microphone Prompt**: Tap Record and verify native browser permission dialog appears smoothly.
- [ ] **30-Second Cap**: Let the timer run to 30 seconds and confirm auto-stop triggers cleanly.
- [ ] **Playback**: Listen to the recorded audio playback in the `<audio>` player widget.
- [ ] **AI Feedback**: Tap "Get AI Feedback" and confirm structured feedback returns with simulated character reply and takeaway.
- [ ] **Editable Transcript**: Tap "Edit if misheard", alter a word, tap "Regenerate from Edited Text", and observe updated analysis.
- [ ] **Skip Rehearsal**: Tap "Continue without rehearsal" and confirm advancement without fabricated feedback.
- [ ] **Reconsider & Restart**: Tap reconsider to back up one step; restart and confirm confirmation dialog functions.
- [ ] **Offline / Blocked Storage**: Test in Incognito / Private Browsing mode to confirm in-memory storage fallback works without throwing errors.

---

## 5. Submission Note Template

```markdown
Project: A Small Room — Social Rehearsal
Student: [Your Name]
Course: AI Application Development
Submission Date: October 22, 2026
Demo Date: October 27, 2026

Live Web App URL (Computer & Phone): https://ais-dev-jxc6agp5lf5nfw6fgn5pem-722287424489.us-west2.run.app
GitHub Repository: [Your Public GitHub Repository URL]

Key Requirements Met:
1. Public phone-accessible mobile-first web app (responsive black-and-white minimalist design inspired by A Dark Room).
2. Real device feature: Microphone audio recording via getUserMedia and MediaRecorder with Safari/Chrome MIME detection, 30s cap, playback, and full track cleanup.
3. Real central AI: Google Gemini multimodal integration for verbatim transcription, in-character simulation, relational strengths, pitfalls, polished suggestions, and social takeaways.
4. Complete authored story graph: 13 scenarios across layers 1+4+4+4, exactly 4 choices per scenario (all 256 unique routes tested and validated), 4 distinct endings.
5. Reliability & Security: Server-side API key handling, request schema validation, 8MB payload cap, in-memory rate limiting, corrupt/blocked localStorage resilience.
```
