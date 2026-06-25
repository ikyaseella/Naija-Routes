# 15 — Quiz: Reviews & Ratings
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Question 1
What are the 4 rating dimensions in the reviews system?

- a) Price, Comfort, Speed, Safety
- b) Operator, Driver, Vehicle, Punctuality ✓
- c) Service, Cleanliness, Food, Entertainment
- d) Booking, Payment, Boarding, Arrival

---

### Question 2
Which HTTP endpoint submits a new review?

- a) `GET /api/v1/reviews`
- b) `POST /api/v1/reviews` ✓
- c) `PUT /api/v1/reviews`
- d) `DELETE /api/v1/reviews`

---

### Question 3
True or False: The `review.service.js` methods currently use a real database.

**Answer:** False. They return mock data. Real database queries will be added in Phase 3.

---

### Question 4
What happens when a traveller clicks a star on the ticket page?

Fill in the blank: The stars highlight in gold, and the `______` div becomes visible.

**Answer:** `reviewForm`

---

### Question 5
Where do the mock review passenger names come from?

- a) The `users` table in the database
- b) Hardcoded sample reviews in `review.service.js` ✓
- c) The `bookings` table
- d) A third-party API

---

### Question 6
True or False: All 5 locale files must have the `review.*` translation keys.

**Answer:** True. The i18n system requires matching keys across all locale files. Missing keys fall back to English.

---

### Question 7
What is the purpose of the `data-i18n-placeholder` attribute on the textarea?

- a) To set the textarea's value
- b) To translate the placeholder text when the language changes ✓
- c) To hide the textarea in certain languages
- d) To resize the textarea automatically

---

### Question 8
How many mock reviews does `getOperatorReviews()` return?

- a) 1
- b) 3 ✓
- c) 5
- d) 10

---

### Question 9
True or False: The operator reviews page currently renders reviews dynamically from the API using JavaScript.

**Answer:** False. The reviews are hardcoded in the HTML. Dynamic rendering from the API will be added in Phase 3.

---

### Question 10
What is the correct sequence when a user submits a review?

1. → Click star → Select rating
2. → Form appears → Type optional comment
3. → Click submit → Review is logged to console
4. → Form hides → Thank-you message shows

Which step currently connects to the backend API?

**Answer:** None. Currently the review is only logged to `console.log`. Backend integration comes in Phase 3.
