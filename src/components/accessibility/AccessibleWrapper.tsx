
import { cn } from '@/lib/utils';

interface AccessibleWrapperProps {
  children: React.ReactNode;
  className?: string;
  announcement?: string;
  focusOnMount?: boolean;
  trapFocus?: boolean;
  skipLinks?: Array<{ href: string; label: string }>;
  landmarkRole?: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'region';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  [key: string]: any;
}

export const AccessibleWrapper = ({
  children,
  className,
  skipLinks = [],
  landmarkRole,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ...props
}: AccessibleWrapperProps) => {
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
};

// Screen reader only text component
export const ScreenReaderOnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
);

// Live region for announcements
export const LiveRegion = ({
  children,
  priority = 'polite',
  atomic = true,
}: {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
}) => (
  <div
    className="sr-only"
    aria-live={priority}
    aria-atomic={atomic}
  >
    {children}
  </div>
);
