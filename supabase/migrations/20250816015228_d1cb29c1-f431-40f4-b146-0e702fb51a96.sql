-- Phase 1: 즉시 보안 수정
-- Fix admin tables RLS policies to be more restrictive

-- Fix admin_users table - strengthen existing policies
DROP POLICY IF EXISTS "Block all user access to admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Strict service role only access" ON public.admin_users;

CREATE POLICY "admin_users_service_role_only" ON public.admin_users
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Fix admin_sessions table - strengthen existing policies  
DROP POLICY IF EXISTS "Block all user access to admin sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Strict service role only access" ON public.admin_sessions;

CREATE POLICY "admin_sessions_service_role_only" ON public.admin_sessions
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Fix invite_clicks table - add proper read access for analytics
CREATE POLICY "public_read_invite_clicks" ON public.invite_clicks
FOR SELECT USING (true);

-- Fix resource_downloads table - add proper read access for analytics
CREATE POLICY "public_read_resource_downloads" ON public.resource_downloads
FOR SELECT USING (true);

-- Fix security_audit_logs table - ensure it's properly restricted
-- (Already has correct service_role only policy)

-- Phase 2: Fix any PostgreSQL syntax issues from previous migrations
-- Ensure all functions are properly created and accessible

-- Verify and recreate the enhanced validation function if needed
CREATE OR REPLACE FUNCTION public.validate_message_content_enhanced(content text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Check message length (stricter limits)
    IF LENGTH(content) < 1 OR LENGTH(content) > 500 THEN
        RETURN FALSE;
    END IF;
    
    -- Enhanced URL pattern detection
    IF content ~* '(http://|https://|www\.|ftp://|\.com|\.org|\.net|\.io|\.ly|\.me)' THEN
        RETURN FALSE;
    END IF;
    
    -- Check for excessive repeated characters (more strict)
    IF content ~* '(.)\1{5,}' THEN
        RETURN FALSE;
    END IF;
    
    -- Check for common spam patterns
    IF content ~* '(click here|free money|buy now|limited offer|act now)' THEN
        RETURN FALSE;
    END IF;
    
    -- Check for excessive punctuation
    IF content ~* '[!]{3,}|[\?]{3,}|[\.]{4,}' THEN
        RETURN FALSE;
    END IF;
    
    -- Check for all caps (more than 70% of content)
    IF LENGTH(REGEXP_REPLACE(content, '[^A-Z]', '', 'g')) > (LENGTH(content) * 0.7) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Phase 3: Ensure blog functionality is preserved
-- Add public read policies for blog-related tables that need them

-- Ensure blog_post_tags can be read for displaying tags on posts
CREATE POLICY "public_read_blog_post_tags" ON public.blog_post_tags
FOR SELECT USING (true);

-- Ensure blog_tags can be read for displaying tags
CREATE POLICY "public_read_blog_tags" ON public.blog_tags  
FOR SELECT USING (true);

-- Phase 4: Add monitoring function for security events
CREATE OR REPLACE FUNCTION public.monitor_security_events()
RETURNS TABLE(
  recent_events_count bigint,
  high_risk_events_count bigint,
  last_event_time timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.security_audit_logs WHERE created_at > now() - interval '1 hour') as recent_events_count,
    (SELECT COUNT(*) FROM public.security_audit_logs WHERE event_type LIKE '%SECURITY%' AND created_at > now() - interval '24 hours') as high_risk_events_count,
    (SELECT MAX(created_at) FROM public.security_audit_logs) as last_event_time;
END;
$$;