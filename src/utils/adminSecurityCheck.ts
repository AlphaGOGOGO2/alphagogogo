import { supabase } from "@/integrations/supabase/client";

/**
 * 관리자 보안 점검 유틸리티
 * admin_users 테이블에 직접 접근하지 않고 안전한 방법으로 관리자 인증을 처리
 */

// 클라이언트에서는 절대 admin_users 테이블에 직접 접근하지 않음
// 모든 관리자 인증은 secure-admin-auth Edge Function을 통해서만 수행

export const checkAdminAuthentication = async (token: string): Promise<boolean> => {
  try {
    // Edge Function을 통한 안전한 토큰 검증
    const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
      body: {
        action: 'validate',
        token
      }
    });

    if (error) {
      console.error('Admin auth check error:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('Admin authentication check failed:', error);
    return false;
  }
};

/**
 * 관리자 로그인 시도 - 클라이언트에서 admin_users에 직접 접근하지 않음
 */
export const attemptAdminLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
      body: {
        action: 'login',
        email,
        password
      }
    });

    if (error) {
      throw new Error('인증 서버 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error('Admin login attempt failed:', error);
    throw error;
  }
};

/**
 * 보안 이벤트 로깅 - 의심스러운 활동 감지 시 사용
 */
export const logSecurityEvent = async (eventType: string, description: string) => {
  try {
    await supabase.functions.invoke('secure-admin-auth', {
      body: {
        action: 'log_security_event',
        event_type: eventType,
        description
      }
    });
  } catch (error) {
    console.error('Security event logging failed:', error);
  }
};

// 클라이언트 코드에서 admin_users 테이블 직접 접근을 방지하는 타입 가드
type AdminUsersAccess = never;

export const preventDirectAdminAccess = (): AdminUsersAccess => {
  throw new Error(
    'SECURITY VIOLATION: Direct access to admin_users table is not allowed. ' +
    'Use secure-admin-auth Edge Function instead.'
  );
};