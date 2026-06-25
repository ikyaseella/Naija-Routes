# 02 — Corporate Travel Portal: Backend
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. What We Are Building

The Corporate Travel Portal lets companies manage employee travel in bulk. A travel admin can set policies, book trips for staff, and receive consolidated invoices — all through a dedicated portal.

---

## 2. Database Schema (`002_corporate_schema.sql`)

Seven tables form the corporate domain:

```
corporates
  id, name, email, phone, status (active/suspended),
  monthly_limit_kobo, current_month_spend_kobo,
  created_at, updated_at, deleted_at

corporate_departments
  id, corporate_id → corporates.id, name, code, created_at, deleted_at

corporate_employees
  id, corporate_id → corporates.id, department_id → departments.id,
  name, email, phone, role (travel_admin/traveller), created_at, deleted_at

corporate_travel_policies
  id, corporate_id → corporates.id, name, is_active,
  max_price_per_booking_kobo, requires_approval_above_kobo,
  booking_window_days, same_day_booking,
  allowed_routes (text[]), allowed_operators (text[]),
  created_at, updated_at

corporate_bookings
  id, corporate_id, department_id, employee_id, schedule_id,
  seats (text[]), route, operator,
  total_kobo, status (booked/pending_approval/cancelled),
  travel_date, passenger_names (text[]),
  booked_at, approved_at, created_at

corporate_invoices
  id, corporate_id, total_kobo, paid_kobo, due_kobo,
  status (pending/paid/overdue), month (YYYY-MM),
  due_date, created_at

corporate_invoice_line_items
  id, invoice_id → invoices.id, booking_id, description,
  amount_kobo, date
```

Seed data includes three corporates: **Zenith Bank** (`corp-001`), **MTN Nigeria** (`corp-002`), **Dangote Group** (`corp-003`) — each with departments and a travel policy.

---

## 3. The Corporate Service (`corporate.service.js`)

All methods are `static` on the `CorporateService` class. They use `supabaseAdmin` for database access.

### Key Methods

| Method | Purpose |
|---|---|
| `listCorporates()` | Returns all active corporates |
| `getCorporate(id)` | Returns corporate + departments + employee count + active policy |
| `getDashboard(id)` | Returns summary metrics + recent bookings + unpaid invoice |
| `getDepartments(id)` | Lists departments for a corporate |
| `getEmployees(id, departmentId?)` | Lists employees, optionally filtered by department |
| `getPolicy(id)` | Returns the active travel policy or `null` |
| `bulkBook({...})` | Core booking logic with **policy enforcement** |
| `getBookings(id, status?)` | Lists bookings, optionally filtered by status |
| `approveBooking(id)` | Approves a pending booking |
| `cancelBooking(id)` | Cancels a booking |
| `getInvoices(id)` | Lists invoices with line items |

### Policy Enforcement (the key feature)

In `bulkBook()`:

```javascript
const pricePerSeatKobo = 950000;
const totalKobo = seats.length * pricePerSeatKobo;

// Check price limit
if (policy.max_price_per_booking_kobo > 0 &&
    totalKobo > policy.max_price_per_booking_kobo) {
  throw new Error(`Exceeds policy limit of ₦${...}`);
}

// Auto-approve or require approval based on threshold
const status = totalKobo > policy.requires_approval_above_kobo
  ? 'pending_approval'
  : 'booked';
```

This means: if a booking exceeds the approval threshold, it goes to `pending_approval` instead of `booked`. A travel admin must explicitly approve it.

---

## 4. The Corporate Routes (`corporate.routes.js`)

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all corporates |
| GET | `/:id` | Get corporate details |
| GET | `/:id/dashboard` | Dashboard metrics |
| GET | `/:id/departments` | List departments |
| GET | `/:id/employees` | List employees (optional `?departmentId`) |
| GET | `/:id/policy` | Get travel policy |
| POST | `/:id/bookings` | Create bulk booking |
| GET | `/:id/bookings` | List bookings (optional `?status`) |
| GET | `/:id/invoices` | List invoices |
| GET | `/:id/invoices/:invoiceId` | Get single invoice |
| PATCH | `/bookings/:bookingId/approve` | Approve pending booking |
| PATCH | `/bookings/:bookingId/cancel` | Cancel booking |

All routes use `try/catch` with specific error handling:
- `404` for "not found" errors
- `400` for policy violations (exceeds limit, no policy)
- `409` for state conflicts (already approved, already cancelled)

---

## 5. Registration in `app.js`

```javascript
import corporateRouter from './routes/corporate.routes.js';
app.use('/api/v1/corporate', corporateRouter);
```

---

## 6. Key Design Decisions

1. **Supabase-connected from day one** — unlike earlier services that used mock data, Corporate uses real database queries. This is because Phase 3 marks the shift from mock to production-ready data.
2. **Prices in kobo** — all monetary values are stored as integers (kobo) to avoid floating-point rounding errors. Display divides by 100.
3. **Soft deletes** — all corporate tables have `deleted_at`. Queries always filter with `.is('deleted_at', null)`.
4. **Policy as a separate table** — policies can be updated without affecting bookings. Future versions could support policy versioning.
