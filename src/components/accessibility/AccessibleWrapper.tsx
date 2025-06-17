
import * as React from 'react';
import { cn } from '@/lib/utils';

interface AccessibleWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  announcement?: string;
  focusOnMount?: boolean;
  trapFocus?: boolean;
  skipLinks?: Array<{ href: string; label: string }>;
  landmarkRole?: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'region';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export const AccessibleWrapper = React.forwardRef<HTMLDivElement, AccessibleWrapperProps>(({
  children,
  className,
  announcement,
  focusOnMount = false,
  trapFocus = false,
  skipLinks = [],
  landmarkRole,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ...props
}, ref) => {
  return (
    <>
      {/* Skip Links */}
      {skipLinks.length > 0 && (
        <div className="sr-only focus-within:not-sr-only">
          <nav aria-label="Skip navigation links">
            {skipLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="absolute top-0 left-0 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-br focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div
        ref={ref}
        className={cn(className)}
        role={landmarkRole}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {children}
      </div>
    </>
  );
});

AccessibleWrapper.displayName = 'AccessibleWrapper';

// Screen reader only text component
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Live region for announcements
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
}> = ({ children, priority = 'polite', atomic = true }) => (
  <div
    className="sr-only"
    aria-live={priority}
    aria-atomic={atomic}
  >
    {children}
  </div>
);
