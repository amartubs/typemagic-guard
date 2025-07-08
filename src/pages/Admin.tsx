
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from '@/components/admin/AdminDashboard';
import BiometricMonitor from '@/components/admin/BiometricMonitor';
import { BiometricSecurityDashboard } from '@/components/monitoring/BiometricSecurityDashboard';

const Admin = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TypeMagic Guard - Admin Panel</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">System Dashboard</TabsTrigger>
              <TabsTrigger value="biometric">Biometric Monitor</TabsTrigger>
              <TabsTrigger value="security">Security Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="biometric">
              <BiometricMonitor />
            </TabsContent>
            
            <TabsContent value="security">
              <BiometricSecurityDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
