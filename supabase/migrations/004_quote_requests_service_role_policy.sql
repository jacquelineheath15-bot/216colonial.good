-- Add explicit policy for service_role on quote_requests (in case RLS blocks API inserts)
-- Run this in Supabase SQL Editor if quote requests aren't saving

DROP POLICY IF EXISTS "quote_requests_insert_service_role" ON quote_requests;
CREATE POLICY "quote_requests_insert_service_role" ON quote_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);
