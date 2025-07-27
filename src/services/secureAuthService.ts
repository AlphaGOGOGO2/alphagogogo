import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateAdminToken } from "@/utils/securityUtils";

export interface SecureAuthState {
  isAuthenticated: boolean;
  sessionId: string | null;
  expiresAt: number | null;
}

const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2시간
const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30분마다 토큰 갱신

class SecureAuthService {
  private authState: SecureAuthState = {
    isAuthenticated: false,
    sessionId: null,
    expiresAt: null
  };

  private refreshInterval: NodeJS.Timeout | null = null;

  /**
   * 안전한 관리자 로그인
   */
  async secureLogin(password: string): Promise<boolean> {
    try {
      // 기존 세션 정리
      this.clearSession();

      // Edge Function을 통한 보안 인증
      const { data, error } = await supabase.functions.invoke('verify-admin-password', {
        body: { password }
      });

      if (error) {
        console.error("인증 오류:", error);
        toast.error("인증에 실패했습니다");
        return false;
      }

      if (!data.success) {
        toast.error("잘못된 비밀번호입니다");
        return false;
      }

      // 세션 정보 저장
      const sessionId = crypto.randomUUID();
      const expiresAt = Date.now() + SESSION_DURATION;

      this.authState = {
        isAuthenticated: true,
        sessionId,
        expiresAt
      };

      // 보안 토큰을 sessionStorage에 저장 (XSS 방지를 위해 localStorage 대신 사용)
      sessionStorage.setItem("secureAdminAuth", JSON.stringify({
        sessionId,
        expiresAt,
        token: data.token
      }));

      // 자동 토큰 갱신 시작
      this.startTokenRefresh();

      toast.success("관리자 인증이 완료되었습니다");
      return true;

    } catch (error) {
      console.error("로그인 처리 중 오류:", error);
      toast.error("로그인 처리 중 오류가 발생했습니다");
      return false;
    }
  }

  /**
   * 세션 검증
   */
  validateSession(): boolean {
    try {
      const authData = sessionStorage.getItem("secureAdminAuth");
      if (!authData) {
        this.clearSession();
        return false;
      }

      const { sessionId, expiresAt, token } = JSON.parse(authData);

      // 세션 만료 검사
      if (Date.now() > expiresAt) {
        this.clearSession();
        toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
        return false;
      }

      // 토큰 유효성 검사
      if (!validateAdminToken(token)) {
        this.clearSession();
        toast.error("유효하지 않은 토큰입니다. 다시 로그인해주세요.");
        return false;
      }

      // 상태 동기화
      this.authState = {
        isAuthenticated: true,
        sessionId,
        expiresAt
      };

      return true;

    } catch (error) {
      console.error("세션 검증 오류:", error);
      this.clearSession();
      return false;
    }
  }

  /**
   * 관리자 토큰 가져오기
   */
  getAdminToken(): string | null {
    try {
      const authData = sessionStorage.getItem("secureAdminAuth");
      if (!authData) return null;

      const { token, expiresAt } = JSON.parse(authData);

      if (Date.now() > expiresAt) {
        this.clearSession();
        return null;
      }

      return token;
    } catch (error) {
      console.error("토큰 가져오기 오류:", error);
      return null;
    }
  }

  /**
   * 로그아웃
   */
  logout(): void {
    this.clearSession();
    toast.success("로그아웃되었습니다");
  }

  /**
   * 세션 정리
   */
  private clearSession(): void {
    this.authState = {
      isAuthenticated: false,
      sessionId: null,
      expiresAt: null
    };

    // 모든 관련 스토리지 정리
    sessionStorage.removeItem("secureAdminAuth");
    sessionStorage.removeItem("blogAuthToken"); // 기존 토큰도 정리

    // 토큰 갱신 중지
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * 자동 토큰 갱신 시작
   */
  private startTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      if (!this.validateSession()) {
        clearInterval(this.refreshInterval!);
        this.refreshInterval = null;
      }
    }, TOKEN_REFRESH_INTERVAL);
  }

  /**
   * 현재 인증 상태 가져오기
   */
  getAuthState(): SecureAuthState {
    this.validateSession(); // 항상 최신 상태로 검증
    return { ...this.authState };
  }

  /**
   * 관리자 권한이 필요한 작업 실행
   */
  async executeWithAuth<T>(operation: () => Promise<T>): Promise<T | null> {
    if (!this.validateSession()) {
      toast.error("관리자 인증이 필요합니다");
      return null;
    }

    try {
      return await operation();
    } catch (error) {
      console.error("인증된 작업 실행 오류:", error);
      toast.error("작업 실행 중 오류가 발생했습니다");
      return null;
    }
  }
}

// 싱글톤 인스턴스 생성
export const secureAuthService = new SecureAuthService();

// 기존 호환성을 위한 래퍼 함수들
export const getAdminToken = () => secureAuthService.getAdminToken();
export const validateAdminSession = () => secureAuthService.validateSession();
export const clearAdminSession = () => secureAuthService.logout();