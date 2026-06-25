# 22 — Exercises: Cargo
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Exercise 1: Add Dynamic Pricing per Operator

The current pricing is a flat ₦200/kg. Add different pricing per operator.

**Steps:**
1. Add a `pricePerKgKobo` field to each operator in the `OPERATORS` object (e.g. `op-abc: 20000`, `op-gu001: 25000`)
2. Modify `createBooking()` to use the operator-specific rate
3. Display the rate on the booking form (e.g. "ABC Transport: ₦200/kg")
4. Test by creating bookings with different operators — prices should differ

**Expected Outcome:** Each operator has its own per-kg rate, and the price calculation reflects the selected operator.

---

### Exercise 2: Add a "My Bookings" History Page

Travellers can book cargo but have no way to see their past shipments. Add a simple bookings history.

**Steps:**
1. Add a new section to `apps/web/cargo.html` (e.g. as a 3rd tab "My Shipments")
2. Call `GET /api/v1/cargo/user/usr-emeka` to fetch mock user bookings
3. Display them as a list with waybill, route, status, and date
4. Each row should link to the track tab with the waybill pre-filled
5. Handle empty state (no bookings yet)

**Expected Outcome:** The "My Shipments" tab shows the user's cargo booking history with clickable waybills.

---

### Exercise 3: Add Estimated Delivery Date

The cargo booking form shows a travel date but no estimated delivery date. Add one.

**Steps:**
1. Add a `deliveryDate` field to the booking response in `createBooking()`
2. Set `deliveryDate = travelDate + 1 day` (most inter-city buses arrive next day)
3. Display the delivery date in the receipt/waybill result on all 3 frontend pages
4. Add a `cargo.delivery_date` i18n key to the locale files

**Expected Outcome:** Every cargo booking shows both the travel date and the estimated delivery date.

---

### Exercise 4: Add Route Validation

The booking form allows selecting the same city for origin and destination. Add validation.

**Steps:**
1. In `createBooking()`, check if `origin === destination`
2. If same, return error: "Origin and destination cannot be the same"
3. On the frontend, also disable the submit button if origin === destination
4. Show a visible warning message under the dropdowns
5. Add the error message as an i18n key

**Expected Outcome:** Users cannot book cargo with the same origin and destination — the backend rejects it and the frontend warns before submission.

---

### Exercise 5: Add Waybill Print Button

The agent cargo page shows a receipt but no print button. Add one.

**Steps:**
1. Add a "🖨 Print Waybill" button to the receipt section
2. Use `window.print()` triggered on click
3. Add print-specific CSS to hide everything except the receipt (using `@media print`)
4. Ensure the waybill number and all details are visible in print
5. Style the print view with a clean, professional look

**Expected Outcome:** Clicking "Print Waybill" opens the browser print dialog with only the receipt visible.

---

### Exercise 6: Add Status Timeline to Waybill Tracking

The track waybill result shows the current status but no history. Add a visual status timeline.

**Steps:**
1. Create a timeline component showing all 5 possible statuses as steps
2. Highlight completed steps in green, current step in gold, future steps in gray
3. Connect steps with a line
4. Show the date/time each status was reached (use `createdAt` and `updatedAt`)
5. Style it for both the web (dark) and operator (light) themes

**Expected Outcome:** The waybill tracking result shows a clear visual timeline of the shipment's journey through all status stages.

---

### Exercise 7: Add SMS Notification Placeholder

When a booking status changes, the system should notify the recipient. Add a placeholder for SMS notification.

**Steps:**
1. In `updateStatus()`, add a `console.log()` message that simulates sending an SMS
2. Format the log: `[SMS to {recipientPhone}] Your shipment {waybillNo} is now {status}`
3. On the operator page, after a status update, show a brief "SMS notification sent" indicator (e.g. a green checkmark that fades after 3 seconds)
4. Add the text as an i18n key `cargo.sms_notified`

**Expected Outcome:** The console logs an SMS notification on status change, and the operator sees visual feedback that the recipient was notified.

---

### Exercise 8: Full Audit

Pick one cargo page (agent, traveller, or operator) and audit it against these criteria:

**Checklist:**
- [ ] All static labels have `data-i18n` attributes
- [ ] Form validation works (empty fields, invalid weight, same city)
- [ ] API calls succeed and errors are displayed gracefully
- [ ] Waybill displays correctly after creation
- [ ] Status updates work correctly on the operator page
- [ ] Status filter and search work together
- [ ] All `cargo.*` keys exist in all 5 locale files
- [ ] Language switcher works on the cargo page
- [ ] Mobile responsive (form adapts to small screens)

**Steps:**
1. Open the cargo page in the browser
2. Create a valid booking — verify waybill receipt
3. Try creating with invalid data — verify error handling
4. Track a known waybill — verify details display
5. Switch languages and verify all cargo text translates
6. Open on a mobile viewport and check layout

**Expected Outcome:** A complete audit report with any issues found and fixes applied.

---

**Submission:** Submit your modified files as a pull request or ZIP to the instructor portal.
