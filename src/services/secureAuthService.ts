import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/authCleanup";

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  message?: string;
}

// 보안 토큰 관리
const TOKEN_KEY = 'secure_admin_token';

export const secureLogin = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // 기존 인증 상태 정리 및 강제 로그아웃 시도 (실패해도 무시)
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: 'global' }); } catch {}

    const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
      body: {
        action: 'login',
        email,
        password
      }
    });

    if (error) {
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    }

    if (data.success) {
      // Secure token storage
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem('blogAuthToken', 'authorized'); // Legacy compatibility
      
      return {
        success: true,
        token: data.token,
        user: data.user
      };
    }

    return { success: false, message: data.message || '로그인에 실패했습니다.' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
};

export const validateToken = async (token?: string): Promise<AuthResponse> => {
  const authToken = token || getAdminToken();
  
  if (!authToken) {
    return { success: false, message: '토큰이 없습니다.' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
      body: {
        action: 'validate',
        token: authToken
      }
    });

    if (error) {
      return { success: false, message: '토큰 검증 중 오류가 발생했습니다.' };
    }

    if (data.success) {
      return {
        success: true,
        user: data.user
      };
    }

    // Token invalid, clear storage
    clearAuth();
    return { success: false, message: data.message || '토큰이 유효하지 않습니다.' };
  } catch (error) {
    console.error('Token validation error:', error);
    clearAuth();
    return { success: false, message: '토큰 검증 중 오류가 발생했습니다.' };
  }
};

export const getAdminToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const clearAuth = (): void => {
  try { cleanupAuthState(); } catch {}
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem('blogAuthToken');
  // 글로벌 로그아웃 시도 (실패해도 무시)
  try { supabase.auth.signOut({ scope: 'global' }); } catch {}
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = getAdminToken();
  if (!token) return false;

  const validation = await validateToken(token);
  return validation.success;
};

// Rate limiting for login attempts
const LOGIN_ATTEMPT_KEY = 'login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const checkLoginRateLimit = (): boolean => {
  const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPT_KEY) || '[]');
  const now = Date.now();
  
  // Clean old attempts
  const recentAttempts = attempts.filter((time: number) => now - time < LOCKOUT_DURATION);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }
  
  return true;
};

export const recordLoginAttempt = (): void => {
  const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPT_KEY) || '[]');
  const now = Date.now();
  
  attempts.push(now);
  
  // Keep only recent attempts
  const recentAttempts = attempts.filter((time: number) => now - time < LOCKOUT_DURATION);
  
  localStorage.setItem(LOGIN_ATTEMPT_KEY, JSON.stringify(recentAttempts));
};

export const clearLoginAttempts = (): void => {
  localStorage.removeItem(LOGIN_ATTEMPT_KEY);
};

// 지수 백오프 지연(ms) 계산 (최대 30초)
export const getLoginBackoffDelay = (): number => {
  const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPT_KEY) || '[]');
  const now = Date.now();
  const recentAttempts = attempts.filter((time: number) => now - time < LOCKOUT_DURATION);
  const n = recentAttempts.length;
  if (n <= 2) return 0;
  const delay = Math.min(30000, Math.pow(2, n - 2) * 1000);
  return delay;
};
