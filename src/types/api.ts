// API 응답 및 요청 타입 정의

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export interface DatabaseError extends SupabaseError {
  table?: string;
  column?: string;
  constraint?: string;
}

export interface NetworkError {
  status: number;
  statusText: string;
  url: string;
}

export type ApiError = SupabaseError | DatabaseError | NetworkError | Error;

// 공통 요청 타입
export interface BaseRequest {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Edge Function 응답 타입
export interface EdgeFunctionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 파일 업로드 관련 타입
export interface FileUploadResponse {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface UploadError {
  code: string;
  message: string;
  file?: string;
}