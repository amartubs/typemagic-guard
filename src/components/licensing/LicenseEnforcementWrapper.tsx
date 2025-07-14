import React, { useEffect } from 'react';
import { useLicenseValidation } from '@/hooks/useLicenseValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lock } from 'lucide-react';

interface LicenseEnforcementWrapperProps {
  children: React.ReactNode;
  requiredFeature?: string;
  fallback?: React.ReactNode;
  blockOnViolation?: boolean;
}

export const LicenseEnforcementWrapper: React.FC<LicenseEnforcementWrapperProps> = ({
  children,
  requiredFeature,
  fallback,
  blockOnViolation = false
}) => {
  const { isValid, canAccessFeature, errors, checkAuthenticationLimit } = useLicenseValidation();

  // Check if specific feature is required and accessible
  const hasFeatureAccess = requiredFeature ? canAccessFeature(requiredFeature) : true;

  // Check for license violations that should block access
  const hasViolations = errors.some(error => 
    error.includes('limit exceeded') || error.includes('expired')
  );

  // If blocking on violations and there are violations, show fallback
  if (blockOnViolation && hasViolations) {
    return fallback || (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Access blocked due to license violations. Please upgrade your plan or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  // If specific feature is required but not accessible, show fallback
  if (requiredFeature && !hasFeatureAccess) {
    return fallback || (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This feature requires a higher license tier. Please upgrade your plan to access it.
        </AlertDescription>
      </Alert>
    );
  }

  // Show warnings if license is not valid but not blocking
  if (!isValid && !blockOnViolation) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            License issues detected. Some features may be limited.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};