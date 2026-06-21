# 09 — Exercises
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## Phase 1 Assessment

Complete the following exercises to demonstrate your understanding of the Phase 1 frontend and API integration concepts.

### Exercise 1: Advanced Search Filtering
Currently, the `search.html` page displays hardcoded results. 
**Task:** Write Javascript in `search.js` that:
1. Reads the state of the "Amenities" checkboxes (e.g. Air Conditioning).
2. Filters the displayed results on the page to only show operators that have that amenity.
*Hint: Add a `data-amenities="ac,usb"` attribute to the HTML cards to make filtering easier.*

### Exercise 2: Implementing the 10-Minute Seat Lock
In `booking.html`, when a user selects a seat and clicks "Proceed to Payment", they should only have 10 minutes to complete the checkout before the seat is released.
**Task:** 
1. Create a 10:00 countdown timer in `ticket.html` (or a mock payment page).
2. When the timer hits 00:00, show an alert saying "Session expired" and redirect them back to `search.html`.

### Exercise 3: Webhook Verification
In `05_Payment_Integration.md`, we discussed how Paystack sends a Webhook to confirm payment. However, anyone could send a POST request to your `/webhooks/paystack` URL and pretend to be Paystack!
**Task:** 
1. Read the Paystack documentation on "Verifying Webhooks".
2. Write a Node.js Express middleware function using the `crypto` library that verifies the `x-paystack-signature` header against your secret key.

### Exercise 4: Offline Sale Syncing
In `06_Agent_App.md`, we discussed the agent app's offline capabilities.
**Task:**
1. In `sell.js`, modify the script to use `localStorage` to save the ticket sale data if `navigator.onLine` is false.
2. Add an event listener to the `window` for the `'online'` event. When the internet comes back, `console.log` all the pending sales stored in `localStorage` and then clear them.

---

**Submission:** Submit a link to your GitHub repository or ZIP file containing the modified HTML/JS files to the instructor portal.
