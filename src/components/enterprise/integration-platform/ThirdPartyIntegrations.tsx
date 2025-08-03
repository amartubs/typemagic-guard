import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plug, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Shield,
  Users,
  Database,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  category: 'auth' | 'analytics' | 'notification' | 'crm' | 'security';
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  settings?: Record<string, any>;
  webhookUrl?: string;
  requiresApiKey: boolean;
}

export const ThirdPartyIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'auth0',
      name: 'Auth0',
      category: 'auth',
      description: 'Integrate with Auth0 for enhanced identity management',
      icon: <Shield className="h-6 w-6" />,
      status: 'disconnected',
      requiresApiKey: true
    },
    {
      id: 'okta',
      name: 'Okta',
      category: 'auth',
      description: 'Enterprise SSO and identity management with Okta',
      icon: <Users className="h-6 w-6" />,
      status: 'disconnected',
      requiresApiKey: true
    },
    {
      id: 'mixpanel',
      name: 'Mixpanel',
      category: 'analytics',
      description: 'Send behavioral analytics data to Mixpanel',
      icon: <Database className="h-6 w-6" />,
      status: 'connected',
      requiresApiKey: true,
      settings: { projectToken: 'hidden' }
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'notification',
      description: 'Get security alerts and notifications in Slack',
      icon: <Bell className="h-6 w-6" />,
      status: 'disconnected',
      requiresApiKey: true
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      description: 'Sync user authentication data with Salesforce CRM',
      icon: <Users className="h-6 w-6" />,
      status: 'error',
      requiresApiKey: true
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getCategoryIcon = (category: Integration['category']) => {
    switch (category) {
      case 'auth':
        return <Shield className="h-4 w-4" />;
      case 'analytics':
        return <Database className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      case 'crm':
        return <Users className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      default:
        return <Plug className="h-4 w-4" />;
    }
  };

  const openConfigDialog = (integration: Integration) => {
    setSelectedIntegration(integration);
    setApiKey('');
    setWebhookUrl(integration.webhookUrl || '');
    setConfigDialogOpen(true);
  };

  const saveIntegrationConfig = () => {
    if (!selectedIntegration) return;

    setIntegrations(prev => prev.map(integration => 
      integration.id === selectedIntegration.id
        ? {
            ...integration,
            status: 'connected' as const,
            settings: { ...integration.settings, apiKey: 'hidden' },
            webhookUrl
          }
        : integration
    ));

    toast.success(`${selectedIntegration.name} integration configured successfully`);
    setConfigDialogOpen(false);
  };

  const toggleIntegration = (integrationId: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId
        ? { 
            ...integration, 
            status: enabled ? 'connected' : 'disconnected' as const 
          }
        : integration
    ));

    const integration = integrations.find(i => i.id === integrationId);
    toast.success(`${integration?.name} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const testIntegration = async (integration: Integration) => {
    toast.loading(`Testing ${integration.name} connection...`);
    
    // Simulate testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      toast.success(`${integration.name} connection test passed`);
      setIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, status: 'connected' } : i
      ));
    } else {
      toast.error(`${integration.name} connection test failed`);
      setIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, status: 'error' } : i
      ));
    }
  };

  const categorizedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const categoryNames = {
    auth: 'Authentication & Identity',
    analytics: 'Analytics & Tracking',
    notification: 'Notifications & Alerts',
    crm: 'CRM & Customer Data',
    security: 'Security & Compliance'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Plug className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Third-Party Integrations</h2>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Integrations allow TypeMagic to work seamlessly with your existing security and analytics tools. 
          Configure webhooks and API keys to start sending data to external platforms.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="custom">Custom Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {Object.entries(categorizedIntegrations).map(([category, categoryIntegrations]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category as Integration['category'])}
                <h3 className="text-lg font-semibold">
                  {categoryNames[category as keyof typeof categoryNames]}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map(integration => (
                  <Card key={integration.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {integration.icon}
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <Badge variant={getStatusColor(integration.status) as any}>
                            {integration.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="text-sm">
                        {integration.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between">
                        <Switch
                          checked={integration.status === 'connected'}
                          onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfigDialog(integration)}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Config
                          </Button>
                          {integration.status === 'connected' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testIntegration(integration)}
                            >
                              Test
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Marketplace</CardTitle>
              <CardDescription>Discover new integrations to enhance your TypeMagic setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Microsoft Azure AD', category: 'Enterprise SSO', status: 'Coming Soon' },
                  { name: 'Google Analytics', category: 'Web Analytics', status: 'Beta' },
                  { name: 'Splunk', category: 'Security Analytics', status: 'Available' },
                  { name: 'Jira', category: 'Issue Tracking', status: 'Available' },
                  { name: 'Datadog', category: 'Monitoring', status: 'Beta' },
                  { name: 'PagerDuty', category: 'Incident Response', status: 'Coming Soon' }
                ].map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{item.name}</CardTitle>
                      <CardDescription className="text-xs">{item.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                        <Button size="sm" variant="outline" disabled={item.status !== 'Available'}>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Webhook Integration</CardTitle>
              <CardDescription>Configure custom webhooks for your specific integration needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-webhook">Webhook URL</Label>
                <Input
                  id="custom-webhook"
                  placeholder="https://your-app.com/webhooks/typemagic"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Webhook Events</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• authentication.success</div>
                  <div>• authentication.failed</div>
                  <div>• biometric.enrollment</div>
                  <div>• biometric.verification</div>
                  <div>• security.anomaly_detected</div>
                  <div>• user.login</div>
                  <div>• user.logout</div>
                  <div>• system.alert</div>
                </div>
              </div>

              <Button className="w-full">
                <Plug className="h-4 w-4 mr-2" />
                Add Custom Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Set up your {selectedIntegration?.name} integration with API credentials and webhook settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedIntegration?.requiresApiKey && (
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="webhook">Webhook URL (Optional)</Label>
              <Input
                id="webhook"
                placeholder="https://your-webhook-endpoint.com"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={saveIntegrationConfig} className="flex-1">
                Save Configuration
              </Button>
              <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};