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
  Bell,
  Heart,
  DollarSign,
  Scale,
  GraduationCap,
  Monitor
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
          <Tabs defaultValue="industry-specific" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="industry-specific">Industry Specific</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              <TabsTrigger value="developer">Developer Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="industry-specific" className="space-y-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Healthcare Integrations</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Epic MyChart', description: 'Patient portal integration', status: 'Available' },
                      { name: 'Cerner PowerChart', description: 'EMR system integration', status: 'Available' },
                      { name: 'AllScripts', description: 'Practice management', status: 'Beta' },
                      { name: 'athenahealth', description: 'Cloud-based EMR', status: 'Coming Soon' }
                    ].map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Heart className="h-4 w-4 text-blue-500" />
                            {item.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                            <Button size="sm" variant="outline" disabled={item.status !== 'Available'}>
                              Install
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Financial Services</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Plaid', description: 'Banking data API', status: 'Available' },
                      { name: 'Stripe Connect', description: 'Payment processing', status: 'Available' },
                      { name: 'Yodlee', description: 'Financial data aggregation', status: 'Beta' },
                      { name: 'Finicity', description: 'Open banking platform', status: 'Coming Soon' }
                    ].map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            {item.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                            <Button size="sm" variant="outline" disabled={item.status !== 'Available'}>
                              Install
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">Legal Industry</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'DocuSign', description: 'Digital signature platform', status: 'Available' },
                      { name: 'Adobe Sign', description: 'Document e-signatures', status: 'Available' },
                      { name: 'HelloSign', description: 'Simple e-signature', status: 'Available' },
                      { name: 'PandaDoc', description: 'Document automation', status: 'Beta' }
                    ].map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Scale className="h-4 w-4 text-purple-500" />
                            {item.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                            <Button size="sm" variant="outline" disabled={item.status !== 'Available'}>
                              Install
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold">Education Platforms</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Canvas LMS', description: 'Learning management system', status: 'Available' },
                      { name: 'Moodle', description: 'Open-source LMS', status: 'Available' },
                      { name: 'Blackboard', description: 'Educational technology', status: 'Beta' },
                      { name: 'Google Classroom', description: 'Classroom management', status: 'Coming Soon' }
                    ].map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-indigo-500" />
                            {item.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                            <Button size="sm" variant="outline" disabled={item.status !== 'Available'}>
                              Install
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold">VDI & Remote Work</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Citrix Virtual Apps', description: 'Virtual application delivery', status: 'Available' },
                      { name: 'VMware Horizon', description: 'VDI platform', status: 'Available' },
                      { name: 'Microsoft RDS', description: 'Remote desktop services', status: 'Beta' },
                      { name: 'Amazon WorkSpaces', description: 'Cloud-based desktops', status: 'Coming Soon' }
                    ].map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-orange-500" />
                            {item.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                            <Button size="sm" variant="outline" disabled={item.status !== 'Available'}>
                              Install
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Google Analytics', category: 'Web Analytics', status: 'Beta' },
                  { name: 'Mixpanel', category: 'Product Analytics', status: 'Available' },
                  { name: 'Segment', category: 'Customer Data Platform', status: 'Available' },
                  { name: 'Intercom', category: 'Customer Messaging', status: 'Available' },
                  { name: 'Zendesk', category: 'Customer Support', status: 'Beta' },
                  { name: 'HubSpot', category: 'CRM & Marketing', status: 'Coming Soon' }
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
                          Install
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enterprise" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Microsoft Azure AD', category: 'Enterprise SSO', status: 'Available' },
                  { name: 'Okta', category: 'Identity Management', status: 'Available' },
                  { name: 'Splunk', category: 'Security Analytics', status: 'Available' },
                  { name: 'Datadog', category: 'Monitoring', status: 'Beta' },
                  { name: 'PagerDuty', category: 'Incident Response', status: 'Available' },
                  { name: 'ServiceNow', category: 'IT Service Management', status: 'Coming Soon' }
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
                          Install
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="developer" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'GitHub', category: 'Version Control', status: 'Available' },
                  { name: 'GitLab', category: 'DevOps Platform', status: 'Available' },
                  { name: 'Jira', category: 'Issue Tracking', status: 'Available' },
                  { name: 'Slack', category: 'Team Communication', status: 'Available' },
                  { name: 'Discord', category: 'Community Chat', status: 'Beta' },
                  { name: 'Webhooks', category: 'Custom Integration', status: 'Available' }
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
                          Install
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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