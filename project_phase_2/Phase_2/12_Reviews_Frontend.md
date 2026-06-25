# 12 — Reviews & Ratings: Traveller Review Prompt
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. Where Reviews Appear

After a passenger completes their booking and sees their ticket, they are prompted to rate their journey. This prompt appears at the bottom of the **ticket page** (`apps/web/ticket.html`), below the action buttons and help text.

The flow:
1. Passenger completes payment → sees the ticket page
2. At the bottom of the page, a **"Rate your journey"** card appears
3. Passenger clicks stars (1-5) to rate
4. A form slides open with a text area for optional written review
5. Passenger submits → sees a thank-you message

---

## 2. The HTML Structure

The review prompt is a styled card inside the ticket page:

```html
<div class="review-prompt">
  <div data-i18n="review.rate_your_journey">Rate your journey</div>

  <!-- Star buttons -->
  <div>
    <span class="star-btn" data-rating="1">★</span>
    <span class="star-btn" data-rating="2">★</span>
    <span class="star-btn" data-rating="3">★</span>
    <span class="star-btn" data-rating="4">★</span>
    <span class="star-btn" data-rating="5">★</span>
  </div>

  <!-- Review form (hidden initially) -->
  <div id="reviewForm" style="display:none;">
    <textarea id="reviewBody" data-i18n-placeholder="review.review_placeholder"></textarea>
    <button onclick="submitReview()" data-i18n="review.submit_review">Submit Review</button>
    <button onclick="dismissReview()" data-i18n="review.remind_later">Remind later</button>
  </div>

  <!-- Thank-you message (hidden initially) -->
  <div id="reviewThanks" style="display:none;" data-i18n="review.thanks">
    Thank you for your review!
  </div>
</div>
```

**Design choices:**
- The star buttons are plain `<span>` elements (not radio buttons) for simple click handling
- The form and thank-you message start hidden (`display:none`) and are toggled by JavaScript
- `data-i18n-placeholder` is used on the textarea for the placeholder text (a custom extension of our i18n system)

---

## 3. The JavaScript Behavior

At the bottom of the ticket page, after the i18n scripts, we add review handling:

```javascript
let selectedRating = 0;

document.querySelectorAll('.star-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRating = parseInt(btn.dataset.rating);

    // Highlight selected stars
    document.querySelectorAll('.star-btn').forEach((s, i) => {
      s.style.color = i < selectedRating ? '#F59E0B' : '#D1D5DB';
    });

    // Show the review form
    document.getElementById('reviewForm').style.display = 'block';
  });
});

function submitReview() {
  const body = document.getElementById('reviewBody').value;
  console.log(`[Review] Rating: ${selectedRating}/5, Comment: "${body}"`);
  // Phase 3: POST to /api/v1/reviews
  document.getElementById('reviewForm').style.display = 'none';
  document.getElementById('reviewThanks').style.display = 'block';
}

function dismissReview() {
  document.getElementById('reviewForm').style.display = 'none';
  document.getElementById('reviewThanks').style.display = 'block';
}
```

**Three user interactions:**
1. **Click a star** — rating is captured, stars are highlighted, form slides open
2. **Submit Review** — logs the review to console (in Phase 3, this sends a POST request to the API)
3. **Remind later** — hides the form and shows thank-you (so it doesn't reappear on every visit)

---

## 4. i18n Translation Keys

All review text is translatable. The keys are defined in all 5 locale files under the `"review"` section:

| Key | English Value |
|---|---|
| `review.rate_your_journey` | Rate your journey |
| `review.review_placeholder` | Tell others about your experience... |
| `review.submit_review` | Submit Review |
| `review.thanks` | Thank you for your review! |
| `review.remind_later` | Remind later |
| `review.already_rated` | You have already rated this trip |

These keys follow the same pattern as the i18n system built earlier — `data-i18n` attributes in HTML, and `I18N.t()` would be used for dynamic strings.

---

## 5. Mock Data on the Ticket Page

The ticket page uses URL parameters to populate dynamic data:

```
ticket.html?seat=3C&name=Emeka&price=12500&operator=GUO+Transport
```

This allows testing with different scenarios without needing a full booking flow. The review prompt reads the same URL parameters but doesn't currently send them — that will be added in Phase 3 when we connect to the API.

---

## 6. Future API Integration

In Phase 3, the `submitReview()` function will be updated to:

```javascript
async function submitReview() {
  const response = await fetch('/api/v1/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.id,
      bookingId: currentBooking.id,
      operatorId: currentOperator.id,
      ratings: {
        operator: selectedRating,
        driver: driverRating,
        vehicle: vehicleRating,
        punctuality: punctualityRating
      },
      body: document.getElementById('reviewBody').value
    })
  });
  // Handle success/error...
}
```

The architecture is designed so that **only `submitReview()` changes** — the HTML and star interaction code remain exactly the same.

---

> 💡 **Key Insight:** The review prompt is built as a progressive enhancement. It works today with just client-side JavaScript and console logging. When the API is ready, only the `submitReview` function needs updating — the UI stays identical.
