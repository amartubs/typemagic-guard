
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Shield } from 'lucide-react';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileNavigation from './navigation/MobileNavigation';
import UserMenu from './navigation/UserMenu';

const MainNavigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is superadmin
  const isSuperAdmin = user?.email === 'craigfubara@yahoo.co.uk';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;
  const isEnterprise = user?.subscription?.tier === 'enterprise' || isSuperAdmin;
  const isProfessionalOrHigher = ['professional', 'enterprise'].includes(user?.subscription?.tier || '') || isSuperAdmin;

  const handleLogout = async () => {
    await logout();
    navigate('/');
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

          <DesktopNavigation
            isProfessionalOrHigher={isProfessionalOrHigher}
            isEnterprise={isEnterprise}
            isAdmin={isAdmin}
            isSuperAdmin={isSuperAdmin}
          />
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          <MobileNavigation
            isProfessionalOrHigher={isProfessionalOrHigher}
            isEnterprise={isEnterprise}
            isAdmin={isAdmin}
            isSuperAdmin={isSuperAdmin}
          />

          <UserMenu
            user={user}
            isSuperAdmin={isSuperAdmin}
            isAdmin={isAdmin}
            isEnterprise={isEnterprise}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
