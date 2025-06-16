
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthTabsProps {
  activeTab: 'login' | 'register' | 'forgot';
  onTabChange: (value: 'login' | 'register' | 'forgot') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="px-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="forgot">Reset</TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AuthTabs;
