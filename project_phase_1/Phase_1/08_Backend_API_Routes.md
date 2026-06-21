# 08 — Backend API & Services
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## The Express API Architecture

For Phase 1, we are writing the actual backend endpoints that power the 3 frontend apps. 

We use a **Controller-Service** pattern in Express:
- **Routes (`/routes`):** Define the URL (e.g. `POST /bookings`), validate the incoming data, and return the HTTP response.
- **Services (`/services`):** The actual "Business Logic" (e.g., checking Redis, locking seats, calculating prices). Services know nothing about HTTP.

### Why separate them?
If we later want to build a Telegram Bot that books tickets, the bot can just call `BookingService.createBooking()` directly without needing an HTTP request!

---

## Step 1: Create the API Files

Run this in your terminal:
```powershell
New-Item -ItemType File -Path "naija-routes\server\src\routes\search.routes.js" -Force
New-Item -ItemType File -Path "naija-routes\server\src\routes\booking.routes.js" -Force
New-Item -ItemType File -Path "naija-routes\server\src\routes\ticket.routes.js" -Force
New-Item -ItemType File -Path "naija-routes\server\src\routes\operator.routes.js" -Force
New-Item -ItemType File -Path "naija-routes\server\src\routes\agent.routes.js" -Force

New-Item -ItemType File -Path "naija-routes\server\src\services\search.service.js" -Force
New-Item -ItemType File -Path "naija-routes\server\src\services\booking.service.js" -Force
New-Item -ItemType File -Path "naija-routes\server\src\services\ticket.service.js" -Force
```

---

## Step 2: Key Phase 1 API Endpoints

### 1. Route Search (`GET /api/v1/routes/search`)
- **Input:** `origin`, `destination`, `date`.
- **Logic:** Queries the `schedules` and `routes` tables. Joins the `operators` table to get the company name. Returns a sorted list of available buses.
- **File:** `search.routes.js` + `search.service.js`.

### 2. Create Booking (`POST /api/v1/bookings`)
- **Input:** `scheduleId`, `seatNo`, `passenger` object.
- **Logic:** 
  1. Checks if seat is already locked in Redis.
  2. If not, locks seat in Redis for 10 mins.
  3. Creates `PENDING` booking in DB.
- **File:** `booking.routes.js` + `booking.service.js`.

### 3. Agent QR Scan (`POST /api/v1/tickets/:hash/scan`)
- **Input:** The QR code hash.
- **Logic:** 
  1. Looks up the ticket by `qr_code_hash`.
  2. Verifies booking is `CONFIRMED` and not already scanned.
  3. Updates ticket to `scanned_at = NOW()`.
- **File:** `ticket.routes.js` + `ticket.service.js`.

---

## Step 3: Seed Data Migration

We can't test our API if the database is empty. We need to "Seed" the database with some fake operators and routes.

Create a new migration file:
```powershell
New-Item -ItemType File -Path "naija-routes\server\migrations\002_seed_routes.sql" -Force
```

This file will contain raw `INSERT` SQL statements to create:
1. An operator (e.g., "GUO Transport").
2. A route (e.g., "Lagos to Abuja").
3. A schedule (e.g., "Tomorrow at 06:30 AM").

---

## Next Steps
We will now write the Javascript for the API endpoints and the SQL for the seed data.

**Checkpoint:** Your `/routes` and `/services` folders should be populated with the files above.
