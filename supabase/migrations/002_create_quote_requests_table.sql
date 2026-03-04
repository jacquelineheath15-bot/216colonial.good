-- Quote requests table (no email dependency - stored in DB for admin to view)
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  guest_first_name TEXT NOT NULL,
  guest_last_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  
  check_in DATE,
  check_out DATE,
  proposed_nightly_rate NUMERIC(10,2),
  proposed_total NUMERIC(10,2),
  num_guests INTEGER,
  message TEXT
);

CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at DESC);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Service role can insert (from API)
CREATE POLICY "Service role insert quote_requests" ON quote_requests
  FOR INSERT TO service_role WITH CHECK (true);

-- Authenticated (admin) can read all
CREATE POLICY "Authenticated read quote_requests" ON quote_requests
  FOR SELECT TO authenticated USING (true);
