
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, BarChart3, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: 'Home', path: '/', icon: Shield },
    { name: 'Demo', path: '/demo', icon: Lock },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  ];

  return (
    <header className="relative bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <img 
              src="/lovable-uploads/50734fd5-d45d-4283-b5cc-ace6b57ada22.png" 
              alt="Shoal Logo" 
              className="h-10"
            />
            <span className="font-bold text-xl text-foreground">Shoal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="hidden md:flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
            
            <Button variant="outline" size="sm" className="hidden md:flex">
              Get Started
            </Button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm pt-16">
          <nav className="flex flex-col p-4 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  isActivePath(item.path) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="border-t border-border my-2 pt-2">
              <Link
                to="/login"
                className="flex items-center space-x-2 p-2 rounded-md text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
              <div className="p-2">
                <Button className="w-full" size="sm">Get Started</Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
