# 08 — Wallet & Payments: Backend
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. What We Are Building

The Wallet is a **digital balance** that users can top up and use to pay for bookings. No need to enter card details for every trip. Operators also receive payouts to their wallet.

---

## 2. Database Schema (`004_wallet_schema.sql`)

Two tables:

```
wallets
  id, user_id UUID UNIQUE, balance_kobo (default 0),
  created_at, updated_at

wallet_transactions
  id, wallet_id → wallets.id, type (credit/debit),
  amount_kobo, balance_before_kobo, balance_after_kobo,
  reference, description, method (bank_transfer/card/payout),
  created_at
```

Plus a helper function:

```sql
CREATE OR REPLACE FUNCTION ensure_wallet(p_user_id UUID)
RETURNS SETOF wallets AS $$
  INSERT INTO wallets (user_id, balance_kobo)
  VALUES (p_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING *;
$$ LANGUAGE sql;
```

Key design features:
- **Immutable transaction log** — `wallet_transactions` is insert-only, no updates or deletes. This creates an audit trail.
- **Helper function** — `ensure_wallet()` creates a wallet on first access if it doesn't exist.
- **Computed balance** — the service reads `balance_kobo` directly from the `wallets` table, avoiding the need to sum transactions every time.

---

## 3. The Wallet Service (`wallet.service.js`)

| Method | Purpose |
|---|---|
| `getWallet(userId)` | Get wallet balance (creates wallet if missing) |
| `topUp(userId, amountKobo, method)` | Credit wallet + record transaction |
| `deduct(userId, amountKobo, description)` | Debit wallet (validates sufficient balance) |
| `getTransactions(userId)` | List user's transaction history |
| `getAllTransactions(limit)` | List all transactions (admin) |

### Top-Up Flow

```javascript
static async topUp(userId, amountKobo, method) {
  // 1. Ensure wallet exists
  const wallet = await this.getWallet(userId);

  // 2. Calculate new balance
  const newBalance = wallet.balance_kobo + amountKobo;

  // 3. Update wallet balance
  await supabaseAdmin.from('wallets')
    .update({ balance_kobo: newBalance })
    .eq('user_id', userId);

  // 4. Record immutable transaction
  await supabaseAdmin.from('wallet_transactions').insert({
    wallet_id: wallet.id,
    type: 'credit',
    amount_kobo: amountKobo,
    balance_before_kobo: wallet.balance_kobo,
    balance_after_kobo: newBalance,
    reference: 'txn-' + Date.now(),
    description: `Top-up via ${method}`,
    method
  });

  return { balance_kobo: newBalance };
}
```

### Deduct Flow

```javascript
static async deduct(userId, amountKobo, description) {
  const wallet = await this.getWallet(userId);

  if (wallet.balance_kobo < amountKobo) {
    throw new Error('Insufficient wallet balance');
  }

  // ... similar to topUp but with type: 'debit'
}
```

---

## 4. The Wallet Routes (`wallet.routes.js`)

| Method | Path | Description |
|---|---|---|
| GET | `/:userId` | Get wallet balance |
| POST | `/:userId/topup` | Top up wallet |
| GET | `/:userId/transactions` | List user's transactions |
| GET | `/` | Admin list all (returns 501 — not yet implemented) |

---

## 5. Registration in `app.js`

```javascript
import walletRouter from './routes/wallet.routes.js';
app.use('/api/v1/wallet', walletRouter);
```

---

## 6. Key Design Decisions

1. **Balance as a column, not computed** — `wallets.balance_kobo` is updated directly rather than summing transactions. This is simpler and faster for reads, but requires careful transaction handling.
2. **Immutable audit trail** — transactions are never modified or deleted. If a refund is needed, a new credit transaction is created.
3. **Kobo throughout** — all amounts stored as kobo (1 Naira = 100 kobo). Display divides by 100.
4. **Auto-creation** — `getWallet()` creates a wallet if one doesn't exist (`ensure_wallet` pattern), so no separate "create wallet" step is needed.
5. **No frontend page** — wallet is accessed through the USSD menu (option 4) or the checkout flow in `booking.js`. A standalone wallet page is left as an exercise.
