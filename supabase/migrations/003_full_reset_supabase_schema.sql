-- Full schema from Supabase, adapted for 216 Colonial Lane app
-- Run this in Supabase SQL Editor if starting fresh or fixing schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- --- Cleanup (safe to re-run) ---
DROP TRIGGER IF EXISTS trigger_calculate_nights ON bookings;
DROP FUNCTION IF EXISTS calculate_nights();
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_bookings_check_in;
DROP INDEX IF EXISTS idx_bookings_check_out;
DROP INDEX IF EXISTS idx_bookings_guest_email;
DROP INDEX IF EXISTS idx_bookings_guest_user_id;
DROP TABLE IF EXISTS bookings CASCADE;

DROP INDEX IF EXISTS idx_quote_requests_created_at;
DROP TABLE IF EXISTS quote_requests CASCADE;

-- --- Create bookings table ---
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  deposit_amount NUMERIC(10,2) NOT NULL CHECK (deposit_amount >= 0),
  deposit_paid BOOLEAN DEFAULT false NOT NULL,
  balance_owed NUMERIC(10,2) NOT NULL CHECK (balance_owed >= 0),
  balance_paid BOOLEAN DEFAULT false NOT NULL,
  stripe_payment_intent_deposit TEXT,
  stripe_payment_intent_balance TEXT,
  guest_first_name TEXT NOT NULL,
  guest_last_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_address TEXT,
  num_guests INTEGER NOT NULL CHECK (num_guests >= 1),
  special_requests TEXT,
  notes TEXT,
  guest_user_id UUID REFERENCES auth.users(id),
  CONSTRAINT check_out_after_check_in CHECK (check_out > check_in),
  CONSTRAINT balance_consistency CHECK (balance_owed = total_price - deposit_amount)
);

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_bookings_guest_user_id ON bookings(guest_user_id);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- API uses service_role (bypasses RLS). Admin dashboard uses authenticated.
-- Allow authenticated users (admin) to read/update all bookings
CREATE POLICY "bookings_select_authenticated" ON bookings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "bookings_update_authenticated" ON bookings
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- --- Trigger: calculate nights ---
CREATE OR REPLACE FUNCTION calculate_nights() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.check_in IS NOT NULL AND NEW.check_out IS NOT NULL THEN
    NEW.nights := (NEW.check_out - NEW.check_in)::int;
  END IF;
  IF NEW.nights IS NOT NULL AND NEW.nights < 1 THEN
    RAISE EXCEPTION 'Invalid booking length: nights must be >= 1';
  END IF;
  IF NEW.total_price IS NOT NULL AND NEW.deposit_amount IS NOT NULL THEN
    NEW.balance_owed := (NEW.total_price - NEW.deposit_amount)::numeric(10,2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_nights
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_nights();

-- --- Create quote_requests table ---
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  guest_first_name TEXT NOT NULL,
  guest_last_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE,
  check_out DATE,
  proposed_nightly_rate NUMERIC(10,2) CHECK (proposed_nightly_rate IS NULL OR proposed_nightly_rate >= 0),
  proposed_total NUMERIC(10,2) CHECK (proposed_total IS NULL OR proposed_total >= 0),
  num_guests INTEGER CHECK (num_guests IS NULL OR num_guests >= 1),
  message TEXT
);

CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at DESC);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anon/authenticated insert. API uses service_role which bypasses RLS.
CREATE POLICY "quote_requests_insert_anon" ON quote_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin (authenticated) can read all quote requests
CREATE POLICY "quote_requests_select_authenticated" ON quote_requests
  FOR SELECT TO authenticated USING (true);
