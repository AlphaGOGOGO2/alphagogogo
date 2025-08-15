-- Secure message_rate_limits table - restrict to system access only
ALTER TABLE public.message_rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop the overly permissive public access policy
DROP POLICY IF EXISTS "Public can manage rate limits" ON public.message_rate_limits;

-- Check current visit_logs policies (should already be secure from previous fix)
-- This is just to confirm visit_logs doesn't have public read access anymore