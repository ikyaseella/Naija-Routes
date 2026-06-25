# Phase 3 — Scale: Corporate + USSD + Insurance + Wallet
**Naija Routes · Instructor-Led Project · Phase 3**

---

## What We Are Building in Phase 3

Phase 3 takes Naija Routes from a passenger-only platform to a full-scale transport ecosystem. We add four major verticals:

| Feature | What It Does | Priority |
|---|---|---|
| Corporate Travel Portal | Multi-user accounts with travel policies, bulk booking, consolidated invoices | P2 |
| USSD Interface | Full booking and ticket lookup via `*347#` for feature phone users | P2 |
| Insurance Integration | Optional travel insurance upsell at checkout (AXA Mansard, Leadway) | P2 |
| Wallet & Payments | Digital wallet for balance-based payments, top-ups, transaction history | P2 |

By the end of Phase 3, a user can:
1. Book travel for their entire team through a **Corporate account** with policy enforcement
2. Dial `*347#` from any phone to book, check routes, or lookup tickets — no smartphone needed
3. Add **travel insurance** at checkout with one click
4. Fund a **wallet** and pay for trips without entering card details every time

---

## Phase 3 Files

### Part A — Corporate Travel Portal

| File | Topic |
|---|---|
| `02_Corporate_Backend.md` | Corporate DB schema, service, routes, policy enforcement |
| `03_Corporate_Frontend.md` | Corporate portal HTML — dashboard, bulk booking, invoices, policy |

### Part B — USSD Interface

| File | Topic |
|---|---|
| `04_USSD_Backend.md` | USSD session management, menu tree, webhook handler |
| `05_USSD_Frontend.md` | Phone simulator HTML — dial `*347#` in the browser |

### Part C — Insurance Integration

| File | Topic |
|---|---|
| `06_Insurance_Backend.md` | Insurance providers, plans, purchases, claims service |
| `07_Insurance_Frontend.md` | Insurance portal — browse plans, purchase, file claims |

### Part D — Wallet & Payments

| File | Topic |
|---|---|
| `08_Wallet_Backend.md` | Wallet schema, balance, top-up, deduct, transactions |
| `09_Wallet_Frontend.md` | Wallet UI — balance, top-up form, transaction history |

### Appendix

| File | Topic |
|---|---|
| `10_Exercises.md` | Practice exercises for all 4 parts |
| `11_Quiz.md` | Self-assessment with answer key |
| `12_Instructor_Guide.md` | Teaching notes, pacing, common blockers |

---

## Prerequisites

Before starting Phase 3, you should have completed:
- **Phase 0** — Monorepo setup, design tokens, shared packages
- **Phase 1** — Auth, search, booking, ticketing, agent app
- **Phase 2** — i18n, reviews, tracking, cargo

---

## Codebase Structure

```
naija-routes/
├── apps/
│   └── web/
│       ├── corporate.html     ← Corporate portal
│       ├── ussd.html          ← USSD simulator
│       └── insurance.html     ← Insurance portal
├── services/api/src/
│   ├── routes/
│   │   ├── corporate.routes.js
│   │   ├── ussd.routes.js
│   │   ├── insurance.routes.js
│   │   └── wallet.routes.js
│   ├── services/
│   │   ├── corporate.service.js
│   │   ├── ussd.service.js
│   │   ├── insurance.service.js
│   │   └── wallet.service.js
│   ├── config/supabase.js
│   └── app.js                 ← All Phase 3 routes imported
├── services/api/migrations/
│   ├── 002_corporate_schema.sql
│   ├── 003_insurance_schema.sql
│   └── 004_wallet_schema.sql
└── packages/shared/web/i18n/
    ├── en.json                ← corporate.*, ussd.*, insurance.* keys
    ├── yo.json
    ├── ha.json
    ├── ig.json
    └── pcm.json
```

---

## Reading Order

1. `01_Concepts.md` — Understand what Phase 3 is and why it matters
2. `02_Corporate_Backend.md` → `03_Corporate_Frontend.md`
3. `04_USSD_Backend.md` → `05_USSD_Frontend.md`
4. `06_Insurance_Backend.md` → `07_Insurance_Frontend.md`
5. `08_Wallet_Backend.md` → `09_Wallet_Frontend.md`
6. `10_Exercises.md` → practice
7. `11_Quiz.md` → self-assessment
8. `12_Instructor_Guide.md` — instructor reference

---

## Time Estimate

| Part | Reading | Coding | Total |
|---|---|---|---|
| Concepts | 15min | — | 15min |
| Corporate (backend + frontend) | 30min | 90min | 2h |
| USSD (backend + frontend) | 25min | 75min | 1h40min |
| Insurance (backend + frontend) | 25min | 75min | 1h40min |
| Wallet (backend + frontend) | 20min | 60min | 1h20min |
| Exercises | — | 60min | 1h |
| Quiz | 15min | — | 15min |
| **Total** | **~2h** | **~6h** | **~8h** |
