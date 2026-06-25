-- ============================================================
-- NAIJA ROUTES — Insurance Integration Schema Migration
-- File: services/api/migrations/003_insurance_schema.sql
-- Version: 1.0.0 | Phase 3
-- Apply in: Supabase SQL Editor → New Query → Paste → Run
-- ============================================================

-- ============================================================
-- TABLE 1: insurance_providers
-- ============================================================
CREATE TABLE IF NOT EXISTS insurance_providers (
  id              VARCHAR(50) PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  logo_url        TEXT,
  rating          DECIMAL(2,1) DEFAULT 0.0,
  description     TEXT,
  contact_phone   VARCHAR(20),
  claims_email    VARCHAR(255),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE insurance_providers IS 'Insurance companies integrated for travel insurance upsell';


-- ============================================================
-- TABLE 2: insurance_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS insurance_plans (
  id                VARCHAR(100) PRIMARY KEY,
  provider_id       VARCHAR(50) NOT NULL REFERENCES insurance_providers(id) ON DELETE CASCADE,
  name              VARCHAR(255) NOT NULL,
  price_kobo        INTEGER NOT NULL CHECK (price_kobo > 0),
  currency          VARCHAR(3) DEFAULT 'NGN',
  coverage          TEXT[] NOT NULL,
  max_payout_kobo   BIGINT NOT NULL,
  terms_url         TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE insurance_plans IS 'Insurance plans offered by each provider';
COMMENT ON COLUMN insurance_plans.coverage IS 'Array of coverage descriptions shown to user';


-- ============================================================
-- TABLE 3: insurance_purchases
-- ============================================================
CREATE TABLE IF NOT EXISTS insurance_purchases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  booking_id      UUID NOT NULL REFERENCES bookings(id),
  plan_id         VARCHAR(100) NOT NULL REFERENCES insurance_plans(id),
  provider_id     VARCHAR(50) NOT NULL REFERENCES insurance_providers(id),
  price_kobo      INTEGER NOT NULL,
  status          VARCHAR(20) DEFAULT 'active'
                  CHECK (status IN ('active', 'expired', 'cancelled', 'claimed')),
  passenger_name  VARCHAR(255),
  travel_date     DATE,
  route           VARCHAR(255),
  purchased_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE insurance_purchases IS 'Travel insurance purchases linked to bookings';


-- ============================================================
-- TABLE 4: insurance_claims
-- ============================================================
CREATE TABLE IF NOT EXISTS insurance_claims (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id     UUID NOT NULL REFERENCES insurance_purchases(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id),
  type            VARCHAR(30) DEFAULT 'other'
                  CHECK (type IN ('lost_baggage', 'trip_delay', 'accident', 'medical', 'cancellation', 'other')),
  description     TEXT,
  amount_kobo     INTEGER NOT NULL CHECK (amount_kobo > 0),
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  resolution      TEXT,
  documents       TEXT[],
  filed_at        TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE insurance_claims IS 'Insurance claims filed by users against their purchases';


-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ins_providers_active ON insurance_providers(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_ins_plans_provider ON insurance_plans(provider_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_ins_purchases_user ON insurance_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_ins_purchases_booking ON insurance_purchases(booking_id);
CREATE INDEX IF NOT EXISTS idx_ins_purchases_status ON insurance_purchases(status);
CREATE INDEX IF NOT EXISTS idx_ins_claims_user ON insurance_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_ins_claims_purchase ON insurance_claims(purchase_id);
CREATE INDEX IF NOT EXISTS idx_ins_claims_status ON insurance_claims(status);


-- ============================================================
-- AUTO-UPDATE updated_at TRIGGERS
-- ============================================================
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'insurance_providers','insurance_plans','insurance_purchases','insurance_claims'
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
INSERT INTO insurance_providers (id, name, rating, description, contact_phone, claims_email)
VALUES
  ('axa-mansard', 'AXA Mansard', 4.3, 'Nigeria''s leading insurance provider — trusted by over 1 million travellers.', '0700AXANIGERIA', 'claims@axamansard.com'),
  ('leadway', 'Leadway Assurance', 4.1, 'Comprehensive travel insurance with 24/7 claims support across Nigeria.', '01-2700650', 'claims@leadway.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO insurance_plans (id, provider_id, name, price_kobo, coverage, max_payout_kobo)
VALUES
  ('plan-axa-basic', 'axa-mansard', 'Basic Cover', 50000, ARRAY['Lost baggage up to ₦50,000', 'Trip delay compensation ₦10,000'], 5000000),
  ('plan-axa-premium', 'axa-mansard', 'Premium Cover', 150000, ARRAY['Lost baggage up to ₦200,000', 'Accident cover ₦500,000', 'Trip delay ₦25,000', 'Medical evacuation ₦2,000,000'], 20000000),
  ('plan-leadway-std', 'leadway', 'Standard Cover', 75000, ARRAY['Accident medical expenses ₦300,000', 'Personal accident ₦500,000'], 8000000),
  ('plan-leadway-comprehensive', 'leadway', 'Comprehensive Cover', 200000, ARRAY['Accident medical ₦1,000,000', 'Lost baggage ₦300,000', 'Trip cancellation ₦500,000', 'Repatriation ₦5,000,000'], 50000000)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- VERIFY
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'insurance%'
ORDER BY table_name;
