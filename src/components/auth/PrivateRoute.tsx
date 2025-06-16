
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    console.log('No user found, redirecting to auth from:', location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default PrivateRoute;
