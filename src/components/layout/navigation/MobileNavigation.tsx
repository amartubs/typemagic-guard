
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
    { path: '/auth', label: 'Auth', icon: Key, show: true },
    { path: '/reset-password', label: 'Reset Password', icon: Lock, show: true },
  ];

  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 w-10 p-0 hover:bg-muted/50 active:bg-muted"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 mr-4 bg-background/95 backdrop-blur-md border shadow-lg" 
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-sm font-medium px-3 py-2">
            Navigation
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {mainNavItems.map((item) => item.show && (
              <DropdownMenuItem key={item.path} asChild>
                <Link 
                  to={item.path} 
                  className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/50 active:bg-muted transition-colors"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}

            {isSuperAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium px-3 py-1 text-muted-foreground">
                  Super Admin
                </DropdownMenuLabel>
                {superAdminItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link 
                      to={item.path} 
                      className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/50 active:bg-muted transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileNavigation;
