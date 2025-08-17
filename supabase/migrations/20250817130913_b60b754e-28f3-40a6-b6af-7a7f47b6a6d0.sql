-- Enhanced Rate Limiting with Database Constraints
ALTER TABLE public.api_rate_limits 
ADD CONSTRAINT check_request_count_positive 
CHECK (request_count > 0 AND request_count <= 1000);

ALTER TABLE public.api_rate_limits 
ADD CONSTRAINT check_window_start_valid 
CHECK (window_start <= created_at + interval '1 hour');

-- Enhanced Message Rate Limiting
ALTER TABLE public.message_rate_limits 
ADD CONSTRAINT check_message_count_positive 
CHECK (message_count > 0 AND message_count <= 100);

ALTER TABLE public.message_rate_limits 
ADD CONSTRAINT check_window_start_message_valid 
CHECK (window_start <= created_at + interval '1 hour');

-- Security Monitoring Table for Real-time Threat Detection
CREATE TABLE IF NOT EXISTS public.security_threats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  threat_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  auto_blocked boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone
);

-- Enable RLS on security_threats
ALTER TABLE public.security_threats ENABLE ROW LEVEL SECURITY;

-- Only service role can access threat data
CREATE POLICY "security_threats_service_role_only" 
ON public.security_threats 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- Function to detect and log security threats
CREATE OR REPLACE FUNCTION public.detect_security_threat(
  p_threat_type text,
  p_description text,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_severity text DEFAULT 'medium'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  threat_id uuid;
  should_auto_block boolean := false;
BEGIN
  -- Determine if we should auto-block based on severity and type
  IF p_severity = 'critical' OR p_threat_type IN ('brute_force', 'sql_injection', 'xss_attempt') THEN
    should_auto_block := true;
  END IF;

  -- Insert the threat record
  INSERT INTO public.security_threats (
    threat_type, 
    severity, 
    description, 
    ip_address, 
    user_agent, 
    metadata, 
    auto_blocked
  ) VALUES (
    p_threat_type,
    p_severity,
    p_description,
    p_ip_address,
    p_user_agent,
    p_metadata,
    should_auto_block
  ) RETURNING id INTO threat_id;

  -- Log the security event for audit trail
  PERFORM public.log_security_event(
    'THREAT_DETECTED',
    'Security threat detected: ' || p_description,
    p_ip_address,
    p_user_agent,
    jsonb_build_object(
      'threat_id', threat_id,
      'threat_type', p_threat_type,
      'severity', p_severity,
      'auto_blocked', should_auto_block
    )
  );

  RETURN threat_id;
END;
$$;

-- Enhanced admin session tracking with better security
ALTER TABLE public.admin_sessions 
ADD COLUMN IF NOT EXISTS device_fingerprint text,
ADD COLUMN IF NOT EXISTS location_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS security_flags jsonb DEFAULT '{}'::jsonb;

-- Function to clean up old security data
CREATE OR REPLACE FUNCTION public.cleanup_security_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Clean up old rate limit records (older than 24 hours)
  DELETE FROM public.api_rate_limits 
  WHERE created_at < now() - interval '24 hours';
  
  DELETE FROM public.message_rate_limits 
  WHERE created_at < now() - interval '24 hours';
  
  -- Archive old security threats (older than 30 days) by updating status
  UPDATE public.security_threats 
  SET status = 'resolved', resolved_at = now()
  WHERE created_at < now() - interval '30 days' 
    AND status = 'open';
    
  -- Clean up very old audit logs (older than 90 days)
  DELETE FROM public.security_audit_logs 
  WHERE created_at < now() - interval '90 days';
END;
$$;