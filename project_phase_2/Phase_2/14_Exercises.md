# 14 — Exercises: Reviews & Ratings
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Exercise 1: Add a Review Endpoint

Add a new endpoint `GET /api/v1/reviews/operator/:id/recent` that returns only the 2 most recent reviews.

**Steps:**
1. Add a new route in `review.routes.js` with path `/operator/:operatorId/recent`
2. Add a new method `getRecentReviews(operatorId, limit = 2)` in `review.service.js`
3. Return only the 2 most recent reviews (sort by `createdAt` descending)
4. Test with `curl http://localhost:3000/api/v1/reviews/operator/op-abc/recent`

**Expected Outcome:** A new endpoint returns only the 2 most recent reviews from the mock data.

---

### Exercise 2: Add Driver Rating to the Traveller Prompt

The traveller rating widget currently only captures a single "operator" star rating. Add a second set of 5 stars for driver rating.

**Steps:**
1. Add a label "Rate the driver" (use key `review.rate_driver`) before a new row of 5 stars
2. Give the new stars `data-rating-driver="1..5"` attributes
3. Create a `selectedDriverRating` variable in the JS
4. Update the star click handler to handle both sets
5. Update `submitReview()` to log both ratings

**Expected Outcome:** The review prompt has two star rows — one for operator, one for driver. Both ratings are logged on submit.

---

### Exercise 3: Average Rating Calculation

The current `getOperatorAverageRating` returns hardcoded values. Replace it with a real calculation based on the mock data.

**Steps:**
1. In `review.service.js`, read the mock reviews array inside `getOperatorAverageRating`
2. Calculate the real average for each dimension across all reviews
3. Compute `overall` as the mean of all 4 dimension averages
4. Set `totalReviews` to the length of the mock array
5. Verify the output changes when you add/remove a review from the mock array

**Expected Outcome:** The averages endpoint returns mathematically correct values based on the actual mock data.

---

### Exercise 4: Add a "No Reviews" State

The operator reviews page currently shows 3 hardcoded reviews. Modify it to handle the empty state.

**Steps:**
1. In `review.service.js`, add an empty mock array option (e.g. if `operatorId === 'op-empty'`)
2. In `reviews.html`, add JavaScript that checks if reviews exist
3. If no reviews, show a "No reviews yet" message instead of the review cards
4. Use the i18n key `review.no_reviews` for the message
5. Verify by navigating to `/api/v1/reviews/operator/op-empty`

**Expected Outcome:** When there are no reviews, the operator page shows an appropriate empty state with the translated message.

---

### Exercise 5: Star Display Helper

Create a reusable function `renderStars(rating)` that returns a string of filled/empty stars.

**Steps:**
1. Write function: given `rating` (1-5), return "★★★★★" with filled/empty stars
2. Example: `renderStars(4)` → "★★★★☆"
3. Test in browser console with different values (1-5)
4. Use the function to display stars on the operator reviews page

**Expected Outcome:** A helper function generates the correct visual star string for any rating value.

---

### Exercise 6: Validation in the Review Form

The traveller review form allows submitting without clicking any stars. Add validation.

**Steps:**
1. In `submitReview()`, check if `selectedRating > 0` before proceeding
2. If no rating selected, show an alert or inline error message: "Please select a rating first"
3. Use `data-i18n="review.select_rating_first"` on an error message div (you'll need to add this key to the locale files)
4. Hide the error message after the user clicks a star

**Expected Outcome:** The user cannot submit a review without selecting at least a star rating, and gets clear feedback.

---

### Exercise 7: Add Timestamps to Reviews

The review cards on the operator page show "Posted on Dec 20, 2025". Make the date formatting dynamic.

**Steps:**
1. Add a `formatDate(dateString)` function that converts ISO dates to readable format
2. Use `new Date(dateString).toLocaleDateString('en-NG', {...})` for Nigerian locale formatting
3. Replace the hardcoded dates in the mock reviews with calls to `formatDate()`
4. Test with different dates in the mock data

**Expected Outcome:** The date formatting uses the Nigerian locale and works with any valid ISO date string.

---

### Exercise 8: Full Audit

Pick one operator page (e.g. `reviews.html`) and audit it against these criteria:

**Checklist:**
- [ ] All static labels have `data-i18n` attributes
- [ ] Star ratings display correctly for different values
- [ ] Averages match the mock data values
- [ ] Sidebar navigation is consistent with other operator pages
- [ ] Page works without the backend (static mock content is visible)
- [ ] Language switcher works on the reviews page
- [ ] All `review.*` keys exist in all 5 locale files

**Steps:**
1. Open the operator reviews page in the browser
2. Inspect each element for i18n completeness
3. Switch languages and verify translations
4. Test without the backend running (static content should be visible)
5. Document any issues found

**Expected Outcome:** A complete audit report with any issues found and fixes applied.

---

**Submission:** Submit your modified files as a pull request or ZIP to the instructor portal.
