# 03 — Corporate Travel Portal: Frontend
**Naija Routes · Instructor-Led Project · Phase 3**

---

## 1. Page Overview

File: `apps/web/corporate.html` (431 lines — inline CSS, HTML, and JS)

The page is a **tabbed SPA** with 6 views, all fetched from the backend API:

| Tab | Path | Content |
|---|---|---|
| Overview | `#tab-overview` | Metrics cards + budget bar + recent bookings |
| Book Travel | `#tab-book` | Bulk booking form with department/employee/route/date/seats |
| Bookings | `#tab-bookings` | All corporate bookings with approve/cancel actions |
| Employees | `#tab-employees` | Employee listing table |
| Invoices | `#tab-invoices` | Monthly invoices with line items |
| Travel Policy | `#tab-policy` | Current policy details card |

---

## 2. Tab Switching

```javascript
function switchTab(name) {
  document.querySelectorAll('.corp-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.corp-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.corp-tab-btn[data-tab="${name}"]`).classList.add('active');
  document.getElementById(`tab-${name}`).classList.add('active');
  // Lazy-load data when tab is clicked
  if (name === 'book' && corpData) populateBookForm();
  if (name === 'bookings' && corpData) renderBookings();
  // ...
}
```

Tabs are lazy-loaded — data is fetched only when the user clicks the tab.

---

## 3. Dashboard (Overview Tab)

Fetches `GET /api/v1/corporate/{id}/dashboard` and renders:

- **4 metric cards**: Total Bookings, Active, Pending Approval, Monthly Spend
- **Budget bar**: color-coded (green < 80%, yellow 80-95%, red > 95%)
- **Recent bookings table**: ref, route, date, seats, amount, status

```javascript
document.getElementById('budgetBar').style.width = Math.min(s.budgetUsedPercent, 100) + '%';
if (s.budgetUsedPercent > 80) document.getElementById('budgetBar').style.background =
  s.budgetUsedPercent > 95 ? 'var(--color-red)' : 'var(--color-gold)';
```

---

## 4. Bulk Booking Form (Book Travel Tab)

Fields: Department, Employee, Route, Operator, Travel Date, Seats, Schedule ID, Passenger Names.

On submit, the form POSTs to `POST /api/v1/corporate/{id}/bookings`:

```javascript
const body = {
  departmentId, employeeId, scheduleId, route, operator,
  travelDate, seats, passengerNames
};
```

The form also shows a **policy warning banner** when bookings tab is first loaded:

> "Policy: Max ₦500,000 per booking · Approval needed above ₦200,000 · Routes: Lagos-Abuja, Abuja-Lagos, ..."

If the booking exceeds the policy limit, the API returns a 400 error which is displayed to the user.

---

## 5. Bookings Tab

Renders all corporate bookings in a table with status badges and action buttons:

- **Pending approval** bookings show an "Approve" button
- **Non-cancelled** bookings show a "Cancel" button
- Status badge colors: green (booked/approved), yellow (pending), red (cancelled)

```javascript
async function approveBook(id) {
  await fetch(`/api/v1/corporate/bookings/${id}/approve`, { method: 'PATCH' });
}
```

---

## 6. Employees, Invoices, Policy Tabs

Each renders its data from the corresponding API endpoint:

- **Employees**: table with name, email, phone, role
- **Invoices**: cards with month, status, total, line items, due/paid/outstanding
- **Policy**: detail card with limits, booking window, allowed routes, preferred operators

---

## 7. i18n Keys

All visible text uses `data-i18n` attributes (added to locale files):

```
corporate.overview, corporate.book_travel, corporate.bookings_tab,
corporate.employees_tab, corporate.invoices_tab, corporate.policy_tab,
corporate.welcome, corporate.total_bookings, corporate.active_bookings,
corporate.pending_approvals, corporate.monthly_spend,
corporate.budget_usage, corporate.recent_bookings,
corporate.bulk_book_title, corporate.department, ...
```

---

## 8. Running the Page

```bash
cd services/api && npm start    # API on port 3000
# Open apps/web/corporate.html in browser
```

The page uses `CORP_ID = 'corp-001'` (Zenith Bank). With the seed data from `002_corporate_schema.sql`, the dashboard will show pre-populated bookings, invoices, employees, and a travel policy.
