// 에러 처리 관련 타입 정의

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  timestamp: string;
}

export interface ValidationError extends AppError {
  field: string;
  value: unknown;
  constraint: string;
}

export interface NetworkError extends AppError {
  status: number;
  statusText: string;
  url: string;
  method: string;
}

export interface DatabaseError extends AppError {
  table?: string;
  column?: string;
  constraint?: string;
  query?: string;
}

export interface AuthenticationError extends AppError {
  reason: 'invalid_credentials' | 'token_expired' | 'insufficient_permissions';
}

export interface FileUploadError extends AppError {
  fileName: string;
  fileSize: number;
  fileType: string;
  maxSize?: number;
  allowedTypes?: string[];
}

// 에러 핸들러 타입
export type ErrorHandler = (error: AppError) => void;

// 에러 리포터 타입
export interface ErrorReporter {
  report: (error: AppError) => Promise<void>;
  reportBatch: (errors: AppError[]) => Promise<void>;
}

// 에러 컨텍스트
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  route: string;
  userAgent: string;
  timestamp: string;
  additionalData?: Record<string, unknown>;
}

// 에러 로그 레벨
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// 로그 엔트리
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: ErrorContext;
  error?: AppError;
}