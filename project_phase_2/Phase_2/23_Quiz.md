# 23 — Quiz: Cargo
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Question 1
What table stores cargo bookings in the database?

- a) `shipments`
- b) `cargo_bookings` ✓
- c) `waybills`
- d) `freight`

---

### Question 2
What is the waybill number format?

- a) `NR-XXXXXXXX`
- b) `NR-YYYYMMDD-XXXX` ✓
- c) `CGO-YYYYMMDD-XXXX`
- d) `WAY-XXXXXXXX`

---

### Question 3
True or False: The current cargo pricing is different for each operator.

**Answer:** False. It's a flat ₦200/kg for all operators. Dynamic pricing is an exercise.

---

### Question 4
Which endpoint is used for public waybill tracking?

- a) `GET /api/v1/cargo/waybill/:waybillNo` ✓
- b) `GET /api/v1/cargo/track/:waybillNo`
- c) `POST /api/v1/cargo/track`
- d) `GET /api/v1/cargo/:id`

---

### Question 5
What 5 statuses can a cargo booking have?

- a) Open, Shipped, Transit, Arrived, Closed
- b) Pending, Confirmed, In Transit, Delivered, Cancelled ✓
- c) Created, Paid, Dispatched, Received, Returned
- d) New, Active, Moving, Complete, Void

---

### Question 6
True or False: A booking can transition from "delivered" to "cancelled".

**Answer:** False. Cancelled can only happen before delivery.

---

### Question 7
How is the cargo price calculated?

- a) Fixed rate per route
- b) Weight in kg × ₦200/kg ✓
- c) Distance × weight × rate
- d) Operator sets a custom price

---

### Question 8
Which three frontend apps have cargo pages?

- a) Web, Agent, Operator ✓
- b) Web, Admin, Operator
- c) Agent, Admin, Web
- d) Agent, Operator, Admin

---

### Question 9
True or False: Recipient name and phone are optional when creating a cargo booking.

**Answer:** False. Both are required for delivery coordination.

---

### Question 10
What does the `PATCH /api/v1/cargo/:id/status` endpoint do?

- a) Deletes a booking
- b) Updates the booking's status ✓
- c) Changes the recipient
- d) Cancels the waybill permanently

---

### Question 11
What information is shown on the agent's waybill receipt after creation?

- a) Only the waybill number
- b) All booking details: waybill, shipper, route, weight, description, recipient, price, status ✓
- c) Price and waybill number only
- d) Origin, destination, and travel date only

---

### Question 12
What is the maximum allowed weight for a cargo booking?

- a) 100 kg
- b) 500 kg ✓
- c) 1000 kg
- d) 50 kg
