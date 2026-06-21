# 01 — Phase 1 Concepts
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## What We Are Building in Phase 1

Phase 1 is where everything comes alive. In Phase 0, you set up the tools, database schema, and project structure. In Phase 1, you build three real working applications:

| App | Who Uses It | What It Does | Design System |
|---|---|---|---|
| 🌿 **Traveller Web App** | Passengers | Search routes, book seats, pay, download ticket | **"Deep Roots"** — Emerald + Gold |
| 🖤 **Park Agent App** | Motor park agents | Sell walk-up tickets, scan QR codes at boarding | **"Field Terminal"** — Dark Forest + Neon Green |
| 🚌 **Operator Portal** | Bus operators | View revenue, manage routes and schedules | **"Command Centre"** — Dark Sidebar + Light Content |

> **Visual Reference:** All three Design 1 UI mockups are in the `dashboards/` folder:
> - `ui_traveller_design1.html` — "Deep Roots" Traveller app
> - `ui_agent_design1.html` — "Field Terminal" Agent app
> - `ui_operator_design1.html` — "Command Centre" Operator portal
> - `ui_admin_design1.html` — "Mission Control" Admin dashboard (Phase 2)

By the end of Phase 1, a real traveller can:
1. Open the website on their phone
2. Search Lagos → Abuja for tomorrow
3. Pick an operator and seat
4. Pay with card (Paystack)
5. Receive a QR-code ticket via SMS
6. Show the QR to an agent at the park
7. The agent scans it → passenger boards

---

## Design 1 System — The Canonical Visual Reference

All Phase 1 UI is built on **Design 1** — a single unified visual language with three personas.

### Design Token Summary

| Token | Traveller "Deep Roots" | Agent "Field Terminal" | Operator "Command Centre" |
|---|---|---|---|
| **Background** | `#FDF8F0` Cream | `#0F1710` Dark Forest | `#F8FAFC` Light Slate |
| **Primary Green** | `#1B6B3A` Emerald | `#3CB371` Medium Sea Green | `#16A34A` Green 600 |
| **Accent** | `#D4A017` Gold | `#FCD34D` Amber | `#D97706` Amber 600 |
| **Heading Font** | `Syne` (800 weight) | `Space Grotesk` (700) | `Plus Jakarta Sans` (800) |
| **Mono Font** | `Inter` | `Space Mono` | `Plus Jakarta Sans` |
| **Style** | Light, warm, consumer | Dark, high-contrast, field | Clean, data-dense, professional |

### Responsive Breakpoints (all three apps)

```css
/* Desktop-first: full sidebar + content */
> 1024px   → Full layout

/* Tablet: sidebar collapses to drawer */
768–1024px → Hamburger drawer, 2-col grids

/* Mobile: single column, stacked */
< 768px    → Single column, bottom-friendly tap targets
< 480px    → Maximum compactness, large touch targets
```

---

## Key Concepts You Must Understand

### 1. REST API — How Frontend Talks to Backend

The frontend (HTML/CSS/JS) never talks directly to the database. It talks to the **API** (your Express server), which talks to the database.

```
Browser → HTTP Request → Express Server → PostgreSQL → Response → Browser
```

Every request follows this format:

```
METHOD /api/v1/resource
Authorization: Bearer <jwt_token>
Content-Type: application/json

{ "body": "data" }
```

**The 4 HTTP Methods you'll use:**

| Method | Action | Example |
|---|---|---|
| `GET` | Read data | `GET /api/v1/routes/search?origin=Lagos` |
| `POST` | Create new data | `POST /api/v1/bookings` |
| `PATCH` | Update part of data | `PATCH /api/v1/bookings/:id` |
| `DELETE` | Remove data | `DELETE /api/v1/schedules/:id` |

**Try it yourself** — open your browser console on any website and type:
```javascript
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(r => r.json())
  .then(data => console.log(data));
```

---

### 2. The Booking State Machine

A booking is not just created and done. It goes through **states**:

```
PENDING ──────────────── 10 min expires ──────→ EXPIRED
   │
   │ (payment succeeds)
   ▼
CONFIRMED ───────────────────────────────────→ COMPLETED
   │                                            (after journey)
   │ (user cancels)
   ▼
CANCELLED
```

**Why this matters:** When a user picks a seat, we *lock* it for 10 minutes using Redis TTL. If payment isn't completed in time, the seat unlocks for someone else. This is exactly how airline booking works.

```javascript
// Pseudo-code: locking a seat in Redis
await redis.set(`seat_lock:${scheduleId}:${seatNo}`, userId, 'EX', 600); // 600 seconds = 10 min
```

---

### 3. JWT Authentication — Who Are You?

When a user logs in with their phone OTP, your server creates a **JSON Web Token (JWT)** — a signed string that proves who the user is.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoidHJhdmVsbGVyIn0.abc123
```

This token has 3 parts (separated by `.`):
1. **Header** — algorithm used
2. **Payload** — user data (userId, role, expiry)
3. **Signature** — proves it wasn't tampered with

Every API request sends this token in the `Authorization` header:
```
Authorization: Bearer eyJhbGci...
```

The server verifies the token before doing anything.

**Roles in Naija Routes:**
```
traveller → can book, view own tickets
agent     → can sell tickets, scan QR
operator  → can manage routes and view revenue
admin     → full platform access
```

---

### 4. QR Codes — How Tickets Work

A QR code is just a way to encode text as a scannable image. For Naija Routes, the QR code contains a **unique hash** (secure random string) linked to the booking in your database.

```
QR Code visually encodes: "NR-2025-a3f8c1d2e9b4"

When agent scans it → your app calls:
POST /api/v1/tickets/NR-2025-a3f8c1d2e9b4/scan

Server checks:
1. Does this hash exist in tickets table? ✓
2. Is the booking status = confirmed? ✓
3. Has it already been scanned? ✗ (prevent duplicates)

→ Mark as scanned, passenger boards
```

We use the `qrcode` npm package to generate the QR image from the hash.

---

### 5. Frontend Architecture — How Pages Connect

The Naija Routes web app is **multi-page** (not a Single Page App). Each `.html` file is a full page:

```
index.html      ← User searches for a route
    ↓ (search form submits)
search.html     ← User sees operator results
    ↓ (clicks "Book Now")
booking.html    ← User picks seat and fills details
    ↓ (Paystack payment popup completes)
ticket.html     ← User sees QR ticket
```

Data is passed between pages using **URL query parameters**:
```
search.html?origin=Lagos&destination=Abuja&date=2025-12-25
booking.html?scheduleId=abc123&seat=12A
ticket.html?bookingId=xyz789
```

Each page reads its parameters with:
```javascript
const params = new URLSearchParams(window.location.search);
const origin = params.get('origin'); // "Lagos"
```

---

### 6. Design System — Tokens, Base, Components

Rather than writing random CSS colours everywhere, we use a **design token** system aligned with **Design 1**:

```css
/* tokens.css — Traveller App "Deep Roots" tokens */
:root {
  --green-deep:   #0A3D20;   /* Deep forest — nav background */
  --green-mid:    #1B6B3A;   /* Primary emerald — buttons, links */
  --green-light:  #2E9E57;   /* Hover states */
  --gold:         #D4A017;   /* Gold accent — CTA, highlights */
  --gold-light:   #F0C842;   /* Gold hover */
  --cream:        #FDF8F0;   /* Page background */
  --charcoal:     #1A1A1A;   /* Headings */
  --slate:        #4A5568;   /* Body text */
  --mist:         #EDF2EF;   /* Light backgrounds, dividers */
  --font-heading: 'Syne', sans-serif;
  --font-body:    'Inter', sans-serif;
}
```

**Three CSS files, one rule:**
- `tokens.css` — only variables, nothing else
- `base.css` — reset and typography
- `components.css` — reusable UI pieces

---

### 7. Offline-First for the Agent App

Park agents at motor parks often have poor internet. The agent app must work **offline**:

1. Agent sells a ticket without internet → stored in **IndexedDB** (browser database)
2. When internet returns → **background sync** pushes the sale to the server
3. Server records the booking + generates QR

```javascript
// Store offline sale in IndexedDB
const db = await openDB('agent-sales', 1);
await db.add('pending-sales', { route, passenger, amount, timestamp });

// Sync when online
window.addEventListener('online', async () => {
  const pending = await db.getAll('pending-sales');
  for (const sale of pending) {
    await fetch('/api/v1/bookings', { method: 'POST', body: JSON.stringify(sale) });
  }
});
```

---

## Phase 1 File Map — What You Will Create

```
naija-routes/
├── apps/
│   ├── web/                          ← Traveller web app
│   │   ├── css/
│   │   │   ├── tokens.css            ← Step 1: Design tokens (Deep Roots palette)
│   │   │   ├── base.css              ← Step 2: Reset + typography (Syne + Inter)
│   │   │   └── components.css        ← Step 3: Reusable UI
│   │   ├── index.html                ← Step 4: Landing + search
│   │   ├── search.html               ← Step 5: Results page
│   │   ├── booking.html              ← Step 6: Seat + checkout
│   │   ├── ticket.html               ← Step 7: QR ticket
│   │   └── js/
│   │       ├── core/api.js           ← Step 8: HTTP client
│   │       └── modules/search.js     ← Step 9: Search logic
│   │
│   ├── agent/                        ← Park agent app (Field Terminal)
│   │   ├── css/agent.css             ← Step 10: Dark agent styles
│   │   ├── index.html                ← Step 11: Agent dashboard
│   │   ├── sell.html                 ← Step 12: Ticket sales
│   │   ├── scan.html                 ← Step 13: QR scanner
│   │   └── reconcile.html            ← Step 14: Cash reconciliation
│   │
│   └── operator/                     ← Operator portal (Command Centre)
│       ├── css/operator.css          ← Step 15: Operator styles
│       ├── index.html                ← Step 16: Revenue dashboard
│       ├── routes.html               ← Step 17: Route management
│       └── bookings.html             ← Step 18: Passenger manifest
│
└── server/src/
    ├── routes/
    │   ├── search.routes.js          ← Step 19: Route search API
    │   ├── booking.routes.js         ← Step 20: Booking API
    │   ├── ticket.routes.js          ← Step 21: Ticket + scan API
    │   ├── operator.routes.js        ← Step 22: Operator API
    │   └── agent.routes.js           ← Step 23: Agent API
    └── services/
        ├── booking.service.js        ← Step 24: Business logic
        ├── ticket.service.js         ← Step 25: QR + validation
        └── search.service.js         ← Step 26: Query builder
```

---

## ✅ Pre-Flight Checklist

Before you start Phase 1 coding, confirm:

- [ ] Phase 0 database schema is created (Supabase has all 12 tables)
- [ ] `.env` file has correct Supabase URL + anon key
- [ ] `pnpm install` runs without errors from the root folder
- [ ] `node server/src/server.js` starts without crashing
- [ ] You have opened `dashboards/ui_traveller_design1.html` and studied the "Deep Roots" layout
- [ ] You have opened `dashboards/ui_agent_design1.html` and studied the "Field Terminal" dark layout
- [ ] You have opened `dashboards/ui_operator_design1.html` and studied the "Command Centre" layout
- [ ] You understand the booking state machine above
- [ ] You understand how JWT tokens work
- [ ] You have read the `shared/constants.js` file (booking statuses, roles)

> **Instructor Note:** Run a 10-minute whiteboard session on the booking state machine before students start coding. Drawing it out prevents the most common Phase 1 mistake — students who never handle the EXPIRED state.
>
> **Design Note:** Before any HTML/CSS work, have students open all three Design 1 dashboard HTML files in the browser (no server needed — just open the file). They should be able to resize the browser window and see the responsive layout adapt across desktop, tablet, and mobile viewports.
