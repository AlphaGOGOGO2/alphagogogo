-- Fix function search path security warnings

-- Update validate_message_content function with secure search path
CREATE OR REPLACE FUNCTION public.validate_message_content(content TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update log_admin_action function with secure search path
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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