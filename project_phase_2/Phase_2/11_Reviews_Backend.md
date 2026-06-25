# 11 — Reviews & Ratings: Backend API
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. What We Are Building

Ratings & Reviews is the second major feature in Phase 2: Core Growth. After every trip, passengers can rate their experience and leave a review. Operators see this feedback and use it to improve their service.

The architecture follows the same pattern as Phase 1 services:
- A **service** module contains the business logic (mock data for now, real DB queries later)
- A **routes** module defines the HTTP endpoints
- The router is registered in `app.js` using the Phase 2 import pattern

---

## 2. The Review Schema

The database already has a `reviews` table (table 12 in `001_initial_schema.sql`):

```
reviews
├── id              UUID PRIMARY KEY
├── user_id         UUID → users.id
├── booking_id      UUID → bookings.id
├── operator_id     UUID → operators.id
├── operator_rating INT  (1-5)
├── driver_rating   INT  (1-5, nullable)
├── vehicle_rating  INT  (1-5, nullable)
├── punctuality_rating INT (1-5, nullable)
├── body            TEXT (optional review text)
├── is_visible      BOOLEAN (for moderation)
├── created_at      TIMESTAMPTZ
└── updated_at      TIMESTAMPTZ
```

The schema supports **4 rating dimensions** — operator, driver, vehicle, and punctuality — plus a free-text review body.

---

## 3. The Review Service

File: `services/api/src/services/review.service.js`

```javascript
export class ReviewService {

  static async createReview({ userId, bookingId, operatorId, ratings, body }) {
    // Creates a new review object with current timestamp
    // Returns the review
  }

  static async getOperatorReviews(operatorId) {
    // Returns mock reviews with passenger names, ratings, and dates
    // In Phase 3, this will query the database with a JOIN on users
  }

  static async getOperatorAverageRating(operatorId) {
    // Returns aggregated averages for all 4 dimensions
    // Returns: { overall, operator, driver, vehicle, punctuality, totalReviews }
  }
}
```

**Key design decisions:**
- `createReview()` generates a unique `id` from `Date.now()` (temporary — Phase 3 will use UUIDs)
- `getOperatorReviews()` returns hardcoded sample data (3 reviews from mock passengers)
- `getOperatorAverageRating()` computes a weighted average: `overall` = mean of all 4 dimensions
- All methods are `static` — no instantiation needed, just `ReviewService.createReview(...)`

---

## 4. The Review Routes

File: `services/api/src/routes/review.routes.js`

Three endpoints:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/reviews` | Submit a new review |
| `GET` | `/api/v1/reviews/operator/:id` | Get all reviews + averages for an operator |
| `GET` | `/api/v1/reviews/operator/:id/averages` | Get only the averages for an operator |

**POST /api/v1/reviews** — Request body:
```json
{
  "userId": "usr-123",
  "bookingId": "bkg-456",
  "operatorId": "op-abc",
  "ratings": {
    "operator": 5,
    "driver": 4,
    "vehicle": 5,
    "punctuality": 4
  },
  "body": "Very comfortable bus. AC worked perfectly."
}
```

Validation rules:
- `userId`, `bookingId`, `operatorId`, and `ratings` are required
- `ratings.operator` is required and must be 1-5
- Other ratings (driver, vehicle, punctuality) are optional but validated if provided

**GET /api/v1/reviews/operator/:id** — Response:
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev-001",
        "passengerName": "Emeka Okonkwo",
        "operatorRating": 5,
        "driverRating": 4,
        "body": "Very comfortable bus...",
        "createdAt": "2025-12-20T10:30:00Z"
      }
    ],
    "averages": {
      "overall": 4.7,
      "operator": 4.7,
      "driver": 4.6,
      "vehicle": 4.8,
      "punctuality": 4.2,
      "totalReviews": 128
    }
  }
}
```

---

## 5. Activation in app.js

In `services/api/src/app.js`, the review router follows the Phase 2 scaffolded pattern:

```javascript
// Phase 2 routes (scaffolded — activate as features are built):
import reviewRouter from './routes/review.routes.js';
// import paymentRouter from './routes/payment.routes.js';
// import trackingRouter from './routes/tracking.routes.js';

app.use('/api/v1/reviews', reviewRouter);
```

The health check also updates to reflect the current phase:
```javascript
phase: 'Phase 2 — Core Growth (Reviews)'
```

---

## 6. Testing the API

Start the backend:
```bash
cd services/api
pnpm dev
```

Test the endpoints:
```bash
# Get reviews for an operator
curl http://localhost:3000/api/v1/reviews/operator/op-abc

# Submit a new review
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Content-Type: application/json" \
  -d '{"userId":"usr-test","bookingId":"bkg-test","operatorId":"op-abc","ratings":{"operator":5,"driver":4}}'
```

Expected: The GET endpoint returns 3 mock reviews + averages. The POST endpoint returns the newly created review with a 201 status.

---

> 💡 **Key Insight:** The mock service pattern lets us build and test the entire frontend before any database work. When we're ready for Phase 3, only the service methods change — the routes and frontend code stay exactly the same.
