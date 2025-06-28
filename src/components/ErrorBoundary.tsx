
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 에러 로깅 (운영 환경에서는 외부 서비스로 전송)
    if (process.env.NODE_ENV === 'production') {
      // 여기에 Sentry나 다른 에러 추적 서비스 연동
      console.error('Production error logged:', { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              문제가 발생했습니다
            </h2>
            <p className="text-red-600 mb-4">
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
