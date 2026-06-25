# 06 — Insurance Integration: Backend
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. What We Are Building

Travel insurance is an **ancillary revenue stream** — passengers add it at checkout for a small fee. Naija Routes partners with two Nigerian insurers: **AXA Mansard** and **Leadway Assurance**.

---

## 2. Database Schema (`003_insurance_schema.sql`)

Four tables:

```
insurance_providers
  id, name, slug, logo_url, contact_email, support_phone,
  is_active, created_at, updated_at

insurance_plans
  id, provider_id → providers.id, name, slug, description,
  price_kobo, coverage_details (jsonb), max_payout_kobo,
  is_active, created_at, updated_at

insurance_purchases
  id, user_id, plan_id → plans.id, booking_id,
  status (active/claimed/expired), start_date, end_date,
  purchased_at, created_at

insurance_claims
  id, purchase_id → purchases.id, user_id,
  type (delay/cancellation/baggage/medical/other),
  amount_kobo, description, status (pending/review/approved/rejected),
  filed_at, resolved_at, created_at
```

Seed data creates two providers, each with two plans:

| Provider | Plan | Price | Coverage |
|---|---|---|---|
| AXA Mansard | Basic | ₦1,500 | Delays, cancellations |
| AXA Mansard | Premium | ₦3,500 | Delays, cancellations, baggage, medical |
| Leadway | Standard | ₦1,200 | Delays, cancellations |
| Leadway | Comprehensive | ₦4,000 | Full coverage |

---

## 3. The Insurance Service (`insurance.service.js`)

All methods are static on the `InsuranceService` class, using `supabaseAdmin` for queries.

| Method | Purpose |
|---|---|
| `getProviders()` | All active providers with their plans |
| `getPlans(providerId?)` | Plans, optionally filtered by provider |
| `getPlan(planId)` | Single plan with provider details |
| `purchaseInsurance({userId, planId, bookingId})` | Purchase insurance for a booking |
| `getPurchases(userId?)` | List purchases, optionally filtered by user |
| `getPurchaseByBooking(bookingId)` | Find purchase linked to a booking |
| `fileClaim({purchaseId, userId, type, amountKobo, description})` | File a claim |
| `getClaims(userId?)` | List claims, optionally filtered by user |
| `getClaim(claimId)` | Single claim details |
| `updateClaimStatus(claimId, status)` | Approve/reject/review a claim |

### Purchase Flow

```javascript
static async purchaseInsurance({ userId, planId, bookingId }) {
  // 1. Validate the plan exists and is active
  // 2. Create purchase record
  // 3. Return the purchase with plan details
}
```

### Claim Flow

```javascript
static async fileClaim({ purchaseId, userId, type, amountKobo, description }) {
  // 1. Validate the purchase belongs to the user
  // 2. Create claim record with 'pending' status
  // 3. Return the claim
}
```

---

## 4. The Insurance Routes (`insurance.routes.js`)

| Method | Path | Description |
|---|---|---|
| GET | `/providers` | List all providers with plans |
| GET | `/plans` | List plans (optional `?providerId`) |
| GET | `/plans/:planId` | Get single plan |
| POST | `/purchase` | Purchase insurance |
| GET | `/purchases` | List purchases (optional `?userId`) |
| GET | `/purchases/booking/:bookingId` | Get purchase by booking ID |
| POST | `/claims` | File a claim |
| GET | `/claims` | List claims (optional `?userId`) |
| GET | `/claims/:id` | Get single claim |
| PATCH | `/claims/:id/status` | Update claim status (admin) |

---

## 5. Key Design Decisions

1. **Prices in kobo** — consistent with the rest of the platform. `price_kobo = 150000` means ₦1,500.
2. **Coverage as JSONB** — flexible schema for different plan types without needing separate tables for coverage options.
3. **Claims lifecycle**: `pending → review → approved | rejected`. Status changes are controlled by the `updateClaimStatus` endpoint (admin-only in production).
4. **Linked to bookings** — each insurance purchase references a `booking_id`, so the checkout page can show "already insured" state.
