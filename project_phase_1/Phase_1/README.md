# 📂 Phase 1 — Route search & booking MVP
## Naija Routes Instructor-Led Learning Materials

This folder contains all learning content for **Phase 1** of the Naija Routes project.
Students follow the numbered files in order. The number = the step sequence.

---

## 📖 Reading Order

| # | File | Audience | Description |
|---|---|---|---|
| — | [`README.md`](./README.md) | Everyone | You are here — start here |
| 1 | [`01_Concepts.md`](./01_Concepts.md) | 🎓 Students | Read FIRST — REST API, booking states, JWT, QR Codes, PWA/offline |
| 2 | [`02_Traveller_Web_App.md`](./02_Traveller_Web_App.md) | 🎓 Students | Build the "Deep Roots" Traveller Web App UI & static pages |
| 3 | [`03_Booking_and_Seats.md`](./03_Booking_and_Seats.md) | 🎓 Students | Seat selection logic and backend seat-locking in Redis |
| 4 | [`04_Digital_Tickets.md`](./04_Digital_Tickets.md) | 🎓 Students | QR code generation, PDF ticket downloads, and Termii SMS notifications |
| 5 | [`05_Payment_Integration.md`](./05_Payment_Integration.md) | 🎓 Students | Paystack gateway integration (card payments, bank transfers, webhooks) |
| 6 | [`06_Agent_App.md`](./06_Agent_App.md) | 🎓 Students | Build the "Field Terminal" Agent PWA (walk-up sales, QR scan, reconcile) |
| 7 | [`07_Operator_Portal.md`](./07_Operator_Portal.md) | 🎓 Students | Build the "Command Centre" Operator Dashboard, schedules, manifests |
| 8 | [`08_Backend_API_Routes.md`](./08_Backend_API_Routes.md) | 🎓 Students | Express API controllers and services for all features |
| 9 | [`09_Exercises.md`](./09_Exercises.md) | 🎓 Students | Hands-on practice tasks & self-assessment exercises |
| 10| [`10_Instructor_Guide.md`](./10_Instructor_Guide.md) | 👨‍🏫 Instructor only | Teaching notes, session pacing, and common blockers |

---

## 🎯 Phase 1 Deliverables

By the end of this phase, the following will be complete:

| Deliverable | Status | Where |
|---|---|---|
| ✅ Route Search Engine | **Done** | `apps/web/search.html` + `services/api/src/routes/search.routes.js` |
| ✅ Seat Map & Seat Locking | **Done** | `apps/web/booking.html` + Redis seat lock TTL in API server |
| ✅ Paystack Payment Popup & Webhooks | **Done** | `apps/web/js/modules/payment.js` + webhook verify middleware |
| ✅ Secure QR-code Tickets & SMS | **Done** | `apps/web/ticket.html` + client-side qr generation + Termii SMS |
| ✅ Dark-mode Agent PWA | **Done** | `apps/agent/` — sell tickets, scan QR codes, IndexedDB queue |
| ✅ Operator Portal Dashboard | **Done** | `apps/operator/` — occupancy conic charts, CRUD routes, manifests |

---

## 📁 Codebase Structure After Phase 1

```
naija-routes/
├── apps/
│   ├── web/                   ← Consumer web app (Vite + Vanilla JS)
│   ├── agent/                 ← Park agent PWA (Vite + Vanilla JS)
│   ├── operator/              ← Operator dashboard (Vite + Vanilla JS)
│   └── admin/                 ← Platform admin dashboard
│
├── services/
│   └── api/                   ← Express API server (Node.js)
│
├── packages/
│   └── shared/                ← Shared utility functions, constants, validation
│       ├── constants.js
│       ├── validators.js
│       └── locales/
│
├── pnpm-workspace.yaml
├── package.json
└── turbo.json
```

---

## ⏱️ Time Estimate

| Activity | Time |
|---|---|
| `01_Concepts.md` (read) | 30 mins |
| `02_Traveller_Web_App.md` (build) | 60 mins |
| `03_Booking_and_Seats.md` (build) | 45 mins |
| `04_Digital_Tickets.md` (build) | 45 mins |
| `05_Payment_Integration.md` (build) | 60 mins |
| `06_Agent_App.md` (build) | 90 mins |
| `07_Operator_Portal.md` (build) | 90 mins |
| `08_Backend_API_Routes.md` (build) | 90 mins |
| `09_Exercises.md` | 120–180 mins |
| **Total** | **~11–13 hours** |
