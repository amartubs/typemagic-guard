
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Shield, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-[#9b87f5]" />
          <span className="font-bold text-xl">Shoale</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-[#9b87f5] ${
                  isActive('/dashboard') ? 'text-[#9b87f5]' : 'text-foreground/60'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/demo" 
                className={`text-sm font-medium transition-colors hover:text-[#9b87f5] ${
                  isActive('/demo') || isActive('/demo-environment') ? 'text-[#9b87f5]' : 'text-foreground/60'
                }`}
              >
                Demo
              </Link>
              <Link 
                to="/support" 
                className={`text-sm font-medium transition-colors hover:text-[#9b87f5] ${
                  isActive('/support') ? 'text-[#9b87f5]' : 'text-foreground/60'
                }`}
              >
                Support
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/demo" 
                className={`text-sm font-medium transition-colors hover:text-[#9b87f5] ${
                  isActive('/demo') || isActive('/demo-environment') ? 'text-[#9b87f5]' : 'text-foreground/60'
                }`}
              >
                Demo
              </Link>
              <Link 
                to="/pricing" 
                className={`text-sm font-medium transition-colors hover:text-[#9b87f5] ${
                  isActive('/pricing') ? 'text-[#9b87f5]' : 'text-foreground/60'
                }`}
              >
                Pricing
              </Link>
              <Link 
                to="/support" 
                className={`text-sm font-medium transition-colors hover:text-[#9b87f5] ${
                  isActive('/support') ? 'text-[#9b87f5]' : 'text-foreground/60'
                }`}
              >
                Docs
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9b87f5] text-white text-sm font-medium">
                    {user.name?.[0] || user.email[0]}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border shadow-lg z-50" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                {user.subscription?.type === 'company' && (
                  <DropdownMenuItem asChild>
                    <Link to="/enterprise" className="cursor-pointer">
                      Enterprise Portal
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button size="sm" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background border shadow-lg z-50" align="end">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/demo" className="cursor-pointer">
                      Demo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/support" className="cursor-pointer">
                      Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {user.subscription?.type === 'company' && (
                    <DropdownMenuItem asChild>
                      <Link to="/enterprise" className="cursor-pointer">
                        Enterprise Portal
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/demo" className="cursor-pointer">
                      Demo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing" className="cursor-pointer">
                      Pricing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/support" className="cursor-pointer">
                      Docs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="cursor-pointer">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/onboarding" className="cursor-pointer">
                      Get Started
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
