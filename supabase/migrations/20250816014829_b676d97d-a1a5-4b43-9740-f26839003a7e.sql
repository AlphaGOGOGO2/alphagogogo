-- Security Enhancement Migration
-- Fix blog tag policies and enhance content validation

-- Phase 1: Fix blog tag RLS policies to require admin authentication
-- Drop existing permissive policies on blog_tags and blog_post_tags
DROP POLICY IF EXISTS "select_blog_tags" ON public.blog_tags;
DROP POLICY IF EXISTS "insert_blog_tags" ON public.blog_tags;
DROP POLICY IF EXISTS "select_blog_post_tags" ON public.blog_post_tags;
DROP POLICY IF EXISTS "insert_blog_post_tags" ON public.blog_post_tags;

-- Create admin-only policies for blog tags (service role only for admin operations)
CREATE POLICY "admin_read_blog_tags" ON public.blog_tags
FOR SELECT USING (
  auth.role() = 'service_role'
);

CREATE POLICY "admin_manage_blog_tags" ON public.blog_tags
FOR ALL USING (
  auth.role() = 'service_role'
) WITH CHECK (
  auth.role() = 'service_role'
);

-- Create admin-only policies for blog post tags
CREATE POLICY "admin_read_blog_post_tags" ON public.blog_post_tags
FOR SELECT USING (
  auth.role() = 'service_role'
);

CREATE POLICY "admin_manage_blog_post_tags" ON public.blog_post_tags
FOR ALL USING (
  auth.role() = 'service_role'
) WITH CHECK (
  auth.role() = 'service_role'
);

-- Phase 2: Enhanced message content validation function
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

-- Update community messages policy to use enhanced validation
DROP POLICY IF EXISTS "Allow validated public insert on community messages" ON public.community_messages;

CREATE POLICY "Allow validated public insert on community messages" ON public.community_messages
FOR INSERT WITH CHECK (
  validate_message_content_enhanced(content) AND 
  (length(nickname) >= 1) AND (length(nickname) <= 20) AND
  (length(content) >= 1) AND (length(content) <= 500)
);

-- Phase 3: Add security audit log table for monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  event_description text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on audit logs (service role only)
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only_audit_logs" ON public.security_audit_logs
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  event_description text,
  ip_address text DEFAULT NULL,
  user_agent text DEFAULT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    event_type,
    event_description,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    event_type,
    event_description,
    ip_address,
    user_agent,
    metadata
  );
END;
$$;

-- Create trigger to log admin actions on blog posts
CREATE OR REPLACE FUNCTION public.audit_blog_post_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log blog post creation/updates for audit trail
  PERFORM public.log_security_event(
    TG_OP || '_BLOG_POST',
    'Blog post ' || COALESCE(NEW.title, OLD.title) || ' was ' || lower(TG_OP) || 'ed',
    COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', '127.0.0.1'),
    COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
    jsonb_build_object(
      'post_id', COALESCE(NEW.id, OLD.id),
      'category', COALESCE(NEW.category, OLD.category),
      'operation', TG_OP
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on blog_posts for audit logging
DROP TRIGGER IF EXISTS audit_blog_post_trigger ON public.blog_posts;
CREATE TRIGGER audit_blog_post_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.audit_blog_post_changes();