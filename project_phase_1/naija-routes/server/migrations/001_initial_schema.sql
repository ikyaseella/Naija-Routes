-- ============================================================
-- NAIJA ROUTES — Initial Database Schema Migration
-- File: server/migrations/001_initial_schema.sql
-- Version: 1.0.0 | Phase 0
-- Apply in: Supabase SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone           VARCHAR(20) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE,
  full_name       VARCHAR(255),
  lang_pref       VARCHAR(10) DEFAULT 'en'
                  CHECK (lang_pref IN ('en', 'yo', 'ha', 'ig', 'pcm')),
  role            VARCHAR(20) DEFAULT 'traveller'
                  CHECK (role IN ('traveller', 'agent', 'operator', 'admin')),
  is_verified     BOOLEAN DEFAULT FALSE,
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE users IS 'All platform users: travellers, park agents, operators, admins';
COMMENT ON COLUMN users.lang_pref IS 'en=English yo=Yoruba ha=Hausa ig=Igbo pcm=Nigerian Pidgin';
COMMENT ON COLUMN users.role IS 'Determines which dashboard and permissions apply';


-- ============================================================
-- TABLE 2: operators
-- ============================================================
CREATE TABLE IF NOT EXISTS operators (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                VARCHAR(255) NOT NULL,
  slug                VARCHAR(255) UNIQUE,
  registration_no     VARCHAR(100),
  nin_verified        BOOLEAN DEFAULT FALSE,
  logo_url            TEXT,
  rating_avg          DECIMAL(3,2) DEFAULT 0.00,
  total_reviews       INTEGER DEFAULT 0,
  states_served       TEXT[],
  bank_account_name   VARCHAR(255),
  bank_account_no     VARCHAR(20),
  bank_code           VARCHAR(10),
  is_active           BOOLEAN DEFAULT FALSE,
  owner_user_id       UUID REFERENCES users(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

COMMENT ON TABLE operators IS 'Transport companies. Must be KYC-approved (is_active=TRUE) before listing routes';
COMMENT ON COLUMN operators.rating_avg IS 'Cached average — updated when new reviews are submitted';
COMMENT ON COLUMN operators.states_served IS 'PostgreSQL TEXT array e.g. ARRAY[''Lagos'',''Abuja'']';


-- ============================================================
-- TABLE 3: vehicles
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id     UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  plate_no        VARCHAR(20) UNIQUE NOT NULL,
  type            VARCHAR(20) NOT NULL
                  CHECK (type IN ('bus', 'minibus', 'coaster', 'suv')),
  seats           INTEGER NOT NULL CHECK (seats > 0 AND seats <= 100),
  make            VARCHAR(100),
  model           VARCHAR(100),
  year            INTEGER,
  color           VARCHAR(50),
  gps_device_id   VARCHAR(100),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE vehicles IS 'Buses belonging to operators. gps_device_id links to the Teltonika OBD tracker';


-- ============================================================
-- TABLE 4: routes
-- ============================================================
CREATE TABLE IF NOT EXISTS routes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id     UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  origin          VARCHAR(255) NOT NULL,
  destination     VARCHAR(255) NOT NULL,
  origin_state    VARCHAR(100) NOT NULL,
  dest_state      VARCHAR(100) NOT NULL,
  distance_km     INTEGER,
  duration_hrs    DECIMAL(4,1),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE(operator_id, origin, destination)
);

COMMENT ON TABLE routes IS 'City-pair routes per operator. Each direction (Lagos→Abuja, Abuja→Lagos) is a separate row';


-- ============================================================
-- TABLE 5: schedules
-- ============================================================
CREATE TABLE IF NOT EXISTS schedules (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id          UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  vehicle_id        UUID REFERENCES vehicles(id),
  departure_time    TIME NOT NULL,
  days_of_week      INTEGER[] NOT NULL,
  base_price_kobo   INTEGER NOT NULL CHECK (base_price_kobo > 0),
  seats_total       INTEGER NOT NULL,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

COMMENT ON TABLE schedules IS 'Recurring departure times on a route';
COMMENT ON COLUMN schedules.base_price_kobo IS 'Price in kobo. ₦1 = 100 kobo. Always use integers for money.';
COMMENT ON COLUMN schedules.days_of_week IS 'ISO weekday numbers: 1=Mon 2=Tue ... 7=Sun';


-- ============================================================
-- TABLE 6: bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  schedule_id     UUID NOT NULL REFERENCES schedules(id),
  travel_date     DATE NOT NULL,
  seat_no         VARCHAR(10),
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','cancelled','completed','refunded')),
  payment_ref     VARCHAR(255),
  total_kobo      INTEGER NOT NULL,
  passenger_name  VARCHAR(255),
  passenger_phone VARCHAR(20),
  booked_by_agent UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE bookings IS 'Core booking record. Status flow: pending → confirmed → completed';
COMMENT ON COLUMN bookings.booked_by_agent IS 'NULL if self-service. Set to agent user_id if agent made the booking.';


-- ============================================================
-- TABLE 7: tickets
-- ============================================================
CREATE TABLE IF NOT EXISTS tickets (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id          UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  qr_code_hash        VARCHAR(255) UNIQUE NOT NULL,
  pdf_url             TEXT,
  issued_at           TIMESTAMPTZ DEFAULT NOW(),
  scanned_at          TIMESTAMPTZ,
  scanned_by_agent_id UUID REFERENCES users(id),
  is_valid            BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tickets IS 'One digital ticket per confirmed booking. Single-use QR code.';
COMMENT ON COLUMN tickets.qr_code_hash IS 'HMAC-SHA256 hash — verified server-side on every scan to prevent forgery';
COMMENT ON COLUMN tickets.is_valid IS 'Set to FALSE after scanning. Prevents duplicate boarding.';


-- ============================================================
-- TABLE 8: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id       UUID NOT NULL REFERENCES bookings(id),
  amount_kobo      INTEGER NOT NULL,
  method           VARCHAR(20) NOT NULL
                   CHECK (method IN ('card','bank_transfer','ussd','cash','wallet','opay','palmpay')),
  provider         VARCHAR(50),
  provider_ref     VARCHAR(255),
  status           VARCHAR(20) DEFAULT 'pending'
                   CHECK (status IN ('pending','success','failed','refunded')),
  webhook_verified BOOLEAN DEFAULT FALSE,
  metadata         JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Every payment attempt. A booking may have multiple attempts (failed card → retry).';
COMMENT ON COLUMN payments.webhook_verified IS 'CRITICAL: Only confirm booking after provider webhook sets this to TRUE';


-- ============================================================
-- TABLE 9: tracking_events (time-series, partitioned by month)
-- ============================================================
CREATE TABLE IF NOT EXISTS tracking_events (
  id          UUID DEFAULT uuid_generate_v4(),
  vehicle_id  UUID NOT NULL REFERENCES vehicles(id),
  lat         DECIMAL(10,7) NOT NULL,
  lng         DECIMAL(10,7) NOT NULL,
  speed_kmh   DECIMAL(5,2),
  event_type  VARCHAR(20) DEFAULT 'moving'
              CHECK (event_type IN ('moving','stopped','arrived','departed','offline')),
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- Partition for June 2026 — add a new partition each month
CREATE TABLE IF NOT EXISTS tracking_events_2026_06
  PARTITION OF tracking_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE TABLE IF NOT EXISTS tracking_events_2026_07
  PARTITION OF tracking_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

COMMENT ON TABLE tracking_events IS 'High-volume GPS pings from vehicle trackers. Partitioned by month.';


-- ============================================================
-- TABLE 10: cargo_bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS cargo_bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipper_id      UUID NOT NULL REFERENCES users(id),
  operator_id     UUID NOT NULL REFERENCES operators(id),
  origin          VARCHAR(255) NOT NULL,
  destination     VARCHAR(255) NOT NULL,
  travel_date     DATE NOT NULL,
  weight_kg       DECIMAL(8,2) NOT NULL,
  description     TEXT NOT NULL,
  waybill_no      VARCHAR(50) UNIQUE,
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','in_transit','delivered','cancelled')),
  price_kobo      INTEGER,
  recipient_name  VARCHAR(255),
  recipient_phone VARCHAR(20),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE cargo_bookings IS 'Freight shipments. Waybill format: NR-YYYYMMDD-XXXX';


-- ============================================================
-- TABLE 11: agents
-- ============================================================
CREATE TABLE IF NOT EXISTS agents (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID UNIQUE NOT NULL REFERENCES users(id),
  park_name           VARCHAR(255) NOT NULL,
  park_state          VARCHAR(100) NOT NULL,
  commission_rate     DECIMAL(4,2) DEFAULT 2.50,
  cash_balance_kobo   INTEGER DEFAULT 0,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

COMMENT ON TABLE agents IS 'Park agents who sell tickets on behalf of Naija Routes at motor parks';
COMMENT ON COLUMN agents.cash_balance_kobo IS 'Unreconciled cash balance. Resets after daily reconciliation.';


-- ============================================================
-- TABLE 12: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id),
  booking_id          UUID UNIQUE NOT NULL REFERENCES bookings(id),
  operator_id         UUID NOT NULL REFERENCES operators(id),
  operator_rating     INTEGER NOT NULL CHECK (operator_rating BETWEEN 1 AND 5),
  driver_rating       INTEGER CHECK (driver_rating BETWEEN 1 AND 5),
  vehicle_rating      INTEGER CHECK (vehicle_rating BETWEEN 1 AND 5),
  punctuality_rating  INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  body                TEXT,
  is_visible          BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE reviews IS 'Post-journey ratings. UNIQUE on booking_id prevents duplicate reviews per trip.';


-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_phone        ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role         ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_routes_origin_dest ON routes(origin, destination) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_routes_operator    ON routes(operator_id);
CREATE INDEX IF NOT EXISTS idx_schedules_route    ON schedules(route_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_bookings_user      ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule  ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_date      ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking   ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_ref       ON payments(provider_ref) WHERE provider_ref IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_vehicle   ON tracking_events(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_operator   ON reviews(operator_id) WHERE is_visible = TRUE;


-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','operators','vehicles','routes','schedules',
    'bookings','tickets','payments','cargo_bookings','agents','reviews'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t, t
    );
  END LOOP;
END $$;


-- ============================================================
-- DEVELOPMENT SEED DATA
-- Remove or gate behind NODE_ENV check before production
-- ============================================================

-- Test operator
INSERT INTO operators (name, slug, states_served, is_active)
VALUES ('ABC Transport (Test)', 'abc-transport-test', ARRAY['Lagos','Abuja','Enugu'], TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Test route
INSERT INTO routes (operator_id, origin, destination, origin_state, dest_state, distance_km, duration_hrs)
SELECT id, 'Lagos', 'Abuja', 'Lagos State', 'FCT', 830, 9.5
FROM operators WHERE slug = 'abc-transport-test'
ON CONFLICT (operator_id, origin, destination) DO NOTHING;


-- ============================================================
-- VERIFY MIGRATION
-- ============================================================
SELECT
  table_name,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
