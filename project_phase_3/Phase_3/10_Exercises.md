# 10 — Phase 3 Exercises
**Naija Routes · Instructor-Led Project · Phase 3**

---

## Part A: Corporate Travel Portal

### Exercise 1: Add a New Corporate

Create a script or curl command to add a new corporate account. What fields are required? What SQL would you write to seed a new corporate with departments, employees, and a policy?

### Exercise 2: Policy Enforcement Test

1. Create a corporate policy with `max_price_per_booking_kobo = 200000` (₦2,000)
2. Try to book 3 seats at ₦9,500 each (total = ₦28,500)
3. What happens? Try booking 1 seat at ₦9,500 (total = ₦9,500)
4. What's the status of each booking?

### Exercise 3: Corporate Frontend

Add a new tab to `corporate.html` called "Analytics" that shows:
- Bookings over time (by month)
- Most popular routes
- Total spend per department
- Use Chart.js or inline SVG for the visualizations

---

## Part B: USSD Interface

### Exercise 4: Extend the USSD Menu

Add a new option to the main menu: "6. Promotions". When the user selects it, show a list of current promotions (e.g., "Lagos-Abuja 20% off"). Use mock data for now.

### Exercise 5: Real Wallet Integration

Replace the mock "Wallet Balance" in the USSD service with a real call to `WalletService.getWallet()`. The user's `msisdn` needs to be mapped to a `user_id` — add a simple phone-to-user lookup table or mock mapping.

### Exercise 6: USSD Session Persistence

Design a `ussd_sessions` database table and write the migration SQL. What columns would you need? How would you modify `UssdService` to use the database instead of in-memory storage?

---

## Part C: Insurance Integration

### Exercise 7: Checkout Upsell

In `booking.html` (or `booking.js`), add an insurance upsell step after the user selects their seats but before payment:

> "Protect your trip! Add travel insurance for just ₦1,500"
> [Add Insurance] [Skip]

When the user clicks "Add Insurance", call `POST /api/v1/insurance/purchase` with the booking ID.

### Exercise 8: Claims Admin Dashboard

Add an admin view (or tab in `insurance.html`) that lists ALL claims across all users, with the ability to change claim status (pending → review → approved/rejected).

### Exercise 9: Insurance at Corporate Level

Extend the corporate bulk booking form to include an "Add insurance for all passengers" checkbox. When checked, purchase insurance for each passenger after the booking is created.

---

## Part D: Wallet & Payments

### Exercise 10: Build a Wallet Frontend Page

Create `wallet.html` with:
- Current balance display
- Top-up form (amount + method selector)
- Transaction history table
- Quick top-up amounts (₦1,000, ₦5,000, ₦10,000, ₦20,000)

All data must come from the live API endpoints.

### Exercise 11: Auto-Top-Up

Add a feature to the wallet service: when a deduct fails due to insufficient balance, automatically top up the wallet with a minimum amount (e.g., ₦5,000) and retry the deduction. Return a response indicating the auto-top-up occurred.

### Exercise 12: Payouts to Operators

Design a payout flow:
1. Admin views all outstanding operator payouts
2. Admin triggers a batch payout
3. Each operator's wallet is credited

What new tables would you need? What endpoints? How would you prevent double-payouts?

---

## Integration Exercises

### Exercise 13: End-to-End Corporate Booking + Insurance

Write a test script that:
1. Lists corporates and picks one
2. Fetches its departments and employees
3. Creates a bulk booking
4. Purchases insurance for that booking
5. Files a claim on the insurance
6. Verifies the claim status

### Exercise 14: USSD → Corporate Booking

Design how a corporate employee could book travel through USSD:
- Dial `*347#` → Corporate menu (with corporate ID lookup by phone number)
- Department selection → Employee verification → Route → Seats → Confirm
- The booking goes through policy enforcement on the backend

What changes would be needed to the USSD service?

---

## Stretch Goals

### Exercise 15: WhatsApp Bot (Conceptual)

Design the architecture for a WhatsApp booking bot:
- How would the Twilio/Business API webhook work?
- Which existing services could it reuse (search, booking, tracking)?
- What new service would be needed for conversation management?
- How would the menu tree differ from USSD?

### Exercise 16: Database Migration for USSD

Write `005_ussd_schema.sql` with:
- `ussd_sessions` table (session_id, msisdn, menu, language, created_at, updated_at)
- `ussd_interactions` table (session_id, input, response, created_at)
- Indexes for fast session lookup by `session_id` and `msisdn`
- Comparison with the current in-memory approach
