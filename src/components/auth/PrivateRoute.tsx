
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
    console.log('PrivateRoute check:', { 
      user: !!user, 
      loading, 
      pathname: location.pathname,
      userEmail: user?.email 
    });
  }, [user, loading, location.pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
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
