-- ============================================================
-- NAIJA ROUTES — Corporate Accounts Schema Migration
-- File: services/api/migrations/002_corporate_schema.sql
-- Version: 1.0.0 | Phase 3
-- Apply in: Supabase SQL Editor → New Query → Paste → Run
-- ============================================================

-- ============================================================
-- TABLE 1: corporates
-- ============================================================
CREATE TABLE IF NOT EXISTS corporates (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                VARCHAR(255) NOT NULL,
  registration_no     VARCHAR(100),
  email               VARCHAR(255) NOT NULL,
  phone               VARCHAR(20),
  address             TEXT,
  contact_person_name VARCHAR(255),
  contact_person_email VARCHAR(255),
  monthly_limit_kobo  BIGINT DEFAULT 0,
  current_month_spend_kobo BIGINT DEFAULT 0,
  status              VARCHAR(20) DEFAULT 'active'
                      CHECK (status IN ('active', 'suspended', 'closed')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

COMMENT ON TABLE corporates IS 'Corporate accounts with travel policies and consolidated invoicing';
COMMENT ON COLUMN corporates.monthly_limit_kobo IS 'Maximum monthly spend in kobo. 0 = no limit.';
COMMENT ON COLUMN corporates.current_month_spend_kobo IS 'Reset monthly via cron job or on first booking of new month.';


-- ============================================================
-- TABLE 2: corporate_departments
-- ============================================================
CREATE TABLE IF NOT EXISTS corporate_departments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id    UUID NOT NULL REFERENCES corporates(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  head_user_id    UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE(corporate_id, name)
);

COMMENT ON TABLE corporate_departments IS 'Departments within a corporate account';


-- ============================================================
-- TABLE 3: corporate_employees
-- ============================================================
CREATE TABLE IF NOT EXISTS corporate_employees (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id    UUID NOT NULL REFERENCES corporates(id) ON DELETE CASCADE,
  department_id   UUID REFERENCES corporate_departments(id) ON DELETE SET NULL,
  user_id         UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(20) DEFAULT 'traveller'
                  CHECK (role IN ('traveller', 'travel_admin', 'finance_admin')),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE corporate_employees IS 'Employees linked to a corporate account via their user_id';


-- ============================================================
-- TABLE 4: corporate_travel_policies
-- ============================================================
CREATE TABLE IF NOT EXISTS corporate_travel_policies (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id                UUID NOT NULL REFERENCES corporates(id) ON DELETE CASCADE,
  name                        VARCHAR(255) NOT NULL,
  max_price_per_booking_kobo  BIGINT DEFAULT 0,
  allowed_operators           TEXT[],
  allowed_routes              TEXT[],
  requires_approval_above_kobo BIGINT DEFAULT 0,
  booking_window_days         INTEGER DEFAULT 30,
  same_day_booking            BOOLEAN DEFAULT FALSE,
  is_active                   BOOLEAN DEFAULT TRUE,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW(),
  deleted_at                  TIMESTAMPTZ
);

COMMENT ON TABLE corporate_travel_policies IS 'Travel policies per corporate. Only one active policy at a time.';


-- ============================================================
-- TABLE 5: corporate_bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS corporate_bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id    UUID NOT NULL REFERENCES corporates(id) ON DELETE CASCADE,
  department_id   UUID REFERENCES corporate_departments(id) ON DELETE SET NULL,
  employee_id     UUID NOT NULL REFERENCES corporate_employees(id),
  booking_id      UUID REFERENCES bookings(id) ON DELETE SET NULL,
  schedule_id     UUID,
  seats           TEXT[],
  route           VARCHAR(255),
  operator        VARCHAR(255),
  total_kobo      BIGINT NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'pending_approval', 'booked', 'approved', 'cancelled', 'completed')),
  travel_date     DATE NOT NULL,
  passenger_names TEXT[],
  approved_by     UUID REFERENCES users(id),
  approved_at     TIMESTAMPTZ,
  booked_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE corporate_bookings IS 'Corporate travel bookings. Status: pending_approval → approved → booked';


-- ============================================================
-- TABLE 6: corporate_invoices
-- ============================================================
CREATE TABLE IF NOT EXISTS corporate_invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id    UUID NOT NULL REFERENCES corporates(id) ON DELETE CASCADE,
  month           VARCHAR(7) NOT NULL,
  total_kobo      BIGINT NOT NULL DEFAULT 0,
  paid_kobo       BIGINT NOT NULL DEFAULT 0,
  due_kobo        BIGINT NOT NULL DEFAULT 0,
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
  due_date        DATE,
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE(corporate_id, month)
);

COMMENT ON TABLE corporate_invoices IS 'Monthly consolidated invoices for corporate accounts';


-- ============================================================
-- TABLE 7: corporate_invoice_line_items
-- ============================================================
CREATE TABLE IF NOT EXISTS corporate_invoice_line_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id      UUID NOT NULL REFERENCES corporate_invoices(id) ON DELETE CASCADE,
  corporate_booking_id UUID REFERENCES corporate_bookings(id) ON DELETE SET NULL,
  date            DATE NOT NULL,
  description     TEXT NOT NULL,
  amount_kobo     BIGINT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE corporate_invoice_line_items IS 'Individual line items on a corporate invoice';


-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_corporates_status ON corporates(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_corp_depts_corporate ON corporate_departments(corporate_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_corp_employees_corporate ON corporate_employees(corporate_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_corp_employees_user ON corporate_employees(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_corp_policies_corporate ON corporate_travel_policies(corporate_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_corp_bookings_corporate ON corporate_bookings(corporate_id);
CREATE INDEX IF NOT EXISTS idx_corp_bookings_status ON corporate_bookings(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_corp_invoices_corporate ON corporate_invoices(corporate_id);
CREATE INDEX IF NOT EXISTS idx_corp_invoices_status ON corporate_invoices(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_corp_invoice_items_invoice ON corporate_invoice_line_items(invoice_id);


-- ============================================================
-- AUTO-UPDATE updated_at TRIGGERS
-- ============================================================
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'corporates','corporate_departments','corporate_employees',
    'corporate_travel_policies','corporate_bookings','corporate_invoices'
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
-- SEED DATA (Development only)
-- ============================================================
INSERT INTO corporates (id, name, registration_no, email, phone, address, monthly_limit_kobo, current_month_spend_kobo, status)
VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Zenith Bank Plc', 'RC 123456', 'travel@zenithbank.com', '01-2787000', 'Plot 84, Ajose Adeogun St, Victoria Island, Lagos', 1000000000, 412000000, 'active'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'MTN Nigeria Communications', 'RC 124567', 'corp-travel@mtn.com', '01-2770000', '3 Banjoko St, Alausa, Ikeja, Lagos', 1500000000, 678000000, 'active'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'Dangote Group', 'RC 125678', 'logistics@dangote.com', '01-4480000', '1 Dangote House, Apapa, Lagos', 2500000000, 1250000000, 'active')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- VERIFY
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'corporate%'
ORDER BY table_name;
