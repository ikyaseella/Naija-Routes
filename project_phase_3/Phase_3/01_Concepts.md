# 01 — Phase 3 Concepts: Scale
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. Why Phase 3?

Phase 1 and 2 built the core passenger experience — search, book, track, review. By the end of Phase 2, Naija Routes is a functional travel platform. But to scale from thousands to millions of users, we need three things:

1. **Corporate business** — the real money in Nigerian transport comes from organisations (companies sending staff, schools moving students, churches organising trips). One corporate account can generate 100x the revenue of an individual user.
2. **Offline / feature phone access** — 40%+ of Nigeria's population still uses feature phones. USSD (`*347#`) is the only way to reach them.
3. **Ancillary revenue** — travel insurance and wallet payments create new revenue streams and lock-in.

These four features transform Naija Routes from a single-product (seat booking) into a platform with multiple revenue verticals.

---

## 2. The Four Features at a Glance

### Corporate Travel Portal

A corporate admin can:
- Add departments and employees
- Set travel policies (max price per booking, which routes, approval thresholds)
- Book travel for employees in bulk
- Get consolidated monthly invoices
- Approve or cancel bookings

The key innovation: **policy enforcement at checkout**. If an employee tries to book a route not covered by their company policy, the system rejects it before payment.

### USSD Interface

Uses the `*347#` short code. Menus are fully interactive:

```
Welcome to Naija Routes
1. Book Trip
2. Track Trip
3. Routes
4. Wallet Balance
5. Language
0. Exit
```

Each input from the user triggers a new USSD response. The session is tracked server-side so the user can navigate between menus.

### Insurance Integration

At booking checkout, users see a prompt:

> "Protect your trip with travel insurance"
> AXA Mansard — ₦1,500 — covers delays, cancellations, baggage

Users can add insurance with one click. The backend links the insurance purchase to the booking ID.

### Wallet & Payments

Users can:
- Fund their wallet from bank transfer or card
- Pay for bookings from wallet balance
- View transaction history
- Operators receive payouts to their wallet

---

## 3. Architecture Pattern

All four features follow the same architecture:

```
┌─────────────────────────────┐
│     Frontend HTML Page      │  ← apps/web/corporate.html (etc.)
├─────────────────────────────┤
│   Inline JS (fetch + DOM)   │  ← Fetches from API
├─────────────────────────────┤
│   api/v1/{feature}/*        │  ← Express routes
├─────────────────────────────┤
│   {Feature}Service          │  ← Business logic
├─────────────────────────────┤
│   Supabase (via config)     │  ← DB queries
└─────────────────────────────┘
```

Files per feature:

| Feature | Route File | Service File | Migration | Frontend |
|---|---|---|---|---|
| Corporate | `corporate.routes.js` | `corporate.service.js` | `002_corporate_schema.sql` | `corporate.html` |
| USSD | `ussd.routes.js` | `ussd.service.js` | (in-memory) | `ussd.html` |
| Insurance | `insurance.routes.js` | `insurance.service.js` | `003_insurance_schema.sql` | `insurance.html` |
| Wallet | `wallet.routes.js` | `wallet.service.js` | `004_wallet_schema.sql` | (inline) |

---

## 4. Database Migrations

Three new migration files live in `services/api/migrations/`:

| File | Tables |
|---|---|
| `002_corporate_schema.sql` | `corporates`, `corporate_departments`, `corporate_employees`, `corporate_travel_policies`, `corporate_bookings`, `corporate_invoices`, `corporate_invoice_line_items` |
| `003_insurance_schema.sql` | `insurance_providers`, `insurance_plans`, `insurance_purchases`, `insurance_claims` |
| `004_wallet_schema.sql` | `wallets`, `wallet_transactions` |

Each file includes seed data so the frontend pages work immediately after migration.

---

## 5. i18n Keys

New translation keys were added to all 5 locale files:

| Prefix | Page | Example |
|---|---|---|
| `corporate.*` | Corporate portal | `corporate.total_bookings` |
| `ussd.*` | USSD simulator | `ussd.dial_code` |
| `insurance.*` | Insurance portal | `insurance.plans_tab` |
| `payment.wallet` | Checkout | `payment.wallet` |

All keys follow the same dot-notation convention from Phase 2.

---

## 6. What Phase 3 Does NOT Cover

The PRD lists these Phase 3 features that are **not implemented** in this learning module:

- WhatsApp automated booking bot (planned but deferred)
- Mobile push notifications (requires Firebase, deferred)
- Auto-scaling deployment (infra concern, out of scope)
- React Native mobile app (`apps/mobile/` reserved but not built)
- TypeScript migration (prep work done, migration deferred)

These are listed for awareness. The core four features (Corporate, USSD, Insurance, Wallet) are the focus of Phase 3.
