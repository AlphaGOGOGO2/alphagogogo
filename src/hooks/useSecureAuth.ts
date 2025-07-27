import { useState, useEffect } from 'react';
import { secureAuthService, SecureAuthState } from '@/services/secureAuthService';

/**
 * 보안 인증 상태를 관리하는 훅
 */
export function useSecureAuth() {
  const [authState, setAuthState] = useState<SecureAuthState>({
    isAuthenticated: false,
    sessionId: null,
    expiresAt: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 인증 상태 확인
    const checkAuth = () => {
      const currentState = secureAuthService.getAuthState();
      setAuthState(currentState);
      setLoading(false);
    };

    checkAuth();

    // 정기적으로 세션 상태 확인 (30초마다)
    const interval = setInterval(checkAuth, 30000);

    return () => clearInterval(interval);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await secureAuthService.secureLogin(password);
      if (success) {
        setAuthState(secureAuthService.getAuthState());
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    secureAuthService.logout();
    setAuthState({
      isAuthenticated: false,
      sessionId: null,
      expiresAt: null
    });
  };

  const executeWithAuth = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    return secureAuthService.executeWithAuth(operation);
  };

  return {
    ...authState,
    loading,
    login,
    logout,
    executeWithAuth,
    validateSession: () => secureAuthService.validateSession(),
    getToken: () => secureAuthService.getAdminToken()
  };
}