
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const popularRoutes = [
    { path: '/', name: 'Home', public: true },
    { path: '/dashboard', name: 'Dashboard', public: false },
    { path: '/demo', name: 'Demo', public: true },
    { path: '/pricing', name: 'Pricing', public: true },
    { path: '/features', name: 'Features', public: false },
    { path: '/support', name: 'Support', public: false },
  ];

  const availableRoutes = popularRoutes.filter(route => 
    route.public || user
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Path: <code className="bg-muted px-1 rounded">{location.pathname}</code>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go to Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {availableRoutes.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Popular pages:</p>
              <div className="grid gap-1">
                {availableRoutes.map((route) => (
                  <Button
                    key={route.path}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="justify-start h-8"
                  >
                    <Link to={route.path}>
                      {route.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
