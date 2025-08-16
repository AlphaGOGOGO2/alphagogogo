-- 1) Defensive: ensure RLS is enabled on admin_login_attempts (already expected)
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- 2) Hardening: never store admin emails in attempts
CREATE OR REPLACE FUNCTION public.nullify_admin_attempt_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Always nullify any provided email to prevent harvesting
  NEW.email := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_nullify_admin_attempt_email ON public.admin_login_attempts;
CREATE TRIGGER tr_nullify_admin_attempt_email
BEFORE INSERT OR UPDATE ON public.admin_login_attempts
FOR EACH ROW
EXECUTE FUNCTION public.nullify_admin_attempt_email();

-- 3) One-time cleanup of any previously stored emails
UPDATE public.admin_login_attempts SET email = NULL WHERE email IS NOT NULL;

-- 4) Documentation for auditors
COMMENT ON FUNCTION public.nullify_admin_attempt_email() IS 'Ensures admin_login_attempts.email is never stored (always NULL) to mitigate email harvesting risk.';
COMMENT ON COLUMN public.admin_login_attempts.email IS 'Deprecated: Always NULL by trigger (emails are not stored).';