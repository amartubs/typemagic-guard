
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
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
  Home,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Building2,
  Shield,
  LogOut,
  Menu,
  Crown,
  Key,
  Star,
  CreditCard,
  TestTube,
  Lock,
  BookOpen
} from 'lucide-react';

const MainNavigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Check if user is superadmin
  const isSuperAdmin = user?.email === 'craigfubara@yahoo.co.uk';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;
  const isEnterprise = user?.subscription?.tier === 'enterprise' || isSuperAdmin;
  const isProfessionalOrHigher = ['professional', 'enterprise'].includes(user?.subscription?.tier || '') || isSuperAdmin;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Main navigation items for desktop
  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, show: true },
    { path: '/features', label: 'Features', icon: Star, show: true },
    { path: '/demo-environment', label: 'Demo Environment', icon: TestTube, show: true },
    { path: '/pricing', label: 'Pricing', icon: CreditCard, show: true },
    { path: '/dashboard', label: 'Analytics', icon: BarChart3, show: isProfessionalOrHigher },
    { path: '/enterprise', label: 'Enterprise', icon: Building2, show: isEnterprise },
    { path: '/admin', label: 'Admin', icon: Crown, show: isAdmin },
  ];

  // Super admin only items
  const superAdminItems = [
    { path: '/auth', label: 'Auth', icon: Key },
    { path: '/reset-password', label: 'Reset Password', icon: Lock },
  ];

  // User menu items
  const userMenuItems = [
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/onboarding', label: 'Getting Started', icon: BookOpen },
    { path: '/support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and main nav */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Shoale</span>
          </Link>

          {/* Desktop Navigation */}
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
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu */}
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

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">{user?.name || user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  {isSuperAdmin && (
                    <p className="text-xs text-purple-600 font-medium">Super Admin</p>
                  )}
                  {isAdmin && !isSuperAdmin && (
                    <p className="text-xs text-primary font-medium">Admin</p>
                  )}
                  {isEnterprise && !isSuperAdmin && (
                    <p className="text-xs text-purple-600 font-medium">Enterprise</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
