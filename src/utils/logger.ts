// 프로덕션용 로깅 시스템

import type { LogLevel, LogEntry, ErrorContext, AppError } from '@/types/errors';

class Logger {
  private static instance: Logger;
  private isDevelopment = import.meta.env.DEV;
  private logQueue: LogEntry[] = [];
  private maxQueueSize = 100;

  private constructor() {
    // 프로덕션에서 주기적으로 로그 전송
    if (!this.isDevelopment) {
      setInterval(() => {
        this.flushLogs();
      }, 30000); // 30초마다
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: ErrorContext,
    error?: AppError
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context || this.getDefaultContext(),
      error
    };
  }

  private getDefaultContext(): ErrorContext {
    return {
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  private log(level: LogLevel, message: string, context?: ErrorContext, error?: AppError): void {
    const entry = this.createLogEntry(level, message, context, error);

    // 개발 환경에서는 콘솔에 출력
    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(`[${entry.timestamp}] ERROR:`, message, error || '');
          break;
        case 'warn':
          console.warn(`[${entry.timestamp}] WARN:`, message);
          break;
        case 'info':
          console.info(`[${entry.timestamp}] INFO:`, message);
          break;
        case 'debug':
          console.debug(`[${entry.timestamp}] DEBUG:`, message);
          break;
      }
    }

    // 프로덕션 환경에서는 큐에 저장
    if (!this.isDevelopment && level !== 'debug') {
      this.logQueue.push(entry);
      
      if (this.logQueue.length >= this.maxQueueSize) {
        this.flushLogs();
      }
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    try {
      // 실제 프로덕션에서는 로그 서버로 전송
      // 현재는 중요한 에러만 콘솔에 출력
      const errors = this.logQueue.filter(entry => entry.level === 'error');
      if (errors.length > 0) {
        console.error(`[Logger] ${errors.length} errors occurred:`, errors);
      }

      this.logQueue = [];
    } catch (error) {
      console.error('[Logger] Failed to flush logs:', error);
    }
  }

  // 공개 메서드들
  public error(message: string, error?: AppError | Error, context?: ErrorContext): void {
    const appError: AppError = error instanceof Error ? {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    } : error;

    this.log('error', message, context, appError);
  }

  public warn(message: string, context?: ErrorContext): void {
    this.log('warn', message, context);
  }

  public info(message: string, context?: ErrorContext): void {
    this.log('info', message, context);
  }

  public debug(message: string, context?: ErrorContext): void {
    this.log('debug', message, context);
  }

  // 특화된 로깅 메서드들
  public apiError(message: string, error: unknown, url?: string): void {
    const context: ErrorContext = {
      ...this.getDefaultContext(),
      additionalData: { url }
    };
    
    this.error(`API Error: ${message}`, error as AppError, context);
  }

  public userAction(action: string, userId?: string, additionalData?: Record<string, unknown>): void {
    const context: ErrorContext = {
      ...this.getDefaultContext(),
      userId,
      additionalData
    };
    
    this.info(`User Action: ${action}`, context);
  }

  public performanceLog(metric: string, value: number, unit: string = 'ms'): void {
    const context: ErrorContext = {
      ...this.getDefaultContext(),
      additionalData: { metric, value, unit }
    };
    
    this.info(`Performance: ${metric} = ${value}${unit}`, context);
  }

  // 서비스 워커 지원
  public setupServiceWorkerLogging(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'LOG') {
          this.log(event.data.level, event.data.message);
        }
      });
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const logger = Logger.getInstance();

// 편의 함수들
export const logError = (message: string, error?: AppError | Error, context?: ErrorContext) => {
  logger.error(message, error, context);
};

export const logWarn = (message: string, context?: ErrorContext) => {
  logger.warn(message, context);
};

export const logInfo = (message: string, context?: ErrorContext) => {
  logger.info(message, context);
};

export const logDebug = (message: string, context?: ErrorContext) => {
  logger.debug(message, context);
};

export const logApiError = (message: string, error: unknown, url?: string) => {
  logger.apiError(message, error, url);
};

export const logUserAction = (action: string, userId?: string, additionalData?: Record<string, unknown>) => {
  logger.userAction(action, userId, additionalData);
};

export const logPerformance = (metric: string, value: number, unit?: string) => {
  logger.performanceLog(metric, value, unit);
};