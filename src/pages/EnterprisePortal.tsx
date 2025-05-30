
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useSubscription } from "@/hooks/useSubscription";
import ApiKeyManager from "@/components/enterprise/ApiKeyManager";
import ApiDocumentation from "@/components/enterprise/ApiDocumentation";
import IntegrationTutorials from "@/components/enterprise/IntegrationTutorials";
import WhiteLabelManager from "@/components/enterprise/WhiteLabelManager";
import EnterpriseSettings from "@/components/enterprise/EnterpriseSettings";
import AdvancedAnalytics from "@/components/analytics/AdvancedAnalytics";
import PerformanceMonitor from "@/components/monitoring/PerformanceMonitor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Key,
  FileText,
  Code,
  Palette,
  Settings,
  ChevronRight,
  BarChart3,
  Activity,
  Lock,
  Clipboard
} from "lucide-react";

const EnterprisePortal = () => {
  const { user } = useAuth();
  const { subscription, canAccessFeature } = useSubscription();
  const isEnterprise = subscription?.tier === 'enterprise';
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Please log in to access the Enterprise Portal.</p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!isEnterprise && !canAccessFeature('apiAccess')) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl mb-2">Enterprise Features</CardTitle>
            <CardDescription className="text-center text-lg">
              Upgrade to access enterprise capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-3">Enterprise Features Locked</h3>
              <p className="text-muted-foreground mb-6">
                The Enterprise Portal is available exclusively to Enterprise subscribers. 
                Upgrade your plan to access advanced features like API management, white labeling, 
                and enterprise-grade analytics.
              </p>
              <Button className="gap-2" asChild>
                <a href="/pricing">
                  Upgrade to Enterprise
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Key className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">API Key Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Create and manage API keys for integration with your systems
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">API Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive guides and references for our API
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Palette className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">White Labeling</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize the UI with your own branding
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Enterprise Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced analytics and reporting capabilities
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Enterprise Portal</h1>
        <p className="text-muted-foreground">
          Advanced configuration, API management, and analytics for enterprise users
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="api-docs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="white-label" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">White Label</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <ApiKeyManager />
        </TabsContent>

        <TabsContent value="api-docs">
          <ApiDocumentation />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationTutorials />
        </TabsContent>

        <TabsContent value="white-label">
          <WhiteLabelManager />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-8">
            <AdvancedAnalytics />
            <PerformanceMonitor />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <EnterpriseSettings isEnterprise={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterprisePortal;
