
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars';
  className?: string;
  'aria-label'?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'md',
  variant = 'default',
  className,
  'aria-label': ariaLabel
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const renderSpinner = () => {
    const baseClasses = cn(sizeClasses[size], 'text-primary');
    
    switch (variant) {
      case 'dots':
        return (
          <div className={cn("flex space-x-1", className)} role="status" aria-label={ariaLabel || message}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-current animate-pulse',
                  size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
            <span className="sr-only">{message}</span>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn("relative", className)} role="status" aria-label={ariaLabel || message}>
            <div className={cn(baseClasses, 'rounded-full bg-current animate-ping opacity-75')} />
            <div className={cn(baseClasses, 'rounded-full bg-current absolute inset-0 animate-pulse')} />
            <span className="sr-only">{message}</span>
          </div>
        );
      
      case 'bars':
        return (
          <div className={cn("flex space-x-1 items-end", className)} role="status" aria-label={ariaLabel || message}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-current animate-pulse',
                  size === 'sm' ? 'w-0.5 h-3' : size === 'lg' ? 'w-1 h-6' : 'w-0.5 h-4'
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
            <span className="sr-only">{message}</span>
          </div>
        );
      
      default:
        return (
          <div className={cn("relative", className)} role="status" aria-label={ariaLabel || message}>
            <div className={cn(baseClasses, 'animate-spin rounded-full border-2 border-muted border-t-current')} />
            <span className="sr-only">{message}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4">
      {renderSpinner()}
      {message && (
        <div className={cn(textSizeClasses[size], "text-muted-foreground text-center font-medium")}>
          {message}
        </div>
      )}
    </div>
  );
};

// Skeleton loader component for better UX
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
  'aria-label'?: string;
}> = ({ 
  lines = 3, 
  className,
  'aria-label': ariaLabel = "Loading content..."
}) => {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-label={ariaLabel}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted rounded animate-pulse",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Page loading component
export const PageLoader: React.FC<{
  message?: string;
}> = ({ message = "Loading page..." }) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <LoadingSpinner size="lg" message={message} variant="default" />
    </div>
  );
};

export default LoadingSpinner;
