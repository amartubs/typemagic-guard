
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Star,
  CreditCard,
  TestTube,
  Building2,
  Crown,
  Key,
  Lock,
  Home
} from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  show: boolean;
}

interface DesktopNavigationProps {
  isProfessionalOrHigher: boolean;
  isEnterprise: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  isProfessionalOrHigher,
  isEnterprise,
  isAdmin,
  isSuperAdmin
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const mainNavItems: NavigationItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, show: true },
    { path: '/features', label: 'Features', icon: Star, show: true },
    { path: '/demo-environment', label: 'Demo Environment', icon: TestTube, show: true },
    { path: '/pricing', label: 'Pricing', icon: CreditCard, show: true },
    { path: '/dashboard', label: 'Analytics', icon: BarChart3, show: isProfessionalOrHigher },
    { path: '/enterprise', label: 'Enterprise', icon: Building2, show: isEnterprise },
    { path: '/admin', label: 'Admin', icon: Crown, show: isAdmin },
  ];

  const superAdminItems: NavigationItem[] = [
    { path: '/auth', label: 'Auth', icon: Key },
    { path: '/reset-password', label: 'Reset Password', icon: Lock },
  ];

  return (
    <div className="hidden md:flex items-center space-x-4">
      {mainNavItems.map((item) => item.show && (
        <Button
          key={item.path}
          variant={isActive(item.path) ? 'default' : 'ghost'}
          size="sm"
          asChild
        >
          <Link to={item.path} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}

      {isSuperAdmin && superAdminItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? 'default' : 'ghost'}
          size="sm"
          asChild
        >
          <Link to={item.path} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default DesktopNavigation;
