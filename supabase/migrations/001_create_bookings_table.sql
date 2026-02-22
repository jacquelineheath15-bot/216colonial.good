-- Create bookings table for short-term rental property
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  
  -- Date range
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  
  -- Pricing
  total_price NUMERIC(10,2) NOT NULL,
  deposit_amount NUMERIC(10,2) NOT NULL,
  deposit_paid BOOLEAN DEFAULT false NOT NULL,
  balance_owed NUMERIC(10,2) NOT NULL,
  balance_paid BOOLEAN DEFAULT false NOT NULL,
  
  -- Stripe payment intents
  stripe_payment_intent_deposit TEXT,
  stripe_payment_intent_balance TEXT,
  
  -- Guest information
  guest_first_name TEXT NOT NULL,
  guest_last_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_address TEXT,
  num_guests INTEGER NOT NULL,
  special_requests TEXT,
  
  -- Admin notes
  notes TEXT,
  
  -- Constraint: check_out must be after check_in
  CONSTRAINT check_out_after_check_in CHECK (check_out > check_in)
);

-- Create indexes for common queries
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert new bookings (for creating reservations)
CREATE POLICY "Allow public insert" ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users (admin) to read all bookings
CREATE POLICY "Allow authenticated read" ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users (admin) to update bookings
CREATE POLICY "Allow authenticated update" ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users (admin) to delete bookings
CREATE POLICY "Allow authenticated delete" ON bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy: Allow service role full access (for API operations)
CREATE POLICY "Allow service role full access" ON bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to automatically calculate nights on insert/update
CREATE OR REPLACE FUNCTION calculate_nights()
RETURNS TRIGGER AS $$
BEGIN
  NEW.nights := NEW.check_out - NEW.check_in;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate nights before insert or update
CREATE TRIGGER trigger_calculate_nights
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_nights();
