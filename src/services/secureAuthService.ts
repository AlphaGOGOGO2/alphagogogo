import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/authCleanup";
import { encryptedStorage } from "@/utils/encryptedStorage";

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
const SESSION_KEY = 'local_admin_session';

// 로컬 모드 체크
const isLocalMode = (): boolean => {
  return import.meta.env.VITE_LOCAL_MODE === 'true';
};

// 로컬 모드 인증
const localLogin = (password: string): AuthResponse => {
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false, message: '로컬 모드 설정이 올바르지 않습니다.' };
  }

  if (password === adminPassword) {
    const session = {
      user: {
        id: 'local-admin',
        email: 'admin@local',
        role: 'admin'
      },
      timestamp: Date.now()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem('blogAuthToken', 'authorized');

    return {
      success: true,
      user: session.user
    };
  }

  return { success: false, message: '비밀번호가 올바르지 않습니다.' };
};

// 로컬 모드 세션 검증
const validateLocalSession = (): AuthResponse => {
  const sessionData = sessionStorage.getItem(SESSION_KEY);

  if (!sessionData) {
    return { success: false, message: '세션이 없습니다.' };
  }

  try {
    const session = JSON.parse(sessionData);
    const now = Date.now();
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24시간

    if (now - session.timestamp > SESSION_DURATION) {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem('blogAuthToken');
      return { success: false, message: '세션이 만료되었습니다.' };
    }

    return {
      success: true,
      user: session.user
    };
  } catch (error) {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('blogAuthToken');
    return { success: false, message: '세션 정보가 올바르지 않습니다.' };
  }
};

export const secureLogin = async (email: string, password: string): Promise<AuthResponse> => {
  // 로컬 모드: 비밀번호만 검증 (email 무시)
  if (isLocalMode()) {
    return localLogin(password);
  }

  // 기존 Supabase 인증 로직
  try {
    // 기존 인증 상태 정리 및 강제 로그아웃 시도 (실패해도 무시)
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: 'global' }); } catch {}

    // 기존 세션 정리 (세션 회전)
    await cleanupExpiredSessions();

    const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
      body: {
        action: 'login',
        email,
        password
      }
    });

    if (error) {
      const status = (error as any)?.status ?? (error as any)?.context?.status;
      let message = '로그인 중 오류가 발생했습니다.';
      if (status === 401) message = '이메일 또는 비밀번호가 올바르지 않습니다.';
      else if (status === 429) message = '로그인 시도가 일시적으로 제한되었습니다. 잠시 후 다시 시도하세요.';
      else if ((error as any)?.message) message = (error as any).message;
      return { success: false, message };
    }

    if (data.success) {
      // Secure token storage with rotation
      const oldToken = getAdminToken();
      if (oldToken) {
        // 기존 토큰 무효화
        try {
          await supabase.functions.invoke('secure-admin-auth', {
            body: { action: 'invalidate', token: oldToken }
          });
        } catch {}
      }

      await encryptedStorage.setItem(TOKEN_KEY, data.token);
      await encryptedStorage.setItem('blogAuthToken', 'authorized'); // Legacy compatibility
      try { sessionStorage.setItem('blogAuthToken', 'authorized'); } catch {}
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
  // 로컬 모드: 세션 검증
  if (isLocalMode()) {
    return validateLocalSession();
  }

  // 기존 Supabase 토큰 검증
  const authToken = token || await getAdminToken();

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

export const getAdminToken = async (): Promise<string | null> => {
  return await encryptedStorage.getItem(TOKEN_KEY);
};

export const clearAuth = async (): Promise<void> => {
  // 로컬 모드: 세션 스토리지만 정리
  if (isLocalMode()) {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem('blogAuthToken');
    } catch {}
    return;
  }

  // 기존 Supabase 인증 정리
  try { cleanupAuthState(); } catch {}
  encryptedStorage.removeItem(TOKEN_KEY);
  encryptedStorage.removeItem('blogAuthToken');
  try { sessionStorage.removeItem('blogAuthToken'); } catch {}
  // 글로벌 로그아웃 시도 (실패해도 무시)
  try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
};

export const isAuthenticated = async (): Promise<boolean> => {
  // 로컬 모드: 세션 검증
  if (isLocalMode()) {
    const validation = validateLocalSession();
    return validation.success;
  }

  // 기존 Supabase 토큰 검증
  const token = await getAdminToken();
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

// 만료된 세션 정리
export const cleanupExpiredSessions = async (): Promise<void> => {
  try {
    await supabase.functions.invoke('secure-admin-auth', {
      body: { action: 'cleanup_sessions' }
    });
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
};

// 보안 이벤트 로깅
export const logSecurityEvent = async (eventType: string, description: string, metadata?: any): Promise<void> => {
  try {
    await supabase.functions.invoke('secure-admin-auth', {
      body: {
        action: 'log_security_event',
        event_type: eventType,
        description,
        metadata
      }
    });
  } catch (error) {
    console.error('Security logging error:', error);
  }
};
