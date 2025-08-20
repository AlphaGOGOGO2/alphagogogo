-- Fix duplicate key error from log_admin_action by making it idempotent
-- It will no longer fail when (client_id, visit_date) already exists

CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Log admin actions for audit trail (idempotent)
    INSERT INTO public.visit_logs (ip_address, user_agent, client_id)
    VALUES (
        COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', '127.0.0.1'),
        COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
        'admin-action'
    )
    ON CONFLICT ON CONSTRAINT uniq_visit_client_date DO NOTHING;  -- prevent 23505 errors
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;