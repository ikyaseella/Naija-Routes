# 🗄️ Phase 0 — Step 3: Database Schema
## PostgreSQL via Supabase — Full Entity Design

---

## Why PostgreSQL over MongoDB?

| Factor | PostgreSQL (Supabase) ✅ | MongoDB Atlas |
|---|---|---|
| **Data model** | Relational — perfect for our highly connected entities (bookings → tickets → payments) | Document-based — better for unstructured data |
| **ACID transactions** | ✅ Full ACID compliance | ⚠️ Limited (multi-document transactions added later) |
| **Free tier** | ✅ 500MB DB + Auth + Storage + Realtime in one | ✅ 512MB DB only |
| **PRD alignment** | ✅ Explicitly specified: "PostgreSQL 16 (Supabase)" | ❌ Not in PRD |
| **Bookings safety** | ✅ A failed payment rolls back the entire booking | ⚠️ Riskier without full ACID |
| **Row Level Security** | ✅ Built-in — agents can only see their park's data | ❌ Must implement in application code |
| **Auth built-in** | ✅ Supabase Auth handles phone OTP, JWT, roles | ❌ Separate setup required |

**Decision: PostgreSQL via Supabase.** ✅

---

## Supabase Free Tier — What You Get

| Resource | Free Limit |
|---|---|
| Database storage | 500 MB |
| Bandwidth | 5 GB/month |
| File storage | 1 GB |
| Monthly active auth users | 50,000 |
| API requests | Unlimited |
| Realtime connections | 200 concurrent |
| Active projects | 2 |
| Inactivity pause | After 1 week (click "Restore" — 20 seconds) |

> 💡 For Phase 0 development, 500MB is more than enough. A full production database with 10,000 bookings is roughly 20–50MB.

---

## Setting Up Supabase (Do This Now)

### 1. Create a Supabase Account
Go to [https://supabase.com](https://supabase.com) → **Start your project** → Sign in with GitHub.

### 2. Create a New Project
- **Project name:** `naija-routes-dev`
- **Database password:** Generate a strong password and **save it somewhere safe**
- **Region:** Choose `West EU (London)` or the closest available to Nigeria
- Click **Create new project** and wait ~2 minutes

### 3. Get Your Project Keys
Once the project is ready, go to **Settings → API**. You'll need:
- `Project URL` (looks like: `https://xxxxxxxxxxx.supabase.co`)
- `anon public key` (safe to use in frontend)
- `service_role key` (SECRET — backend only, never expose to frontend)

### 4. Create Your `.env` File
In the `naija-routes/server/` folder, create `.env`:
```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database (direct connection)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres

# App
NODE_ENV=development
PORT=3000
```

> ⚠️ **CRITICAL:** Add `.env` to your `.gitignore` immediately. NEVER commit real API keys to GitHub.

In `naija-routes/.gitignore` (or create it), add:
```
.env
.env.local
.env.*.local
node_modules/
dist/
.turbo/
```

---

## The Complete Database Schema

Below is the full PostgreSQL schema derived from our PRD. Run this in the **Supabase SQL Editor** (go to your project → SQL Editor → New query).

### Important Conventions
- All tables have `created_at` and `updated_at` timestamps (auto-managed)
- All tables have soft-delete via `deleted_at` (records are never permanently deleted)
- All monetary amounts are stored in **kobo** (smallest naira unit: 100 kobo = ₦1) to avoid floating-point errors
- UUIDs are used as primary keys (not integer IDs) for security and distributed systems

---

### Run This in Supabase SQL Editor:

```sql
-- ============================================================
-- NAIJA ROUTES — COMPLETE DATABASE SCHEMA
-- Version: 1.0.0 | Phase 0
-- Run in: Supabase SQL Editor
-- ============================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- TABLE 1: users
-- Everyone who signs up: travellers, agents, operators, admins
-- ============================================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone           VARCHAR(20) UNIQUE NOT NULL,   -- Nigerian format: +2348012345678
  email           VARCHAR(255) UNIQUE,
  full_name       VARCHAR(255),
  lang_pref       VARCHAR(10) DEFAULT 'en',       -- en, yo, ha, ig, pcm
  role            VARCHAR(20) DEFAULT 'traveller' -- traveller | agent | operator | admin
                  CHECK (role IN ('traveller', 'agent', 'operator', 'admin')),
  is_verified     BOOLEAN DEFAULT FALSE,
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ                     -- soft delete
);

COMMENT ON TABLE users IS 'All platform users: travellers, park agents, operators, admins';
COMMENT ON COLUMN users.lang_pref IS 'en=English, yo=Yoruba, ha=Hausa, ig=Igbo, pcm=Nigerian Pidgin';
COMMENT ON COLUMN users.role IS 'Determines dashboard and permissions. Set by admin after onboarding.';


-- ============================================================
-- TABLE 2: operators
-- Transport companies and bus owners on the platform
-- ============================================================
CREATE TABLE operators (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                VARCHAR(255) NOT NULL,
  slug                VARCHAR(255) UNIQUE,           -- URL-friendly name e.g. "abc-transport"
  registration_no     VARCHAR(100),                  -- CAC registration number
  nin_verified        BOOLEAN DEFAULT FALSE,          -- NIN/BVN identity verification status
  logo_url            TEXT,
  rating_avg          DECIMAL(3,2) DEFAULT 0.00,     -- Computed average, updated by trigger
  total_reviews       INTEGER DEFAULT 0,
  states_served       TEXT[],                        -- Array: ['Lagos', 'Abuja', 'Onitsha']
  bank_account_name   VARCHAR(255),
  bank_account_no     VARCHAR(20),
  bank_code           VARCHAR(10),                   -- Nigerian bank code for Paystack settlement
  is_active           BOOLEAN DEFAULT FALSE,          -- Set to TRUE after KYC approval
  owner_user_id       UUID REFERENCES users(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

COMMENT ON TABLE operators IS 'Transport companies/operators. Must be approved (is_active=true) before listing routes.';
COMMENT ON COLUMN operators.states_served IS 'PostgreSQL array of state names this operator covers';
COMMENT ON COLUMN operators.rating_avg IS 'Stored average for query performance. Recomputed when new reviews arrive.';


-- ============================================================
-- TABLE 3: vehicles
-- Buses and minibuses belonging to operators
-- ============================================================
CREATE TABLE vehicles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id     UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  plate_no        VARCHAR(20) UNIQUE NOT NULL,
  type            VARCHAR(20) NOT NULL
                  CHECK (type IN ('bus', 'minibus', 'coaster', 'suv')),
  seats           INTEGER NOT NULL CHECK (seats > 0 AND seats <= 100),
  make            VARCHAR(100),                   -- e.g. "Toyota"
  model           VARCHAR(100),                  -- e.g. "Coaster"
  year            INTEGER,
  color           VARCHAR(50),
  gps_device_id   VARCHAR(100),                  -- Teltonika OBD device serial number
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE vehicles IS 'Physical buses/vehicles belonging to operators. GPS device linked for tracking.';


-- ============================================================
-- TABLE 4: routes
-- Origin–destination pairs served by operators
-- ============================================================
CREATE TABLE routes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id     UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  origin          VARCHAR(255) NOT NULL,           -- City/town name e.g. "Lagos"
  destination     VARCHAR(255) NOT NULL,
  origin_state    VARCHAR(100) NOT NULL,           -- e.g. "Lagos State"
  dest_state      VARCHAR(100) NOT NULL,
  distance_km     INTEGER,                         -- Approximate road distance
  duration_hrs    DECIMAL(4,1),                    -- Approximate travel time in hours
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,

  UNIQUE(operator_id, origin, destination)         -- One operator can't duplicate the same route
);

COMMENT ON TABLE routes IS 'City-pair routes. An operator may serve Lagos–Abuja in both directions as two separate rows.';


-- ============================================================
-- TABLE 5: schedules
-- Departure times on a route, linked to a specific vehicle
-- ============================================================
CREATE TABLE schedules (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id          UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  vehicle_id        UUID REFERENCES vehicles(id),
  departure_time    TIME NOT NULL,                     -- e.g. 06:00:00
  days_of_week      INTEGER[] NOT NULL,                -- [1,2,3,4,5] = Mon–Fri (1=Mon, 7=Sun)
  base_price_kobo   INTEGER NOT NULL CHECK (base_price_kobo > 0), -- e.g. 1500000 = ₦15,000
  seats_total       INTEGER NOT NULL,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

COMMENT ON TABLE schedules IS 'Recurring departure schedules. days_of_week uses ISO weekday numbers (1=Monday, 7=Sunday).';
COMMENT ON COLUMN schedules.base_price_kobo IS 'Price in kobo (1 kobo = 1/100 Naira). Store integers to avoid floating point errors.';
COMMENT ON COLUMN schedules.days_of_week IS 'Array of ISO weekday numbers. E.g. [1,2,3,4,5] = weekdays only.';


-- ============================================================
-- TABLE 6: bookings
-- A passenger's reservation on a specific schedule
-- ============================================================
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  schedule_id     UUID NOT NULL REFERENCES schedules(id),
  travel_date     DATE NOT NULL,                     -- The actual date of travel
  seat_no         VARCHAR(10),                       -- e.g. "A3" — null if open seating
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
  payment_ref     VARCHAR(255),                      -- Paystack/Flutterwave transaction reference
  total_kobo      INTEGER NOT NULL,                  -- Amount paid (may differ from base_price if promo)
  passenger_name  VARCHAR(255),                      -- For agent-assisted bookings (might differ from user)
  passenger_phone VARCHAR(20),
  booked_by_agent UUID REFERENCES users(id),         -- If an agent made this booking for a traveller
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE bookings IS 'Core booking record. Status flows: pending → confirmed → completed. Can be cancelled before departure.';
COMMENT ON COLUMN bookings.seat_no IS 'NULL means open seating operator. Populated when seat map is available.';
COMMENT ON COLUMN bookings.booked_by_agent IS 'If set, this was a walk-up sale by a park agent on behalf of the traveller.';


-- ============================================================
-- TABLE 7: tickets
-- The digital ticket generated after a booking is confirmed
-- ============================================================
CREATE TABLE tickets (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id          UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  qr_code_hash        VARCHAR(255) UNIQUE NOT NULL,  -- Unique hash embedded in QR code
  pdf_url             TEXT,                           -- Cloudflare R2 URL for PDF ticket
  issued_at           TIMESTAMPTZ DEFAULT NOW(),
  scanned_at          TIMESTAMPTZ,                    -- When the agent scanned this ticket
  scanned_by_agent_id UUID REFERENCES users(id),
  is_valid            BOOLEAN DEFAULT TRUE,            -- Set to FALSE after scan or cancellation
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tickets IS 'One ticket per confirmed booking. QR hash is validated server-side on every scan.';
COMMENT ON COLUMN tickets.qr_code_hash IS 'HMAC-SHA256 hash. Validated on scan to prevent forgery.';
COMMENT ON COLUMN tickets.is_valid IS 'Set to FALSE after scan (single-use). Prevents re-entry.';


-- ============================================================
-- TABLE 8: payments
-- Financial record of every payment attempt
-- ============================================================
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      UUID NOT NULL REFERENCES bookings(id),
  amount_kobo     INTEGER NOT NULL,
  method          VARCHAR(20) NOT NULL
                  CHECK (method IN ('card', 'bank_transfer', 'ussd', 'cash', 'wallet', 'opay', 'palmpay')),
  provider        VARCHAR(50),                     -- 'paystack' | 'flutterwave' | 'cash'
  provider_ref    VARCHAR(255),                    -- Payment provider's transaction ID
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  webhook_verified BOOLEAN DEFAULT FALSE,          -- TRUE after provider webhook confirms payment
  metadata        JSONB,                           -- Extra data from payment provider
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Every payment attempt, including failed ones. One booking may have multiple attempts.';
COMMENT ON COLUMN payments.webhook_verified IS 'Only mark booking confirmed after this is TRUE — prevents fraud.';


-- ============================================================
-- TABLE 9: tracking_events
-- GPS location pings from vehicles in transit
-- ============================================================
CREATE TABLE tracking_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id  UUID NOT NULL REFERENCES vehicles(id),
  lat         DECIMAL(10, 7) NOT NULL,            -- Latitude  e.g. 6.5244
  lng         DECIMAL(10, 7) NOT NULL,            -- Longitude e.g. 3.3792
  speed_kmh   DECIMAL(5, 2),
  event_type  VARCHAR(20) DEFAULT 'moving'
              CHECK (event_type IN ('moving', 'stopped', 'arrived', 'departed', 'offline')),
  recorded_at TIMESTAMPTZ NOT NULL,               -- Timestamp from the GPS device
  created_at  TIMESTAMPTZ DEFAULT NOW()
)
PARTITION BY RANGE (recorded_at);                 -- Time-series partitioning for performance

-- Create first partition (current month — add more as needed)
CREATE TABLE tracking_events_2026_06 PARTITION OF tracking_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

COMMENT ON TABLE tracking_events IS 'High-volume GPS pings. Partitioned by month for query performance.';


-- ============================================================
-- TABLE 10: cargo_bookings
-- Package/freight shipments booked through the platform
-- ============================================================
CREATE TABLE cargo_bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipper_id      UUID NOT NULL REFERENCES users(id),     -- Who is sending
  operator_id     UUID NOT NULL REFERENCES operators(id),
  origin          VARCHAR(255) NOT NULL,
  destination     VARCHAR(255) NOT NULL,
  travel_date     DATE NOT NULL,
  weight_kg       DECIMAL(8, 2) NOT NULL,
  description     TEXT NOT NULL,
  waybill_no      VARCHAR(50) UNIQUE,                     -- NR-YYYYMMDD-XXXX format
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')),
  price_kobo      INTEGER,
  recipient_name  VARCHAR(255),
  recipient_phone VARCHAR(20),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE cargo_bookings IS 'Freight/package shipments. Waybill number format: NR-YYYYMMDD-XXXX';


-- ============================================================
-- TABLE 11: agents
-- Park agents employed by Naija Routes to assist at motor parks
-- ============================================================
CREATE TABLE agents (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID UNIQUE NOT NULL REFERENCES users(id),
  park_name           VARCHAR(255) NOT NULL,          -- Which motor park they're stationed at
  park_state          VARCHAR(100) NOT NULL,
  commission_rate     DECIMAL(4, 2) DEFAULT 2.50,     -- Percentage e.g. 2.50 = 2.5%
  cash_balance_kobo   INTEGER DEFAULT 0,              -- Cash collected, pending reconciliation
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

COMMENT ON TABLE agents IS 'Park agents who sell tickets and onboard operators on behalf of Naija Routes.';
COMMENT ON COLUMN agents.cash_balance_kobo IS 'Running total of unreconciled cash. Resets to 0 after daily reconciliation.';


-- ============================================================
-- TABLE 12: reviews
-- Post-journey ratings by travellers for operators
-- ============================================================
CREATE TABLE reviews (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id),
  booking_id          UUID UNIQUE NOT NULL REFERENCES bookings(id), -- One review per booking
  operator_id         UUID NOT NULL REFERENCES operators(id),
  operator_rating     INTEGER NOT NULL CHECK (operator_rating BETWEEN 1 AND 5),
  driver_rating       INTEGER CHECK (driver_rating BETWEEN 1 AND 5),
  vehicle_rating      INTEGER CHECK (vehicle_rating BETWEEN 1 AND 5),
  punctuality_rating  INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  body                TEXT,                                          -- Written review text
  is_visible          BOOLEAN DEFAULT TRUE,                          -- Admins can hide reviews
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE reviews IS 'Post-journey ratings. Linked to a specific booking to prevent duplicate reviews.';


-- ============================================================
-- INDEXES — for query performance
-- ============================================================

-- Users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Routes — the most searched table
CREATE INDEX idx_routes_origin_dest ON routes(origin, destination);
CREATE INDEX idx_routes_operator ON routes(operator_id);

-- Schedules
CREATE INDEX idx_schedules_route ON schedules(route_id);

-- Bookings
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_travel_date ON bookings(travel_date);

-- Payments
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_provider_ref ON payments(provider_ref);

-- Tracking (partial index — only active/recent events)
CREATE INDEX idx_tracking_vehicle_time ON tracking_events(vehicle_id, recorded_at DESC);

-- Reviews
CREATE INDEX idx_reviews_operator ON reviews(operator_id);


-- ============================================================
-- AUTO-UPDATE `updated_at` TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_operators_updated_at
  BEFORE UPDATE ON operators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_vehicles_updated_at
  BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_routes_updated_at
  BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_schedules_updated_at
  BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cargo_updated_at
  BEFORE UPDATE ON cargo_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_agents_updated_at
  BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- SAMPLE SEED DATA (for development/testing)
-- ============================================================

-- Insert a test operator
INSERT INTO operators (name, slug, states_served, is_active)
VALUES ('ABC Transport', 'abc-transport', ARRAY['Lagos', 'Abuja', 'Enugu'], TRUE);

-- Insert a test route
INSERT INTO routes (operator_id, origin, destination, origin_state, dest_state, distance_km, duration_hrs)
SELECT id, 'Lagos', 'Abuja', 'Lagos State', 'FCT', 830, 9.5
FROM operators WHERE slug = 'abc-transport';

-- Verify tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## Entity Relationship Summary

```
users ──────────────────── operators (owner_user_id)
  │                              │
  │ bookings ──── schedules ─── routes
  │    │               │
  │    │ tickets    vehicles
  │    │
  │    └── payments
  │
  ├── reviews (via bookings)
  ├── agents (user_id)
  └── cargo_bookings (shipper_id)
```

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| **Kobo for prices** | Integers avoid floating-point rounding errors. ₦1,500 = 150000 kobo |
| **UUID primary keys** | Not guessable (security), works across distributed systems |
| **Soft deletes** (`deleted_at`) | Booking history must never be permanently lost — legal requirement |
| **`UNIQUE(operator_id, origin, destination)`** | Prevents duplicate routes being added accidentally |
| **Partitioned `tracking_events`** | GPS data is high-volume time-series — partitioning keeps queries fast |
| **`webhook_verified` on payments** | Never confirm a booking until the payment provider's webhook confirms it |
| **`ARRAY` for `days_of_week`** | PostgreSQL supports arrays natively — no need for a join table |
| **`JSONB` for payment metadata** | Payment provider responses vary — JSONB handles flexible structure |

---

## ✅ Checklist

- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] Project `naija-routes-dev` created
- [ ] Project URL and keys saved securely
- [ ] `.env` file created in `server/` with keys filled in
- [ ] `.env` added to `.gitignore`
- [ ] SQL schema pasted into Supabase SQL Editor and executed
- [ ] All 12 tables visible in Supabase Table Editor
- [ ] Seed data inserted and visible

---

> 🔖 **Next step:** `04_Auth_Service.md` — we'll set up Supabase Auth with phone OTP and role-based access (code will be written but kept commented out until Phase 1).
