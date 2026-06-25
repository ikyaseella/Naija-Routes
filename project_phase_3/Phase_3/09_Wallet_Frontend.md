# 09 — Wallet & Payments: Frontend
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. Current Wallet Frontend

The wallet does **not** have a standalone frontend page (`wallet.html` does not exist). Instead, wallet features are accessed in two places:

1. **USSD menu** (Option 4: Wallet Balance) — shows a mock balance of ₦2,500
2. **Booking checkout** (`booking.js`) — wallet is referenced as a payment method

This is intentional — the wallet is an infrastructure feature that other pages consume. Building a standalone wallet portal is one of the exercises.

---

## 2. USSD Wallet Integration

In the USSD flow, selecting "Wallet Balance" (option 4) triggers:

```javascript
// ussd.service.js
static handleWalletBalance(session) {
  // Mock: returns a hardcoded balance
  return `END Your Naija Routes Wallet Balance is ₦2,500.00`;
}
```

A real implementation would call the wallet service:

```javascript
const wallet = await WalletService.getWallet(userId);
return `END Your wallet balance is ₦${(wallet.balance_kobo / 100).toFixed(2)}`;
```

---

## 3. Booking Checkout Integration

In `booking.js`, the wallet appears as a payment option alongside card payment:

```javascript
const paymentOptions = [
  { id: 'wallet', label: 'Pay with Wallet', balance: '₦2,500' },
  { id: 'card', label: 'Pay with Card' }
];
```

The checkout calls `POST /api/v1/wallet/{userId}/deduct` to charge the wallet:

```javascript
async function payWithWallet(amountKobo) {
  const res = await fetch(`http://localhost:3000/api/v1/wallet/${USER_ID}/deduct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountKobo, description: 'Booking payment' })
  });
  const json = await res.json();
  if (json.success) {
    // Proceed with booking confirmation
  } else {
    showError(json.error); // "Insufficient wallet balance"
  }
}
```

---

## 4. Testing the Wallet API

```bash
# Get wallet balance (auto-creates wallet)
curl http://localhost:3000/api/v1/wallet/usr-emeka

# Top up wallet
curl -X POST http://localhost:3000/api/v1/wallet/usr-emeka/topup \
  -H "Content-Type: application/json" \
  -d '{"amountKobo": 500000, "method": "bank_transfer"}'

# View transactions
curl http://localhost:3000/api/v1/wallet/usr-emeka/transactions
```

---

## 5. Building a Wallet Frontend Page (Exercise Idea)

A standalone wallet page could include:

- **Balance card** — showing current balance in naira
- **Top-up form** — amount input + payment method selector (bank transfer, card)
- **Transaction history** — scrollable list with date, type, amount, balance after
- **Quick actions** — "Pay for last booking", "Share balance"

The API endpoints are all ready — only the HTML/CSS/JS page is missing.
