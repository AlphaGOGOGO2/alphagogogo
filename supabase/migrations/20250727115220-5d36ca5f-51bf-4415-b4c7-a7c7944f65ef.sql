-- Fix RLS policies for better security

-- 1. Restrict blog_posts table access to service role only for sensitive operations
DROP POLICY IF EXISTS "Allow authenticated users to insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog posts" ON public.blog_posts;

-- Create admin role enum if not exists
DO $$ BEGIN
    CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'editor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create admin_users table for proper authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role admin_role NOT NULL DEFAULT 'editor',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can only be managed by service role
CREATE POLICY "Service role can manage admin users" ON public.admin_users
    FOR ALL USING (false);  -- No access through regular RLS, only service role

-- Create admin sessions table for JWT management
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Sessions can only be managed by service role
CREATE POLICY "Service role can manage admin sessions" ON public.admin_sessions
    FOR ALL USING (false);

-- 2. Restrict resources table public access
DROP POLICY IF EXISTS "Allow public insert on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow public update on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow public delete on resources" ON public.resources;

-- Only allow read access for resources
CREATE POLICY "Public read access to resources" ON public.resources
    FOR SELECT USING (true);

-- 3. Add rate limiting for community messages
CREATE TABLE IF NOT EXISTS public.message_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL,
    message_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits
ALTER TABLE public.message_rate_limits ENABLE ROW LEVEL SECURITY;

-- Public can insert rate limit entries
CREATE POLICY "Public can manage rate limits" ON public.message_rate_limits
    FOR ALL USING (true);

-- 4. Add content validation function
CREATE OR REPLACE FUNCTION public.validate_message_content(content TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check message length
    IF LENGTH(content) > 500 THEN
        RETURN FALSE;
    END IF;
    
    -- Check for basic spam patterns
    IF content ~* '(http://|https://|www\.)' THEN
        RETURN FALSE;
    END IF;
    
    -- Check for excessive repeated characters
    IF content ~* '(.)\1{10,}' THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Update community_messages policy with content validation
DROP POLICY IF EXISTS "Allow public insert access on community messages" ON public.community_messages;

CREATE POLICY "Allow validated public insert on community messages" ON public.community_messages
    FOR INSERT 
    WITH CHECK (
        public.validate_message_content(content) AND
        LENGTH(nickname) BETWEEN 1 AND 20 AND
        LENGTH(content) BETWEEN 1 AND 500
    );

-- 5. Add audit logging function
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Log admin actions for audit trail
    INSERT INTO public.visit_logs (ip_address, user_agent, client_id)
    VALUES (
        COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', '127.0.0.1'),
        COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
        'admin-action'
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add triggers for audit logging on sensitive tables
DROP TRIGGER IF EXISTS audit_blog_posts ON public.blog_posts;
CREATE TRIGGER audit_blog_posts
    AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

DROP TRIGGER IF EXISTS audit_resources ON public.resources;
CREATE TRIGGER audit_resources
    AFTER INSERT OR UPDATE OR DELETE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();