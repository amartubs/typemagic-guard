
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
  // Early defensive check for React hooks - before any hooks are called
  if (!React || !React.useRef || !React.useEffect || !React.useState || !React.useCallback) {
    console.error('React hooks not available in AccessibleWrapper');
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
        <div className={cn(className)} {...props}>
          {children}
        </div>
      </>
    );
  }

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Inline accessibility logic to avoid hook dependency issues
  const [isKeyboardUser, setIsKeyboardUser] = React.useState(false);
  const [announcements, setAnnouncements] = React.useState<string[]>([]);

  React.useEffect(() => {
    const handleKeyDown = () => setIsKeyboardUser(true);
    const handleMouseDown = () => setIsKeyboardUser(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Create a temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
      setAnnouncements(prev => prev.filter(a => a !== message));
    }, 1000);
  }, []);

  // Inline focus management logic
  const lastFocusedElement = React.useRef<HTMLElement | null>(null);

  const trapFocusLogic = React.useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  React.useEffect(() => {
    if (announcement) {
      announce(announcement);
    }
  }, [announcement, announce]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (focusOnMount) {
      // Set tabindex to make container focusable
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    if (trapFocus) {
      return trapFocusLogic(container);
    }
  }, [focusOnMount, trapFocus, trapFocusLogic]);

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
                onFocus={(e) => e.currentTarget.classList.remove('sr-only')}
                onBlur={(e) => e.currentTarget.classList.add('sr-only')}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div
        ref={ref || containerRef}
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
