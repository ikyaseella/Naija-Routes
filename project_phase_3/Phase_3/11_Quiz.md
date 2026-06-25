# 11 — Phase 3 Quiz
**Naija Routes · Instructor-Led Project · Phase 3**

---

## Instructions

Answer the following questions. Each question has one correct answer unless stated otherwise.

---

### Section 1: Corporate Travel Portal

**Q1.** What determines whether a corporate booking is auto-approved or goes to `pending_approval`?

- A) The number of seats
- B) Whether `total_kobo > policy.requires_approval_above_kobo`
- C) The employee's role
- D) The department manager's preference

**Q2.** How are monetary values stored in the corporate tables?

- A) As DECIMAL(10,2) in naira
- B) As INTEGER (kobo)
- C) As VARCHAR with currency symbol
- D) As FLOAT

**Q3.** What does the `GET /api/v1/corporate/{id}/dashboard` endpoint return?

- A) Just the corporate name and status
- B) Summary metrics + recent bookings + unpaid invoice
- C) All employees and their booking history
- D) A list of all corporate policies

**Q4.** True or False: When a booking exceeds the policy's `max_price_per_booking_kobo`, the system rejects it entirely with a 400 error.

**Q5.** Which HTTP method is used to approve a pending corporate booking?

- A) GET
- B) POST
- C) PATCH
- D) PUT

---

### Section 2: USSD Interface

**Q6.** What does the `CON` prefix in a USSD response mean?

- A) The session is connected and continuing
- B) The session is ended
- C) There was an error
- D) The user needs to confirm

**Q7.** How are USSD sessions currently stored?

- A) In a PostgreSQL table
- B) In Redis
- C) In-memory on the server (static class property)
- D) In a JSON file

**Q8.** What input triggers a "new session" in the USSD webhook handler?

- A) `input: "new"`
- B) `input: ""` (empty string)
- C) `input: "0"`
- D) `input: "*347#"`

**Q9.** Which HTTP endpoint does the USSD frontend simulator call?

- A) `GET /api/v1/ussd/simulate`
- B) `POST /api/v1/ussd/webhook`
- C) `GET /api/v1/ussd/sessions`
- D) `POST /api/v1/ussd/sessions`

**Q10.** What is a key limitation of the current USSD implementation?

- A) It doesn't support Pidgin
- B) Sessions are lost on server restart
- C) It only works with MTN
- D) It can't handle more than 5 menu options

---

### Section 3: Insurance Integration

**Q11.** Which table links an insurance purchase to a booking?

- A) `insurance_providers`
- B) `insurance_plans`
- C) `insurance_purchases` (has a `booking_id` column)
- D) `insurance_claims`

**Q12.** What is the default status when a claim is first filed?

- A) Approved
- B) Review
- C) Pending
- D) Active

**Q13.** How many insurance providers are seeded in the migration?

- A) 1
- B) 2
- C) 3
- D) 4

**Q14.** What data type is used for the `coverage_details` column in `insurance_plans`?

- A) TEXT
- B) JSONB
- C) VARCHAR(500)
- D) ARRAY

**Q15.** True or False: The insurance frontend page has a dedicated JS module file in `js/modules/`.

---

### Section 4: Wallet & Payments

**Q16.** What happens if you call `getWallet()` for a user who doesn't have a wallet yet?

- A) It returns an error
- B) It creates a wallet with 0 balance
- C) It returns null
- D) It throws an exception

**Q17.** What type of column is `wallet_transactions`?

- A) Updateable — transactions can be edited for corrections
- B) Immutable — insert-only, no updates
- C) Temporary — deleted after 30 days
- D) Volatile — recalculated on each read

**Q18.** If a wallet has balance 100000 (kobo) and you try to deduct 200000 (kobo), what happens?

- A) The wallet goes negative
- B) The deduct succeeds with a warning
- C) The service throws "Insufficient wallet balance"
- D) The service auto-top-ups the wallet

**Q19.** How does the `ensure_wallet()` helper function work?

- A) It checks if a wallet exists and creates one if not (ON CONFLICT DO NOTHING)
- B) It deletes and recreates the wallet
- C) It updates the wallet balance to zero
- D) It sends a notification to the user

**Q20.** True or False: There is a standalone `wallet.html` page in `apps/web/`.

---

### Answer Key

| Q | Answer | Explanation |
|---|---|---|
| 1 | B | `status = totalKobo > policy.requires_approval_above_kobo ? 'pending_approval' : 'booked'` |
| 2 | B | All monetary values stored as INTEGER (kobo). Divide by 100 for display. |
| 3 | B | Returns `{ corporate, summary, recentBookings, invoice }` |
| 4 | True | The service throws an error which the route catches and returns as a 400. |
| 5 | C | `PATCH /api/v1/corporate/bookings/:id/approve` |
| 6 | A | `CON` = session continues; `END` = session terminates. |
| 7 | C | Stored in a static `UssdService.sessions = {}` object. |
| 8 | B | When `sessionId` is not found in the sessions map, a new session is created. |
| 9 | B | The simulator calls `POST /api/v1/ussd/webhook`, the same endpoint a real USSD gateway would hit. |
| 10 | B | In-memory sessions are lost on restart. A database or Redis would be needed for production. |
| 11 | C | `insurance_purchases` has a `booking_id` foreign key. |
| 12 | C | Claims start with status `'pending'`. |
| 13 | B | AXA Mansard and Leadway Assurance. |
| 14 | B | `coverage_details` is JSONB — flexible for different plan types. |
| 15 | False | The JS logic is inline in `insurance.html`. |
| 16 | B | `getWallet` calls `ensure_wallet` which creates a wallet with 0 balance on first access. |
| 17 | B | Immutable — insert-only audit trail. |
| 18 | C | The `deduct` method checks `if (balance < amountKobo) throw new Error(...)` |
| 19 | A | Uses `ON CONFLICT (user_id) DO NOTHING` — creates if missing, does nothing if exists. |
| 20 | False | No `wallet.html` exists. Wallet is accessed via USSD and checkout. |
