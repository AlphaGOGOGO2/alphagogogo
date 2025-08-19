// React 컴포넌트용 에러 처리 훅

import { useCallback, useState } from "react";
import { errorHandler } from "@/utils/errorHandler";
import type { AppError } from "@/types/errors";

interface UseErrorHandlerOptions {
  context?: string;
  showToast?: boolean;
  logError?: boolean;
}

interface ErrorState {
  error: AppError | null;
  hasError: boolean;
  isLoading: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    isLoading: false
  });

  // 에러 처리 함수
  const handleError = useCallback((error: unknown, context?: string) => {
    const normalizedError = errorHandler.handle(error, context || options.context, {
      showToast: options.showToast,
      logError: options.logError
    });

    setErrorState({
      error: normalizedError,
      hasError: true,
      isLoading: false
    });

    return normalizedError;
  }, [options]);

  // 에러 상태 초기화
  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      isLoading: false
    });
  }, []);

  // 로딩 상태 설정
  const setLoading = useCallback((loading: boolean) => {
    setErrorState(prev => ({
      ...prev,
      isLoading: loading
    }));
  }, []);

  // 비동기 작업 래퍼
  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      setLoading(true);
      clearError();
      
      const result = await asyncFn();
      setLoading(false);
      return result;
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError, setLoading, clearError]);

  // API 호출 래퍼
  const executeApi = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint?: string
  ): Promise<T | null> => {
    return executeAsync(apiCall, `API: ${endpoint}`);
  }, [executeAsync]);

  // 폼 제출 래퍼
  const executeFormSubmit = useCallback(async <T>(
    submitFn: () => Promise<T>,
    formName?: string
  ): Promise<T | null> => {
    return executeAsync(submitFn, `Form: ${formName}`);
  }, [executeAsync]);

  // 조건부 에러 처리
  const handleErrorIf = useCallback((
    condition: boolean,
    error: string | AppError,
    context?: string
  ) => {
    if (condition) {
      handleError(error, context);
    }
  }, [handleError]);

  // 검증 에러 처리
  const handleValidationError = useCallback((
    field: string,
    value: unknown,
    constraint: string
  ) => {
    return errorHandler.handleValidationError(field, value, constraint);
  }, []);

  return {
    // 상태
    error: errorState.error,
    hasError: errorState.hasError,
    isLoading: errorState.isLoading,
    
    // 메서드
    handleError,
    clearError,
    setLoading,
    executeAsync,
    executeApi,
    executeFormSubmit,
    handleErrorIf,
    handleValidationError,

    // 편의 프로퍼티
    isError: errorState.hasError,
    errorMessage: errorState.error?.message,
    errorCode: errorState.error?.code
  };
}

// 특화된 훅들
export function useApiErrorHandler(endpoint?: string) {
  return useErrorHandler({
    context: `API: ${endpoint}`,
    showToast: true,
    logError: true
  });
}

export function useFormErrorHandler(formName?: string) {
  return useErrorHandler({
    context: `Form: ${formName}`,
    showToast: true,
    logError: false
  });
}

export function useValidationErrorHandler() {
  return useErrorHandler({
    context: 'Validation',
    showToast: true,
    logError: false
  });
}