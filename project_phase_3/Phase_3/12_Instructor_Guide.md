# 12 — Phase 3 Instructor Guide
**Naija Routes · Instructor-Led Project · Phase 3**

---

## Overview

Phase 3 is the largest phase so far — four features across backend and frontend. The good news is that they all follow the same architecture pattern students already know from Phases 1 and 2: routes → services → frontend HTML.

---

## Teaching Order

### Recommended Sequence

1. **01_Concepts.md** — lecture/discussion (15 min)
2. **02 + 03 Corporate** — demo + code-along (2h)
3. **04 + 05 USSD** — demo + code-along (1h 40min)
4. **06 + 07 Insurance** — demo + code-along (1h 40min)
5. **08 + 09 Wallet** — demo + code-along (1h 20min)
6. **10 Exercises** — lab time (1h)
7. **11 Quiz** — individual assessment (15 min)

### Alternative: Themed Sprint

For shorter sessions, teach by theme rather than by feature:

- **Day 1 — Revenue features**: Corporate (bulk bookings) + Insurance (ancillary revenue)
- **Day 2 — Access features**: USSD (offline reach) + Wallet (payment infra)
- Use the same backend/frontend pairing within each day.

---

## Key Teaching Points

### What's New in Phase 3

| Concept | Phase 1-2 | Phase 3 |
|---|---|---|
| Data source | Mock data | **Supabase-connected** (Corporate, Insurance, Wallet) |
| User types | Individual travellers | **Organisations** (corporate admins, employees) |
| Payment | Card only | **Wallet + Insurance upsell** |
| Access channel | Web only | **Web + USSD (feature phone)** |

### Common Blocker: Missing Supabase Connection

Corporate, Insurance, and Wallet services use `supabaseAdmin` directly. If the Supabase client isn't configured, these services will throw errors.

**Solution**: Check `services/api/src/config/supabase.js` for valid `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`. If not configured, temporarily swap to mock data (see Exercise variation below).

### Common Blocker: CORS

The frontend HTML pages fetch from `http://localhost:3000`. If the API isn't running or CORS isn't configured, pages will show "Failed to load" errors.

**Solution**: Ensure `app.js` has the CORS middleware:
```javascript
import cors from 'cors';
app.use(cors());
```

### Common Blocker: USSD Testing

Without a real USSD gateway, students rely on the simulator. Make sure they understand:
- The simulator calls the exact same `POST /webhook` endpoint
- Each "send" is a new HTTP request
- The session ID ties requests together

---

## Exercise Scoring Guide

| Exercise | Difficulty | Key Concept Tested |
|---|---|---|
| 1 — Add corporate | Easy | Schema understanding + seed data |
| 2 — Policy test | Easy | Policy enforcement logic |
| 3 — Analytics tab | Medium | Frontend data fetching + charting |
| 4 — Extend USSD menu | Easy | Menu tree structure |
| 5 — Real wallet integration | Medium | Service-to-service calls |
| 6 — USSD session table | Medium | Database design |
| 7 — Checkout upsell | Medium | Frontend flow integration |
| 8 — Claims admin | Medium | Admin view + status management |
| 9 — Corporate insurance | Hard | Cross-feature integration |
| 10 — Wallet frontend | Medium | Full CRUD frontend from API |
| 11 — Auto-top-up | Hard | Service logic + edge cases |
| 12 — Payouts | Hard | New table design + idempotency |
| 13 — E2E test | Hard | Multi-feature orchestration |
| 14 — USSD corporate | Hard | Cross-feature integration |
| 15 — WhatsApp bot | Stretch | Architecture design |
| 16 — USSD migration | Medium | SQL migration writing |

---

## Discussion Questions

1. **Why kobo?** — What problems would we face if we stored prices as floats?
2. **In-memory vs database** — What are the tradeoffs for USSD session storage? When is in-memory acceptable?
3. **Policy enforcement** — Should the frontend also enforce policy, or is backend-only enforcement sufficient?
4. **Insurance at scale** — How would claims verification work in production? Would Naija Routes verify claims directly or partner with insurers?
5. **Wallet vs card** — For a Nigerian audience, which payment method would drive more adoption? Why?
6. **USSD vs App** — What features work better on USSD vs a smartphone app? What features are impossible on USSD?

---

## Pacing Guide

| Segment | Slides | Demo | Code | Total |
|---|---|---|---|---|
| Intro + Concepts | 15 min | — | — | 15 min |
| Corporate Backend | 10 min | 10 min | 30 min | 50 min |
| Corporate Frontend | 5 min | 5 min | 30 min | 40 min |
| USSD Backend | 10 min | 10 min | 20 min | 40 min |
| USSD Frontend | 5 min | 5 min | 20 min | 30 min |
| Insurance Backend | 10 min | 10 min | 20 min | 40 min |
| Insurance Frontend | 5 min | 5 min | 20 min | 30 min |
| Wallet Backend | 10 min | 10 min | 20 min | 40 min |
| Wallet Frontend | 5 min | 5 min | 20 min | 30 min |
| Exercises | — | — | 60 min | 60 min |
| Quiz | — | — | 15 min | 15 min |
| **Total** | **80 min** | **60 min** | **255 min** | **~7h** |

---

## Pre-Session Checklist

- [ ] API server running (`cd services/api && npm start`)
- [ ] Supabase configured with all migrations applied
- [ ] Seed data loaded (corporate, insurance, wallet tables populated)
- [ ] CORS enabled in `app.js`
- [ ] Frontend pages accessible from browser (file:// or local server)
- [ ] Test USSD flow with curl or simulator
- [ ] Test a corporate booking with policy enforcement
- [ ] Test insurance purchase and claim flow
- [ ] Test wallet top-up and balance check
