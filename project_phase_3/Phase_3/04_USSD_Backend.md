# 04 — USSD Interface: Backend
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. What We Are Building

USSD (Unstructured Supplementary Service Data) is the *other* mobile internet — no smartphone, no data plan, just a dial pad. Users dial `*347#` and navigate a text menu by typing numbers.

In Nigeria, USSD is massive. MTN alone processes billions of USSD sessions per year for banking, airtime, and now travel.

---

## 2. How USSD Works

```
User dials *347#
        ↓
Network sends POST to our webhook
        ↓
We respond with a text menu
        ↓
User types "1" and presses send
        ↓
Network sends another POST (same sessionId)
        ↓
We respond with the next menu
        ↓
... until the user exits or completes the flow
```

Each round-trip is a **stateless HTTP request** from the telecom network. We track state server-side using a session map.

---

## 3. The USSD Service (`ussd.service.js`)

### Session Management

```javascript
export class UssdService {
  static sessions = {};

  static handleRequest({ sessionId, msisdn, input, network }) {
    if (!this.sessions[sessionId]) {
      // New session — create it
      this.sessions[sessionId] = { msisdn, network, language: 'en', menu: 'main' };
      return this.renderMainMenu();
    }

    const session = this.sessions[sessionId];
    return this.routeInput(session, input);
  }
}
```

Sessions are stored **in-memory** as a static object. This is appropriate for learning but would need Redis or a database for production.

### Menu Tree

```
MAIN MENU
  1 → BOOKING FLOW (origin → destination → operator → seats → confirm)
  2 → TRACK TRIP (enter booking ref)
  3 → VIEW ROUTES (show popular routes)
  4 → WALLET BALANCE (check balance)
  5 → LANGUAGE (en/yo/ha/ig/pcm)
  0 → EXIT
```

Each menu option is rendered as a USSD response string:

```javascript
static renderMainMenu() {
  return `CON Welcome to Naija Routes
1. Book Trip
2. Track Trip
3. Routes
4. Wallet Balance
5. Language
0. Exit`;
}
```

The `CON` prefix tells the network the session continues. `END` terminates it.

### Booking Flow

A 5-step wizard:

1. User selects "Book Trip"
2. System asks "Where from?" → user types city
3. System asks "Where to?" → user types city
4. System asks "Which operator?" → user types name
5. System asks "How many seats?" → user types number
6. System shows summary and "Confirm? 1. Yes 2. No"

If confirmed, a mock booking is created and a reference returned.

---

## 4. The USSD Routes (`ussd.routes.js`)

| Method | Path | Purpose |
|---|---|---|
| POST | `/webhook` | Main USSD handler (called by telecom network) |
| GET | `/simulate` | Simulator endpoint with query params (for testing) |
| GET | `/sessions` | List active sessions (admin/debugging) |

### Webhook Handler

```javascript
router.post('/webhook', async (req, res, next) => {
  try {
    const { sessionId, msisdn, input, network } = req.body;
    const response = UssdService.handleRequest({ sessionId, msisdn, input, network });
    res.json({ response });
  } catch (err) { next(err); }
});
```

### Simulator Endpoint

For development without a real USSD gateway:

```javascript
// GET /api/v1/ussd/simulate?sessionId=test&msisdn=2348012345678&input=1
```

---

## 5. Multi-Language Support

The USSD service supports switching languages mid-session:

```javascript
static renderLanguageMenu(session) {
  return `CON Choose Language
1. English
2. Yoruba
3. Hausa
4. Igbo
5. Pidgin
0. Back`;
}
```

Once selected, the `session.language` is updated, and future menu texts use the selected language. (Translation strings are inline in the service for now.)

---

## 6. Limitations (Learning Points)

1. **In-memory sessions** — lost on server restart. A real deployment uses Redis or a `ussd_sessions` table.
2. **Mock data** — booking lookup only returns results for `NR-TEST01` and `NR-TEST02`.
3. **No audit trail** — USSD interactions are not logged to the database. A `ussd_transactions` table would be needed for reconciliation.
4. **Single-threaded** — the static session map won't scale across multiple server instances.

These are intentional simplifications for the learning module.
