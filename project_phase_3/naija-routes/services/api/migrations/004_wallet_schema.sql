-- ============================================================
-- NAIJA ROUTES — Wallet System Schema Migration
-- File: services/api/migrations/004_wallet_schema.sql
-- Version: 1.0.0 | Phase 2
-- Apply in: Supabase SQL Editor → New Query → Paste → Run
-- ============================================================

-- ============================================================
-- TABLE 1: wallets
-- ============================================================
CREATE TABLE IF NOT EXISTS wallets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance_kobo      BIGINT NOT NULL DEFAULT 0 CHECK (balance_kobo >= 0),
  locked_kobo       BIGINT NOT NULL DEFAULT 0 CHECK (locked_kobo >= 0),
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE wallets IS 'User wallets for in-app payments. One wallet per user.';
COMMENT ON COLUMN wallets.balance_kobo IS 'Total balance in kobo. Never negative.';
COMMENT ON COLUMN wallets.locked_kobo IS 'Amount locked during pending bookings. Deducted from balance.';
COMMENT ON COLUMN wallets.balance_kobo IS 'Available = balance_kobo - locked_kobo';


-- ============================================================
-- TABLE 2: wallet_transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id       UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id),
  type            VARCHAR(10) NOT NULL
                  CHECK (type IN ('credit', 'debit')),
  amount_kobo     INTEGER NOT NULL CHECK (amount_kobo > 0),
  method          VARCHAR(20) NOT NULL
                  CHECK (method IN ('card', 'bank_transfer', 'transfer', 'ussd', 'wallet', 'opay', 'palmpay', 'cash')),
  description     TEXT,
  ref             VARCHAR(255),
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE wallet_transactions IS 'All wallet credit/debit transactions. Immutable audit trail.';


-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_active ON wallets(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_wallet_txn_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_txn_user ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_txn_created ON wallet_transactions(created_at DESC);


-- ============================================================
-- AUTO-UPDATE updated_at TRIGGERS
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_wallets_updated_at') THEN
    CREATE TRIGGER trg_wallets_updated_at
      BEFORE UPDATE ON wallets
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;


-- ============================================================
-- HELPER: Ensure wallet exists for a user
-- ============================================================
CREATE OR REPLACE FUNCTION ensure_wallet(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  INSERT INTO wallets (user_id, balance_kobo, locked_kobo)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO v_wallet_id FROM wallets WHERE user_id = p_user_id;
  RETURN v_wallet_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION ensure_wallet IS 'Creates a wallet for a user if one does not exist. Returns wallet_id.';


-- ============================================================
-- SEED DATA (Development only)
-- ============================================================
DO $$
DECLARE
  v_uid UUID;
  v_wid UUID;
BEGIN
  -- Create wallets for any existing test users
  FOR v_uid IN SELECT id FROM users LIMIT 5 LOOP
    v_wid := ensure_wallet(v_uid);
    -- Add some initial balance
    UPDATE wallets SET balance_kobo = 5000000 WHERE id = v_wid;
  END LOOP;
END $$;


-- ============================================================
-- VERIFY
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'wallet%'
ORDER BY table_name;
