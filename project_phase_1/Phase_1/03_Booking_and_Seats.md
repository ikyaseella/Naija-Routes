# 03 — Booking and Seat Selection
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## The Booking Flow

When a user selects a bus on the search results page, they enter the booking flow. This is the most complex frontend module in Phase 1. 

It consists of 3 distinct actions:
1. **Seat Selection:** Displaying available vs. booked seats.
2. **Passenger Details:** Collecting name, phone, and next of kin.
3. **Checkout/Lock:** Locking the seat so no one else can book it while the user pays.

> 🎨 **Visual Reference:** The booking page inherits the **Design 1 "Deep Roots"** palette from `dashboards/ui_traveller_design1.html`. The ticket mockup on the split section of that file shows exactly how the confirmation screen should look after booking.

---

## Step 1: The Seat Selection UI (booking.html)

We need to build a visual representation of a bus. A standard 14-seater "Danfo" (Hiace) typically has a layout like this:

```
[ Driver ]   [ Front Seat ]
[  Seat  ]   [  Seat  ]   [  Seat  ]
[  Seat  ]   [  Seat  ]   [  Seat  ]
[  Seat  ]   [  Seat  ]   [  Seat  ]
[  Seat  ]   [  Seat  ]   [  Seat  ]   [  Seat  ]
```

### The CSS for the Bus Layout (Design 1 colours)
We can use CSS Grid to create the bus layout perfectly. 

Create the file:
```powershell
New-Item -ItemType File -Path "naija-routes\apps\web\booking.html" -Force
```

In `booking.html`, we will use a grid to lay out the seats. Each seat is a `<button>` with one of three states — styled using **Design 1 tokens**:

```css
/* Seat states using Design 1 tokens */
.seat-available {
  background: var(--mist);           /* #EDF2EF — light green-grey */
  border: 1.5px solid var(--green-mid);
  color: var(--charcoal);
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s;
}
.seat-available:hover {
  background: var(--green-light);
  color: white;
}
.seat-booked {
  background: #E2E8F0;               /* grey — disabled */
  border: 1.5px solid #CBD5E0;
  color: #A0AEC0;
  cursor: not-allowed;
  border-radius: 8px;
}
.seat-selected {
  background: var(--gold);           /* #D4A017 — gold */
  border: 1.5px solid var(--gold);
  color: var(--green-deep);
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(212, 160, 23, 0.4);
}
```

### Booking Page Layout (Responsive)
```
Desktop: [ Seat Map ]  [ Booking Summary Sidebar ]
Tablet:  [ Seat Map ]  [ Booking Summary below ]
Mobile:  [ Seat Map ] → [ Summary ] → [ Form ] → stacked vertical
```

---

## Step 2: The Booking Form

Alongside the seat map, we need a form. For Naija Routes, safety is a priority, so we must collect:
- Full Name
- Phone Number (for SMS tickets)
- Next of Kin Name & Phone (in case of emergencies)

**Form field styling (Design 1):**
```css
.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: var(--charcoal);
  background: white;
  outline: none;
  transition: border-color .2s;
}
.form-input:focus {
  border-color: var(--green-mid);   /* #1B6B3A — emerald focus ring */
}
```

**Validation:**
We must validate Nigerian phone numbers. They typically start with `070`, `080`, `081`, `090`, or `091` and are 11 digits long.

```javascript
function isValidNigerianPhone(phone) {
  return /^(070|080|081|090|091)\d{8}$/.test(phone.replace(/\s/g, ''));
}
```

---

## Step 3: Seat Locking & The State Machine

As mentioned in the Concepts file, we cannot just let two people book the same seat at the exact same time. We use a **State Machine** in the backend.

### What happens when the user clicks "Proceed to Payment"?

1. **Frontend:** Reads the selected seat (`3B`) and the passenger details form.
2. **Frontend:** Calls `POST /api/v1/bookings`.
3. **Backend:** Checks Redis to see if `seat_3B` is locked.
    - If yes → Return `409 Conflict` error.
    - If no → Proceed to step 4.
4. **Backend:** Locks the seat in Redis with a Time-To-Live (TTL) of 10 minutes.
5. **Backend:** Creates a booking in PostgreSQL with `status = 'PENDING'`.
6. **Backend:** Returns the `bookingId` to the frontend.
7. **Frontend:** Receives the ID and triggers the Paystack payment modal.

---

## Step 4: The Javascript Logic (booking.js)

Create the Javascript file for the booking page:
```powershell
New-Item -ItemType File -Path "naija-routes\apps\web\js\modules\booking.js" -Force
```

This file is responsible for:
1. Fetching the current seat availability from the API when the page loads.
2. Handling the click events on the seat map (toggling the `.seat-selected` class).
3. Updating the "Booking Summary" sidebar (e.g. "1 Seat Selected: ₦12,500").
4. Handling the form submission and calling the booking API.

### Seat Selection Logic Example:

```javascript
let selectedSeat = null;

// Add click listeners to all available seats
document.querySelectorAll('.seat-available').forEach(seatBtn => {
  seatBtn.addEventListener('click', (e) => {
    // Deselect previous
    if (selectedSeat) {
      selectedSeat.classList.remove('seat-selected');
      selectedSeat.classList.add('seat-available');
    }
    
    // Select new
    selectedSeat = e.target;
    selectedSeat.classList.remove('seat-available');
    selectedSeat.classList.add('seat-selected');
    
    // Update UI — Design 1 gold text for selected seat display
    document.getElementById('summarySeatNumber').textContent = selectedSeat.dataset.seatNo;
    document.getElementById('summaryPrice').textContent = `₦${selectedSeat.dataset.price}`;
    document.getElementById('checkoutBtn').disabled = false;
  });
});
```

### Booking Summary Card (Design 1 styling)
The summary card on the right (or below on mobile) should use:
```css
.booking-summary {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
  position: sticky;
  top: 80px;   /* below the sticky nav */
}
.summary-price {
  font-family: 'Syne', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--green-mid);
  margin-bottom: 16px;
}
.checkout-btn {
  background: var(--green-mid);
  color: white;
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.checkout-btn:disabled {
  background: var(--mist);
  color: var(--slate);
  cursor: not-allowed;
}
```

---

## Next Steps
In the next lesson, we will cover what happens *after* the payment succeeds: Generating the **Digital Ticket** and QR code!

**Checkpoint:** At this stage, your `booking.html` should look like a real checkout page with an interactive seat picker. Check it against the ticket mockup visible in `dashboards/ui_traveller_design1.html` — particularly the gold selected state and the emerald action buttons.
