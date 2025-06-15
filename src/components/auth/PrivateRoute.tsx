
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('PrivateRoute state:', { 
      user: !!user, 
      loading, 
      pathname: location.pathname,
      userEmail: user?.email 
    });
  }, [user, loading, location.pathname]);

  // Show loading only for a reasonable amount of time
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-sm text-muted-foreground">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to auth from:', location.pathname);
    // Redirect to auth page but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
