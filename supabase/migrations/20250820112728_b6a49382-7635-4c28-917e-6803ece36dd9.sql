-- 기존 log_admin_action 함수를 수정하여 올바른 제약 조건명을 사용
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS trigger
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Admin 액션 감사 로그 기록 (멱등성 보장)
    -- ON CONFLICT에서 정확한 제약 조건명 사용
    INSERT INTO public.visit_logs (ip_address, user_agent, client_id)
    VALUES (
        COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', '127.0.0.1'),
        COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
        'admin-action-' || extract(epoch from now())::text  -- 고유성 보장
    )
    ON CONFLICT (client_id, visit_date) DO NOTHING;  -- 정확한 제약 조건 컬럼명 사용
    
    RETURN COALESCE(NEW, OLD);
EXCEPTION WHEN OTHERS THEN
    -- 로깅 실패가 메인 작업을 방해하지 않도록 예외 무시
    RETURN COALESCE(NEW, OLD);
END;
$function$;