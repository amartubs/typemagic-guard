
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  User,
  Settings,
  HelpCircle,
  LogOut,
  BookOpen
} from 'lucide-react';

interface UserMenuProps {
  user: any;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEnterprise: boolean;
  onLogout: () => Promise<void>;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  isSuperAdmin,
  isAdmin,
  isEnterprise,
  onLogout
}) => {
  const userMenuItems = [
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/onboarding', label: 'Getting Started', icon: BookOpen },
    { path: '/support', label: 'Support', icon: HelpCircle },
  ];

  return (
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
          onClick={onLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
