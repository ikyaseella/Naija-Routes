# 05 — USSD Interface: Frontend (Simulator)
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. Why a Simulator?

You can't easily test a real USSD short code during development — it requires carrier approval, a live SIM, and a contract with a USSD aggregator. Instead, we built a **phone simulator** that mimics the USSD experience in the browser.

---

## 2. Page Overview

File: `apps/web/ussd.html` (185 lines)

A retro phone UI:

```
┌──────────────────────┐
│   📶 MTN   🔋 87%   │  ← Status bar
│  ┌──────────────┐    │
│  │              │    │
│  │ Welcome to   │    │
│  │ Naija Routes │    │
│  │ 1. Book Trip │    │  ← Dialog area
│  │ 2. Track     │    │
│  │ 3. Routes    │    │
│  │ 0. Exit      │    │
│  │              │    │
│  └──────────────┘    │
│  *347#               │  ← Dial code
│  [Input field]       │  ← User types here
│  [▸ Send] [Back] [End]│
└──────────────────────┘
```

---

## 3. How It Works

### Starting a Session

```javascript
async function startSession() {
  const res = await fetch('/api/v1/ussd/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: sessionId,
      msisdn: '2348012345678',
      input: '',        // Empty = new session
      network: 'MTN'
    })
  });
  const data = await res.json();
  displayResponse(data.response);
}
```

### Sending Input

```javascript
async function sendInput() {
  const input = document.getElementById('ussdInput').value;
  const res = await fetch('/api/v1/ussd/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId, msisdn: '2348012345678', input, network: 'MTN'
    })
  });
  const data = await res.json();
  displayResponse(data.response);
}
```

Each user action triggers a POST to the webhook endpoint — exactly like a real USSD gateway would.

### Session ID

A random session ID is generated when the page loads:

```javascript
const sessionId = 'ussd-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
```

This keeps the browser tab's session separate from other tabs.

---

## 4. UI Controls

| Button | Action |
|---|---|
| **Start** | Initiates a new USSD session (POST with empty input) |
| **Send (▸)** | Sends the typed input to the webhook |
| **Back (0)** | Sends "0" to go back to the previous menu |
| **End** | Terminates the session (UI only, sends `END` to service) |

The input field supports both click-to-type and physical keyboard typing.

---

## 5. i18n Keys

```
ussd.title, ussd.simulator, ussd.dial_code, ussd.connected,
ussd.session_ended, ussd.start, ussd.end, ussd.new_session,
ussd.input_placeholder, ussd.send, ussd.back, ussd.connecting,
ussd.enter_input
```

---

## 6. Testing the USSD Flow

```bash
# 1. Start the API
cd services/api && npm start

# 2. Open apps/web/ussd.html in browser

# 3. Click "Start"
#    → See the main menu

# 4. Type "1" and press Send
#    → See "Where are you travelling FROM?"

# 5. Type "Lagos" and press Send
#    → See "Where are you travelling TO?"

# 6. Complete the booking flow
#    → Get a booking reference
```

### Testing Manually with curl

```bash
# New session
curl -X POST http://localhost:3000/api/v1/ussd/webhook \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-1","msisdn":"2348012345678","input":"","network":"MTN"}'

# Book trip (option 1)
curl -X POST http://localhost:3000/api/v1/ussd/webhook \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-1","msisdn":"2348012345678","input":"1","network":"MTN"}'
```

Or use the simulator endpoint:

```
http://localhost:3000/api/v1/ussd/simulate?sessionId=test1&input=1
```
