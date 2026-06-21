# 10 — Instructor Guide
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## Phase 1 Overview

Phase 1 focuses heavily on **Frontend-Backend Integration** and **Business Logic State Machines**. Students will be moving away from static HTML and learning how 3 different frontends interact with a single API.

### Design 1 — Canonical Reference
Throughout Phase 1, ensure students strictly follow the **Design 1** UI/UX language found in the `dashboards/` directory. The Traveller, Agent, and Operator apps all use distinct Design 1 themes ("Deep Roots", "Field Terminal", and "Command Centre" respectively). Do not let students deviate into generic Bootstrap or Tailwind defaults. They must implement the specific colour tokens and typography.

### Learning Objectives
1. Understand the difference between consumer-facing UI and operational/agent UI.
2. Learn how to implement a state machine (Pending → Confirmed → Cancelled) for bookings.
3. Understand cryptographic hashing for QR code security.
4. Learn how webhook-based payment systems work asynchronously.

---

## Teaching Sequence

### Session 1: The Traveller Frontend (Files 01, 02)
- **Focus:** Building the "Deep Roots" UI.
- **Gotchas:** Students often struggle with CSS Grid. Spend 15 minutes explaining how `.grid-cols-4` works in `base.css` before they build the Popular Routes section.
- **Activity:** Have them build `index.html` and `search.html`.

### Session 2: The Booking Flow & State Machine (File 03)
- **Focus:** Seat selection logic and the Redis lock concept.
- **Gotchas:** Students will try to write the seat selection logic entirely in HTML `onclick`. Force them to use Javascript event listeners in `booking.js`. 
- **Whiteboard Activity:** Draw the 14-seater bus on the board. Ask the class: *"If Emeka and Chioma both click Seat 3C at the exact same millisecond, what happens?"* Explain the concept of Race Conditions and DB locking.

### Session 3: Digital Tickets & Payments (Files 04, 05)
- **Focus:** QR Codes and Webhooks.
- **Gotchas:** Students will want to use the `bookingId` as the QR code text. Stop them immediately. Demonstrate an Insecure Direct Object Reference (IDOR) attack to show why sequential IDs are dangerous for tickets.
- **Activity:** Integrate `qrcode.js` into `ticket.html`.

### Session 4: Operations — Agents and Operators (Files 06, 07)
- **Focus:** Building the Dark Mode Agent App and Light Mode Operator Portal based on the Design 1 references.
- **Gotchas:** Ensure students understand *why* the Agent app is dark mode/monospace (glare, readability) and *why* it needs offline capabilities.
- **Activity:** Walk through the CSS `conic-gradient` trick for the donut chart. It blows their minds that it doesn't require a heavy charting library.

### Session 5: Express API & Review (File 08, 09)
- **Focus:** The Controller-Service pattern.
- **Gotchas:** Ensure students don't put business logic inside the Express router functions. Keep `routes/` clean and `services/` heavy.
- **Activity:** Run the `002_seed_routes.sql` migration and test the `GET /api/v1/routes/search` endpoint using Postman or Thunder Client.

---

## Assessment Criteria

When grading the Exercise submissions (File 09):

- **Exercise 1 (Search Filter):** Does the JS actually hide the DOM elements? Do they handle cases where multiple filters are checked?
- **Exercise 2 (Timer):** Is `setInterval` used correctly? Do they use `clearInterval` to prevent memory leaks?
- **Exercise 3 (Webhooks):** This is the hardest one. Look for `crypto.createHmac('sha512', secret).update(body).digest('hex')`.
- **Exercise 4 (Offline):** Check if they correctly parsed JSON from `localStorage` before attempting to sync it.
