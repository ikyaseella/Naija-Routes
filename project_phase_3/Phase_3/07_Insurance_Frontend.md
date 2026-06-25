# 07 — Insurance Integration: Frontend
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. Page Overview

File: `apps/web/insurance.html` (295 lines)

The page is a tabbed portal with 4 views:

| Tab | Path | Content |
|---|---|---|
| Plans | `#tab-plans` | Provider cards + plan grid with prices |
| My Policies | `#tab-policies` | Purchased insurance policies with status |
| Claims | `#tab-claims` | Filed claims with status badges |
| File a Claim | `#tab-file` | Claim form (policy, type, amount, description) |

---

## 2. Plans Tab

Fetches `GET /api/v1/insurance/providers` and renders:

**Provider cards** showing provider name and support contact.

Under each provider, their plans are displayed:

```html
<div class="plan-card">
  <div class="plan-name">Basic</div>
  <div class="plan-price">₦1,500</div>
  <div class="plan-coverage">✓ Delays<br>✓ Cancellations</div>
  <div class="plan-payout">Max payout: ₦100,000</div>
  <button onclick="purchasePlan('plan-001')">Buy Now</button>
</div>
```

The "Buy Now" button triggers a confirmation dialog and then calls `POST /api/v1/insurance/purchase`.

---

## 3. Purchase Flow

```javascript
async function purchasePlan(planId) {
  const confirmed = confirm('Purchase this plan for ₦...?');
  if (!confirmed) return;

  const res = await fetch('/api/v1/insurance/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'usr-emeka',
      planId: planId,
      bookingId: prompt('Enter booking ID:') || 'bkg-' + Date.now()
    })
  });
  const json = await res.json();
  if (json.success) {
    alert('Policy purchased!');
    switchTab('policies');
  }
}
```

A real checkout flow would pass the `bookingId` automatically. The prompt is used here for simplicity.

---

## 4. My Policies Tab

Fetches `GET /api/v1/insurance/purchases?userId=usr-emeka` and renders a table:

```
Policy    | Plan       | Status   | Purchased   | Valid Until
pur-001   | Basic      | ✅ Active | 2025-06-01  | 2025-06-15
pur-002   | Premium    | ⏳ Expired | 2025-05-01 | 2025-05-15
```

---

## 5. Claims Tab

Lists claims with status badges:

- **Pending** — yellow
- **Review** — blue
- **Approved** — green
- **Rejected** — red

---

## 6. File a Claim Tab

Form fields:
- **Policy** — dropdown from user's active policies
- **Type** — delay, cancellation, baggage, medical, other
- **Amount** — in naira (converted to kobo on submit)
- **Description** — free text explaining the claim

```javascript
async function submitClaim(e) {
  e.preventDefault();
  const res = await fetch('/api/v1/insurance/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      purchaseId, userId: 'usr-emeka',
      type, amountKobo: amount * 100, description
    })
  });
  // ...
}
```

---

## 7. i18n Keys

```
insurance.title, insurance.subtitle, insurance.plans_tab,
insurance.my_policies, insurance.claims_tab, insurance.file_claim,
insurance.provider, insurance.plan, insurance.price,
insurance.coverage, insurance.max_payout, insurance.purchase,
insurance.status_active, insurance.status_expired,
insurance.claim_policy, insurance.claim_type, insurance.claim_amount,
insurance.upsell_title, insurance.upsell_description
```

---

## 8. Running the Page

```bash
cd services/api && npm start    # API on port 3000
# Open apps/web/insurance.html in browser
```

The page uses `USER_ID = 'usr-emeka'` and fetches from `http://localhost:3000/api/v1/insurance/*`. With the seed data loaded, providers and plans will display immediately.
