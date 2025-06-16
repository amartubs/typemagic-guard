
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  Star,
  CreditCard,
  TestTube,
  Building2,
  Crown,
  Key,
  Lock,
  Home,
  Menu
} from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  show: boolean;
}

interface MobileNavigationProps {
  isProfessionalOrHigher: boolean;
  isEnterprise: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isProfessionalOrHigher,
  isEnterprise,
  isAdmin,
  isSuperAdmin
}) => {
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
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {mainNavItems.map((item) => item.show && (
              <DropdownMenuItem key={item.path} asChild>
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}

            {isSuperAdmin && superAdminItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileNavigation;
