# 13 — Reviews & Ratings: Operator Portal Dashboard
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. The Operator Reviews Page

Operators need to see what passengers are saying about their service. A new page — `apps/operator/reviews.html` — provides a dedicated reviews dashboard with:

- **Rating summary cards** — Overall rating, total reviews, vehicle condition, punctuality
- **Review cards** — Individual reviews with passenger name, date, star ratings, and body text
- **Sidebar integration** — A "Reviews" link in the main navigation

This page follows the same layout and styling as the existing operator pages (`index.html`, `bookings.html`, `routes.html`).

---

## 2. Page Structure

### Rating Summary Section

Top of the page shows 4 key metrics in a 2×2 grid:

```
┌──────────────┬──────────────┐
│   4.7 ★★★★★  │     128      │
│ Overall Rating│  Total Reviews│
├──────────────┼──────────────┤
│   4.8        │     4.2      │
│ Vehicle Cond. │  Punctuality  │
└──────────────┴──────────────┘
```

Each stat card is a simple `<div>` with a large number and a label. The stars use inline CSS color (`#F59E0B`) to match the brand's gold accent.

### Review Cards Section

Below the summary, individual reviews are displayed as cards:

```
┌─────────────────────────────────────────┐
│  Emeka Okonkwo          ★★★★★           │
│  Posted on Dec 20, 2025                  │
│                                          │
│  Operator: 5  Driver: 4  Vehicle: 5  ...│
│                                          │
│  Very comfortable bus. AC was working    │
│  perfectly and we arrived on time.       │
└─────────────────────────────────────────┘
```

Each review card shows:
- **Author name** — hardcoded in mock data (will come from `users` table in Phase 3)
- **Date** — formatted date string
- **Star rating** — overall operator rating represented as filled/empty stars
- **Stat chips** — 4 dimension ratings displayed as colored badges (green for ≥4, gray otherwise)
- **Review body** — free-text review

---

## 3. Sidebar Navigation

Every operator page (index, bookings, routes, reviews) has a consistent sidebar. The Reviews link was updated from a placeholder `#` to point to `reviews.html`:

```html
<!-- Before -->
<a href="#" class="nav-item">
  <span class="nav-icon">⭐</span>
  <span data-i18n="nav.reviews">Reviews</span>
</a>

<!-- After -->
<a href="reviews.html" class="nav-item">
  <span class="nav-icon">⭐</span>
  <span data-i18n="nav.reviews">Reviews</span>
</a>
```

The same change was applied to all 4 operator HTML files (`index.html`, `bookings.html`, `routes.html`, and `reviews.html` itself where it's marked `active`).

---

## 4. Mock Data Integration

The reviews page currently uses hardcoded HTML for 3 sample reviews. In Phase 3, this will be replaced with dynamic rendering from the API:

```javascript
// Future Phase 3 code:
async function loadReviews() {
  const res = await fetch(`/api/v1/reviews/operator/${operatorId}`);
  const data = await res.json();

  // Render averages
  renderRatingSummary(data.averages);

  // Render review cards
  data.reviews.forEach(review => renderReviewCard(review));
}
```

For now, the 3 mock reviews serve as:
1. A visual reference for what the final UI will look like
2. A template for the JavaScript rendering function in Phase 3
3. Static content that works even without the backend running

---

## 5. i18n Support

All labels on the reviews page use the i18n system. Keys used:

| data-i18n | English |
|---|---|
| `review.reviews_title` | Reviews |
| `review.overall_rating` | Overall Rating |
| `review.total_reviews` | {count} reviews |
| `review.rate_vehicle` | Vehicle Condition |
| `review.rate_punctuality` | Punctuality |
| `review.posted_on` | Posted on {date} |
| `review.rate_operator` | Operator: 5 |
| `review.rate_driver` | Driver: 4 |
| `nav.reviews` | Reviews |
| `nav.dashboard` | Dashboard |
| `nav.bookings` | Bookings |

---

## 6. Styling

The review-specific CSS is inline in `<style>` tags at the top of `reviews.html`:

```css
.review-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
}

.rating-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.rating-stat .big {
  font-size: 32px;
  font-weight: 800;
  color: #1B6B3A;
}

.stat-chip.good {
  background: #D1FAE5;
  color: #065F46;
}
```

These classes follow the same design tokens used throughout the operator portal (`var(--white)`, `var(--border)`, `var(--slate)`).

---

> 💡 **Key Insight:** The operator reviews page is intentionally simple — it's a read-only dashboard. The complexity lives on the traveller side (the rating form). On the operator side, we just fetch and display data. This separation of concerns keeps each page focused on a single job.
