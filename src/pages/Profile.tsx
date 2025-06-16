
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import ProfileManagement from '@/components/profile/ProfileManagement';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';
import GDPRManagement from '@/components/gdpr/GDPRManagement';
import TwoFactorSetup from '@/components/security/TwoFactorSetup';
import ApiKeyManager from '@/components/enterprise/ApiKeyManager';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { 
  User, 
  CreditCard, 
  Shield, 
  Key, 
  Database,
  Settings 
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Please log in to access your profile.</p>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, subscription, and security settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileManagement />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionManager />
          </TabsContent>

          <TabsContent value="security">
            <TwoFactorSetup />
          </TabsContent>

          <TabsContent value="api">
            <ApiKeyManager />
          </TabsContent>

          <TabsContent value="privacy">
            <GDPRManagement />
          </TabsContent>

          <TabsContent value="advanced">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Advanced Settings</h3>
              <p className="text-muted-foreground">
                Advanced configuration options will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
};

export default Profile;
