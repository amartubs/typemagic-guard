
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
  Database,
  Monitor,
  Star,
  CreditCard,
  BookOpen,
  Users,
  TestTube,
  Lock
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
  };

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
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            <Button
              variant={isActive('/features') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/features" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Features
              </Link>
            </Button>

            <Button
              variant={isActive('/demo-environment') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/demo-environment" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Demo Environment
              </Link>
            </Button>

            {isProfessionalOrHigher && (
              <Button
                variant={isActive('/analytics') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </Button>
            )}

            <Button
              variant={isActive('/pricing') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/pricing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pricing
              </Link>
            </Button>

            {isEnterprise && (
              <Button
                variant={isActive('/enterprise') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/enterprise" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Enterprise
                </Link>
              </Button>
            )}

            {isAdmin && (
              <Button
                variant={isActive('/admin') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/admin" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}

            {isSuperAdmin && (
              <>
                <Button
                  variant={isActive('/auth') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/auth" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Auth
                  </Link>
                </Button>
                
                <Button
                  variant={isActive('/reset-password') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/reset-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Reset Password
                  </Link>
                </Button>
              </>
            )}
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
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/features" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Features
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/demo-environment" className="flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      Demo Environment
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/pricing" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pricing
                    </Link>
                  </DropdownMenuItem>
                  
                  {isProfessionalOrHigher && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isEnterprise && (
                    <DropdownMenuItem asChild>
                      <Link to="/enterprise" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Enterprise
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isSuperAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/auth" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Auth
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/reset-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Reset Password
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
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
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/onboarding" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Getting Started
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Support
                  </Link>
                </DropdownMenuItem>
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
