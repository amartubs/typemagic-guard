
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { globalErrorHandler } from '@/lib/errorHandling/globalErrorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  isolate?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      errorId: Math.random().toString(36).substr(2, 9)
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to global error handler
    globalErrorHandler.handleError(error, 'React Error Boundary');

    // Log detailed error information
    console.group(`🚨 Error Boundary Caught Error [${this.state.errorId}]`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  };

  handleReset = () => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    if (this.state.error && this.state.errorId) {
      const errorReport = {
        errorId: this.state.errorId,
        message: this.state.error.message,
        stack: this.state.error.stack,
        componentStack: this.state.errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.log('Error Report:', errorReport);
      // In production, this would send to an error reporting service
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.retryCount < this.maxRetries;

      return (
        <Card className="w-full max-w-md mx-auto mt-8 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                We've encountered an unexpected error. Our team has been notified.
              </p>
              {this.state.errorId && (
                <p className="font-mono text-xs bg-muted p-2 rounded">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs bg-muted p-3 rounded border">
                <summary className="cursor-pointer font-medium mb-2 flex items-center gap-1">
                  <Bug className="h-3 w-3" />
                  Error Details
                </summary>
                <div className="space-y-2 pl-4">
                  <div>
                    <strong>Message:</strong>
                    <pre className="mt-1 whitespace-pre-wrap text-xs">{this.state.error.message}</pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs max-h-32 overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs max-h-32 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              {canRetry && (
                <Button onClick={this.handleRetry} className="flex-1" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again {this.retryCount > 0 && `(${this.maxRetries - this.retryCount} left)`}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="flex-1"
                size="sm"
              >
                Refresh Page
              </Button>

              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="flex-1"
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={this.handleReportError}
              className="w-full text-xs"
              size="sm"
            >
              <Bug className="h-3 w-3 mr-1" />
              Report Issue
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
