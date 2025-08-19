// 에러 폴백 컴포넌트

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { AppError } from "@/types/errors";

interface ErrorFallbackProps {
  error?: AppError | Error;
  resetError?: () => void;
  context?: string;
  minimal?: boolean;
}

export function ErrorFallback({ 
  error, 
  resetError, 
  context = "애플리케이션",
  minimal = false
}: ErrorFallbackProps) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : (error as AppError)?.message || "알 수 없는 오류가 발생했습니다.";

  const errorCode = error instanceof Error 
    ? error.name 
    : (error as AppError)?.code || "UNKNOWN_ERROR";

  const handleReload = () => {
    window.location.reload();
  };

  if (minimal) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="h-8 w-8 text-orange-500 mb-2" />
        <p className="text-sm text-gray-600 mb-3">{errorMessage}</p>
        <div className="flex gap-2">
          {resetError && (
            <Button variant="outline" size="sm" onClick={resetError}>
              <RefreshCw className="h-4 w-4 mr-1" />
              다시 시도
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleReload}>
            새로고침
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-xl">오류 발생</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <p className="text-gray-600 mb-2">
              {context}에서 오류가 발생했습니다.
            </p>
            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded border">
              {errorMessage}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-400 mt-1">
                오류 코드: {errorCode}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {resetError && (
              <Button onClick={resetError} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                다시 시도
              </Button>
            )}
            
            <Button variant="outline" onClick={handleReload} className="w-full">
              페이지 새로고침
            </Button>
            
            <Button variant="ghost" asChild className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && error instanceof Error && error.stack && (
            <details className="text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                개발자 정보 (스택 트레이스)
              </summary>
              <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 에러 바운더리용 컴포넌트
interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }: ErrorBoundaryFallbackProps) {
  return (
    <ErrorFallback
      error={error}
      resetError={resetErrorBoundary}
      context="컴포넌트"
    />
  );
}

// 네트워크 에러 전용 컴포넌트
export function NetworkErrorFallback({ 
  onRetry, 
  status 
}: { 
  onRetry?: () => void; 
  status?: number;
}) {
  const getStatusMessage = (status?: number) => {
    switch (status) {
      case 404:
        return "요청한 페이지를 찾을 수 없습니다.";
      case 500:
        return "서버에 문제가 발생했습니다.";
      case 403:
        return "접근 권한이 없습니다.";
      default:
        return "네트워크 연결을 확인해주세요.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">연결 문제</h3>
      <p className="text-gray-600 mb-4">{getStatusMessage(status)}</p>
      
      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          다시 시도
        </Button>
      )}
    </div>
  );
}

// 로딩 에러 컴포넌트
export function LoadingErrorFallback({ 
  onRetry, 
  message = "데이터를 불러오는 중 오류가 발생했습니다."
}: { 
  onRetry?: () => void; 
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="h-6 w-6 text-orange-500 mb-2" />
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-1" />
          다시 시도
        </Button>
      )}
    </div>
  );
}