-- Enhanced security migration: Add session management and audit improvements

-- Add session rotation support to admin_sessions table
ALTER TABLE public.admin_sessions ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.admin_sessions ADD COLUMN IF NOT EXISTS invalidated_at timestamp with time zone;
ALTER TABLE public.admin_sessions ADD COLUMN IF NOT EXISTS last_used_at timestamp with time zone DEFAULT now();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON public.admin_sessions(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON public.admin_sessions(token_hash) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_type_time ON public.security_audit_logs(event_type, created_at);

-- Add cleanup function for expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Mark expired sessions as inactive
  UPDATE public.admin_sessions 
  SET is_active = false, invalidated_at = now()
  WHERE expires_at < now() AND is_active = true;
  
  -- Delete sessions older than 30 days
  DELETE FROM public.admin_sessions 
  WHERE created_at < now() - interval '30 days';
END;
$function$;

-- Add trigger to update last_used_at when session is validated
CREATE OR REPLACE FUNCTION public.update_session_last_used()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.last_used_at = now();
  RETURN NEW;
END;
$function$;

-- Enhanced admin login audit with geolocation detection
CREATE OR REPLACE FUNCTION public.enhanced_admin_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log all admin login attempts with enhanced details
  PERFORM public.log_security_event(
    CASE 
      WHEN NEW.success THEN 'ADMIN_LOGIN_SUCCESS'
      ELSE 'ADMIN_LOGIN_FAILURE'
    END,
    'Admin login attempt from IP: ' || COALESCE(NEW.ip_address, 'unknown'),
    COALESCE(NEW.ip_address, '127.0.0.1'),
    COALESCE(NEW.user_agent, 'unknown'),
    jsonb_build_object(
      'success', NEW.success,
      'attempt_time', NEW.attempted_at,
      'metadata', NEW.metadata
    )
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for admin login audit
DROP TRIGGER IF EXISTS admin_login_audit_trigger ON public.admin_login_attempts;
CREATE TRIGGER admin_login_audit_trigger
  AFTER INSERT ON public.admin_login_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_admin_audit();

-- Add progressive rate limiting table for API endpoints
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  identifier text NOT NULL, -- IP or user ID
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(endpoint, identifier, window_start)
);

-- Enable RLS on rate limits table
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits FORCE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "service_role_only_rate_limits" 
ON public.api_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- Add index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_lookup ON public.api_rate_limits(endpoint, identifier, window_start);

-- Cleanup function for old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Delete rate limit records older than 1 hour
  DELETE FROM public.api_rate_limits 
  WHERE created_at < now() - interval '1 hour';
END;
$function$;