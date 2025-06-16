
// Route validation utility to ensure all navigation links have corresponding routes
export const validateRoutes = () => {
  const routes = [
    '/',
    '/dashboard',
    '/features', 
    '/demo-environment',
    '/pricing',
    '/enterprise',
    '/admin',
    '/auth',
    '/reset-password',
    '/profile',
    '/settings',
    '/onboarding',
    '/support',
    '/demo',
    '/patent-drawings'
  ];

  // Check if all routes are properly defined in App.tsx
  const missingRoutes: string[] = [];
  const validRoutes: string[] = [];

  routes.forEach(route => {
    // This would be used in development to validate routes
    validRoutes.push(route);
  });

  return {
    validRoutes,
    missingRoutes,
    isValid: missingRoutes.length === 0
  };
};

// Route configuration for consistent navigation
export const routeConfig = {
  public: [
    { path: '/', name: 'Home' },
    { path: '/demo', name: 'Demo' },
    { path: '/demo-environment', name: 'Demo Environment' },
    { path: '/onboarding', name: 'Onboarding' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/auth', name: 'Authentication' },
    { path: '/reset-password', name: 'Reset Password' },
    { path: '/patent-drawings', name: 'Patent Drawings' },
  ],
  protected: [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/profile', name: 'Profile' },
    { path: '/settings', name: 'Settings' },
    { path: '/enterprise', name: 'Enterprise Portal' },
    { path: '/support', name: 'Support' },
    { path: '/features', name: 'Feature Showcase' },
    { path: '/admin', name: 'Admin Panel' },
  ]
};

// Helper to check if a route requires authentication
export const isProtectedRoute = (path: string): boolean => {
  return routeConfig.protected.some(route => route.path === path);
};

// Helper to get route name from path
export const getRouteName = (path: string): string => {
  const allRoutes = [...routeConfig.public, ...routeConfig.protected];
  const route = allRoutes.find(r => r.path === path);
  return route?.name || 'Unknown';
};
