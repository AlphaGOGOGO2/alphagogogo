// 표준화된 에러 처리 시스템

import { toast } from "sonner";
import { logger } from "./logger";
import type { AppError, DatabaseError, NetworkError, ValidationError, AuthenticationError } from "@/types/errors";

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // 에러 타입 판별 함수들
  private isDatabaseError(error: unknown): error is DatabaseError {
    return typeof error === 'object' && error !== null && 'table' in error;
  }

  private isNetworkError(error: unknown): error is NetworkError {
    return typeof error === 'object' && error !== null && 'status' in error;
  }

  private isValidationError(error: unknown): error is ValidationError {
    return typeof error === 'object' && error !== null && 'field' in error;
  }

  private isAuthenticationError(error: unknown): error is AuthenticationError {
    return typeof error === 'object' && error !== null && 'reason' in error;
  }

  private isSupabaseError(error: unknown): boolean {
    return typeof error === 'object' && 
           error !== null && 
           ('code' in error || 'message' in error);
  }

  // 에러를 AppError 형태로 표준화
  private normalizeError(error: unknown, context?: string): AppError {
    const timestamp = new Date().toISOString();

    // AppError인 경우 그대로 반환
    if (this.isAppError(error)) {
      return error;
    }

    // Error 객체인 경우
    if (error instanceof Error) {
      return {
        code: error.name || 'UNKNOWN_ERROR',
        message: error.message,
        stack: error.stack,
        timestamp,
        details: { context }
      };
    }

    // Supabase 에러인 경우
    if (this.isSupabaseError(error)) {
      const supabaseError = error as any;
      return {
        code: supabaseError.code || 'SUPABASE_ERROR',
        message: supabaseError.message || '데이터베이스 오류가 발생했습니다.',
        timestamp,
        details: { 
          context,
          hint: supabaseError.hint,
          details: supabaseError.details
        }
      };
    }

    // 문자열인 경우
    if (typeof error === 'string') {
      return {
        code: 'STRING_ERROR',
        message: error,
        timestamp,
        details: { context }
      };
    }

    // 기타 모든 경우
    return {
      code: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
      timestamp,
      details: { context, originalError: JSON.stringify(error) }
    };
  }

  private isAppError(error: unknown): error is AppError {
    return typeof error === 'object' && 
           error !== null && 
           'code' in error && 
           'message' in error && 
           'timestamp' in error;
  }

  // 에러 심각도 판별
  private getErrorSeverity(error: AppError): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isAuthenticationError(error)) {
      return 'high';
    }
    
    if (this.isDatabaseError(error)) {
      return error.constraint ? 'medium' : 'high';
    }
    
    if (this.isNetworkError(error)) {
      if (error.status >= 500) return 'high';
      if (error.status >= 400) return 'medium';
      return 'low';
    }
    
    if (this.isValidationError(error)) {
      return 'low';
    }

    return 'medium';
  }

  // 사용자 친화적 메시지 생성
  private getUserFriendlyMessage(error: AppError): string {
    if (this.isValidationError(error)) {
      return `${error.field}: ${error.message}`;
    }

    if (this.isAuthenticationError(error)) {
      switch (error.reason) {
        case 'invalid_credentials':
          return '로그인 정보가 올바르지 않습니다.';
        case 'token_expired':
          return '세션이 만료되었습니다. 다시 로그인해주세요.';
        case 'insufficient_permissions':
          return '접근 권한이 없습니다.';
        default:
          return '인증 오류가 발생했습니다.';
      }
    }

    if (this.isDatabaseError(error)) {
      if (error.code === '23505') {
        return '이미 존재하는 데이터입니다.';
      }
      if (error.code === '23503') {
        return '참조된 데이터가 존재하지 않습니다.';
      }
      return '데이터 처리 중 오류가 발생했습니다.';
    }

    if (this.isNetworkError(error)) {
      if (error.status === 404) {
        return '요청한 데이터를 찾을 수 없습니다.';
      }
      if (error.status === 500) {
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      if (error.status === 403) {
        return '접근이 거부되었습니다.';
      }
      return '네트워크 오류가 발생했습니다.';
    }

    // 기본 메시지
    return error.message || '오류가 발생했습니다.';
  }

  // 메인 에러 처리 메서드
  public handle(error: unknown, context?: string, options: {
    showToast?: boolean;
    logError?: boolean;
    throwError?: boolean;
  } = {}): AppError {
    const {
      showToast = true,
      logError = true,
      throwError = false
    } = options;

    const normalizedError = this.normalizeError(error, context);
    const severity = this.getErrorSeverity(normalizedError);
    const userMessage = this.getUserFriendlyMessage(normalizedError);

    // 로깅
    if (logError) {
      switch (severity) {
        case 'critical':
        case 'high':
          logger.error(`[${context || 'Unknown'}] ${normalizedError.message}`, normalizedError);
          break;
        case 'medium':
          logger.warn(`[${context || 'Unknown'}] ${normalizedError.message}`);
          break;
        case 'low':
          logger.info(`[${context || 'Unknown'}] ${normalizedError.message}`);
          break;
      }
    }

    // 사용자 알림
    if (showToast) {
      switch (severity) {
        case 'critical':
        case 'high':
          toast.error(userMessage);
          break;
        case 'medium':
          toast.error(userMessage);
          break;
        case 'low':
          toast.warning(userMessage);
          break;
      }
    }

    // 에러 재발생
    if (throwError) {
      throw normalizedError;
    }

    return normalizedError;
  }

  // 특화된 에러 처리 메서드들
  public handleApiError(error: unknown, endpoint?: string): AppError {
    return this.handle(error, `API: ${endpoint}`, { showToast: true, logError: true });
  }

  public handleValidationError(field: string, value: unknown, constraint: string): ValidationError {
    const validationError: ValidationError = {
      code: 'VALIDATION_ERROR',
      message: `${field} 필드의 값이 유효하지 않습니다.`,
      field,
      value,
      constraint,
      timestamp: new Date().toISOString()
    };

    this.handle(validationError, 'Validation', { showToast: true, logError: false });
    return validationError;
  }

  public handleAuthError(reason: AuthenticationError['reason']): AuthenticationError {
    const authError: AuthenticationError = {
      code: 'AUTHENTICATION_ERROR',
      message: '인증 오류가 발생했습니다.',
      reason,
      timestamp: new Date().toISOString()
    };

    this.handle(authError, 'Authentication', { showToast: true, logError: true });
    return authError;
  }

  // 비동기 함수 래퍼
  public async handleAsync<T>(
    asyncFn: () => Promise<T>,
    context?: string,
    options?: Parameters<ErrorHandler['handle']>[2]
  ): Promise<T | null> {
    try {
      return await asyncFn();
    } catch (error) {
      this.handle(error, context, options);
      return null;
    }
  }

  // 조건부 에러 처리
  public handleIf(
    condition: boolean,
    error: string | AppError,
    context?: string
  ): void {
    if (condition) {
      this.handle(error, context);
    }
  }
}

// 싱글톤 인스턴스
export const errorHandler = ErrorHandler.getInstance();

// 편의 함수들
export const handleError = (error: unknown, context?: string) => 
  errorHandler.handle(error, context);

export const handleApiError = (error: unknown, endpoint?: string) => 
  errorHandler.handleApiError(error, endpoint);

export const handleValidationError = (field: string, value: unknown, constraint: string) => 
  errorHandler.handleValidationError(field, value, constraint);

export const handleAuthError = (reason: AuthenticationError['reason']) => 
  errorHandler.handleAuthError(reason);

export const handleAsync = <T>(asyncFn: () => Promise<T>, context?: string) => 
  errorHandler.handleAsync(asyncFn, context);

export const handleIf = (condition: boolean, error: string | AppError, context?: string) => 
  errorHandler.handleIf(condition, error, context);