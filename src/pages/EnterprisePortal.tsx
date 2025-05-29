
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ApiKeyManager from '@/components/enterprise/ApiKeyManager';
import ApiDocumentation from '@/components/enterprise/ApiDocumentation';
import WhiteLabelManager from '@/components/enterprise/WhiteLabelManager';

const EnterprisePortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('api-keys');

  const isEnterprise = user?.subscription?.tier === 'enterprise';
  
  if (!isEnterprise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The Enterprise Portal is only available for Enterprise tier subscribers. Please upgrade your subscription to access these features.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Enterprise Portal</h1>
        <p className="text-muted-foreground mb-8">
          Access enterprise features and integration tools for TypeMagic Guard.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Features</CardTitle>
                  <CardDescription>
                    Tools and capabilities for enterprise customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="flex flex-col space-y-1">
                    <button
                      className={`px-3 py-2 rounded-md text-left text-sm ${
                        activeTab === 'api-keys'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveTab('api-keys')}
                    >
                      API Keys
                    </button>
                    <button
                      className={`px-3 py-2 rounded-md text-left text-sm ${
                        activeTab === 'api-docs'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveTab('api-docs')}
                    >
                      API Documentation
                    </button>
                    <button
                      className={`px-3 py-2 rounded-md text-left text-sm ${
                        activeTab === 'white-label'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveTab('white-label')}
                    >
                      White-Label Settings
                    </button>
                    <button
                      className={`px-3 py-2 rounded-md text-left text-sm ${
                        activeTab === 'support'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveTab('support')}
                    >
                      Enterprise Support
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'api-keys' && <ApiKeyManager />}
            {activeTab === 'api-docs' && <ApiDocumentation />}
            {activeTab === 'white-label' && <WhiteLabelManager />}
            {activeTab === 'support' && (
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Support</CardTitle>
                  <CardDescription>
                    Access premium support services for enterprise customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-10">
                    Enterprise support portal coming soon
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterprisePortal;
