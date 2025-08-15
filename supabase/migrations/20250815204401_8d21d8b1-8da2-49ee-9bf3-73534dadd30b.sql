-- Fix RLS policy for message_rate_limits - allow system-level operations only
-- This table should only be accessible by edge functions and RPC calls for rate limiting

-- Create a system policy that allows service role access for rate limiting operations
CREATE POLICY "System access for rate limiting"
ON public.message_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create a very restrictive policy for authenticated users (essentially blocking direct access)
CREATE POLICY "No direct user access to rate limits"
ON public.message_rate_limits
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);