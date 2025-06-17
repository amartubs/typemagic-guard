import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { routeConfig, isProtectedRoute } from '@/utils/routeValidation';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const goTo = (path: string) => {
    // Check if route requires authentication
    if (isProtectedRoute(path) && !user) {
      navigate('/auth', { state: { from: path } });
      return;
    }
    navigate(path);
  };

  const goBack = () => {
    window.history.back();
  };

  const goHome = () => {
    navigate('/');
  };

  const goToDashboard = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const isCurrentRoute = (path: string) => {
    return location.pathname === path;
  };

  const getAvailableRoutes = () => {
    const allRoutes = [...routeConfig.public, ...routeConfig.protected];
    return allRoutes.filter(route => 
      !isProtectedRoute(route.path) || user
    );
  };

  const getCurrentRouteName = () => {
    const allRoutes = [...routeConfig.public, ...routeConfig.protected];
    const currentRoute = allRoutes.find(route => route.path === location.pathname);
    return currentRoute?.name || 'Unknown Page';
  };

  return {
    goTo,
    goBack,
    goHome,
    goToDashboard,
    isCurrentRoute,
    getAvailableRoutes,
    getCurrentRouteName,
    currentPath: location.pathname,
    isAuthenticated: !!user
  };
};

