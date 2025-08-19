/**
 * Log Migration Utility - console.log를 logger로 마이그레이션
 * 
 * 기존 console.log 사용을 logger로 대체하는 유틸리티
 */

import { logger } from './logger';

/**
 * 로그 레벨 타입
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 로그 컨텍스트 타입 - ErrorContext 확장
 */
export interface LogContext {
  component?: string;
  function?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
  timestamp?: string;
  action?: string;
  additionalData?: Record<string, unknown>;
}

/**
 * 로그 마이그레이션 유틸리티 클래스
 */
export class LogMigration {
  /**
   * console.log 대신 사용할 로거 래퍼
   */
  static log(message: string, data?: any, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${context?.component || 'App'}] ${message}`, data);
    }
    
    const errorContext = this.convertToErrorContext(context);
    if (data) {
      errorContext.additionalData = { ...errorContext.additionalData, data: this.sanitizeData(data) };
    }
    
    logger.info(message, errorContext);
  }

  /**
   * console.error 대신 사용할 에러 로거
   */
  static error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context?.component || 'App'}] ${message}`, error);
    }
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const errorContext = this.convertToErrorContext(context);
    logger.error(message, errorObj, errorContext);
  }

  /**
   * console.warn 대신 사용할 경고 로거
   */
  static warn(message: string, data?: any, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[${context?.component || 'App'}] ${message}`, data);
    }
    
    const errorContext = this.convertToErrorContext(context);
    if (data) {
      errorContext.additionalData = { ...errorContext.additionalData, data: this.sanitizeData(data) };
    }
    
    logger.warn(message, errorContext);
  }

  /**
   * 디버그 로깅 (개발 환경에서만)
   */
  static debug(message: string, data?: any, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] [${context?.component || 'App'}] ${message}`, data);
    }
    
    const errorContext = this.convertToErrorContext(context);
    if (data) {
      errorContext.additionalData = { ...errorContext.additionalData, data: this.sanitizeData(data) };
    }
    
    logger.debug(message, errorContext);
  }

  /**
   * API 관련 로깅
   */
  static apiLog(method: string, url: string, status?: number, data?: any, context?: LogContext): void {
    const message = `${method} ${url}${status ? ` - ${status}` : ''}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${message}`, data);
    }
    
    if (status && status >= 400) {
      logger.apiError(message, data, url);
    } else {
      const errorContext = this.convertToErrorContext(context);
      errorContext.additionalData = {
        ...errorContext.additionalData,
        api: { method, url, status },
        data: data ? this.sanitizeData(data) : undefined
      };
      logger.info(message, errorContext);
    }
  }

  /**
   * 성능 관련 로깅
   */
  static performanceLog(operation: string, duration: number, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${operation}: ${duration.toFixed(2)}ms`);
    }
    
    logger.performanceLog(operation, duration, 'ms');
    
    // 느린 작업 경고
    if (duration > 1000) {
      const errorContext = this.convertToErrorContext(context);
      errorContext.additionalData = {
        ...errorContext.additionalData,
        performance: { operation, duration, unit: 'ms' }
      };
      logger.warn(`Slow operation detected: ${operation}`, errorContext);
    }
  }

  /**
   * 사용자 액션 로깅
   */
  static userAction(action: string, userId?: string, data?: any, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[User Action] ${action}`, { userId, data });
    }
    
    logger.userAction(action, userId, {
      ...this.sanitizeData(data),
      ...context?.additionalData
    });
  }

  /**
   * 컴포넌트 생명주기 로깅
   */
  static componentLog(componentName: string, lifecycle: 'mount' | 'unmount' | 'update', data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Component] ${componentName} ${lifecycle}`, data);
    }
    
    const errorContext = this.convertToErrorContext({
      component: componentName,
      additionalData: {
        lifecycle,
        data: data ? this.sanitizeData(data) : undefined
      }
    });
    logger.debug(`Component ${lifecycle}: ${componentName}`, errorContext);
  }

  /**
   * 비즈니스 로직 로깅
   */
  static businessLog(operation: string, result: 'success' | 'failure', data?: any, context?: LogContext): void {
    const message = `Business operation: ${operation} - ${result}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Business] ${message}`, data);
    }
    
    const errorContext = this.convertToErrorContext(context);
    errorContext.additionalData = {
      ...errorContext.additionalData,
      business: { operation, result },
      data: data ? this.sanitizeData(data) : undefined
    };
    
    if (result === 'failure') {
      logger.warn(message, errorContext);
    } else {
      logger.info(message, errorContext);
    }
  }

  /**
   * 데이터 정제 - 민감한 정보 제거
   */
  private static sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = ['password', 'token', 'apikey', 'secret', 'auth', 'credential'];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    });

    return sanitized;
  }

  /**
   * 조건부 로깅 - 특정 조건에서만 로깅
   */
  static conditionalLog(
    condition: boolean | (() => boolean),
    level: LogLevel,
    message: string,
    data?: any,
    context?: LogContext
  ): void {
    const shouldLog = typeof condition === 'function' ? condition() : condition;
    
    if (!shouldLog) return;

    switch (level) {
      case 'debug':
        this.debug(message, data, context);
        break;
      case 'info':
        this.log(message, data, context);
        break;
      case 'warn':
        this.warn(message, data, context);
        break;
      case 'error':
        this.error(message, data, context);
        break;
    }
  }

  /**
   * LogContext를 ErrorContext로 변환
   */
  private static convertToErrorContext(context?: LogContext): import('@/types/errors').ErrorContext {
    return {
      userId: context?.userId,
      sessionId: context?.sessionId,
      route: context?.route || window?.location?.pathname || '/',
      userAgent: context?.userAgent || navigator?.userAgent || 'unknown',
      timestamp: context?.timestamp || new Date().toISOString(),
      additionalData: {
        component: context?.component,
        function: context?.function,
        action: context?.action,
        ...context?.additionalData
      }
    };
  }

  /**
   * 배치 로깅 - 여러 로그를 한 번에 처리
   */
  static batchLog(logs: Array<{
    level: LogLevel;
    message: string;
    data?: any;
    context?: LogContext;
  }>): void {
    logs.forEach(({ level, message, data, context }) => {
      this.conditionalLog(true, level, message, data, context);
    });
  }
}

// 편의 함수들 - 기존 console.log를 쉽게 대체할 수 있도록
export const migrationLog = LogMigration.log;
export const migrationError = LogMigration.error;
export const migrationWarn = LogMigration.warn;
export const migrationDebug = LogMigration.debug;
export const migrationApiLog = LogMigration.apiLog;
export const migrationPerformanceLog = LogMigration.performanceLog;
export const migrationUserAction = LogMigration.userAction;
export const migrationComponentLog = LogMigration.componentLog;
export const migrationBusinessLog = LogMigration.businessLog;