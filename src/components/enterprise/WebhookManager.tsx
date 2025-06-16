
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Webhook, Plus, TestTube, Trash2, Settings, AlertCircle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type WebhookConfig = Tables<'webhook_configs'>;

const WebhookManager = () => {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    timeout: 30,
    retry_count: 3
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  const availableEvents = [
    { id: 'user.authenticated', label: 'User Authenticated', description: 'Triggered when a user successfully authenticates' },
    { id: 'user.failed_auth', label: 'Authentication Failed', description: 'Triggered when authentication fails' },
    { id: 'user.registered', label: 'User Registered', description: 'Triggered when a new user registers' },
    { id: 'security.anomaly_detected', label: 'Security Anomaly', description: 'Triggered when unusual activity is detected' },
    { id: 'biometric.profile_updated', label: 'Biometric Profile Updated', description: 'Triggered when biometric profile changes' },
    { id: 'subscription.changed', label: 'Subscription Changed', description: 'Triggered when subscription status changes' }
  ];

  useEffect(() => {
    if (user) {
      fetchWebhooks();
    }
  }, [user]);

  const fetchWebhooks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      toast({
        title: "Error",
        description: "Failed to load webhook configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'whsec_';
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const createWebhook = async () => {
    if (!user || !newWebhook.name.trim() || !newWebhook.url.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const secret = generateSecret();
      const webhookData = {
        user_id: user.id,
        name: newWebhook.name,
        url: newWebhook.url,
        events: newWebhook.events,
        secret,
        timeout: newWebhook.timeout,
        retry_count: newWebhook.retry_count,
        is_active: true,
        success_count: 0,
        failure_count: 0
      };

      const { data, error } = await supabase
        .from('webhook_configs')
        .insert(webhookData)
        .select()
        .single();

      if (error) throw error;

      setWebhooks(prev => [data, ...prev]);
      setNewWebhook({ name: '', url: '', events: [], timeout: 30, retry_count: 3 });
      setShowCreateDialog(false);

      toast({
        title: "Webhook Created",
        description: "Your webhook has been created successfully",
      });
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive",
      });
    }
  };

  const toggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .update({ is_active: !isActive })
        .eq('id', webhookId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setWebhooks(prev => prev.map(webhook => 
        webhook.id === webhookId ? { ...webhook, is_active: !isActive } : webhook
      ));

      toast({
        title: "Success",
        description: `Webhook ${!isActive ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling webhook:', error);
      toast({
        title: "Error",
        description: "Failed to update webhook status",
        variant: "destructive",
      });
    }
  };

  const testWebhook = async (webhookId: string) => {
    setTesting(webhookId);
    try {
      const { data, error } = await supabase.functions.invoke('test-webhook', {
        body: { webhookId }
      });

      if (error) throw error;

      toast({
        title: "Test Sent",
        description: "Test webhook has been sent successfully",
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Error",
        description: "Failed to send test webhook",
        variant: "destructive",
      });
    } finally {
      setTesting(null);
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .delete()
        .eq('id', webhookId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
      toast({
        title: "Webhook Deleted",
        description: "The webhook has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      });
    }
  };

  const handleEventSelection = (eventId: string, checked: boolean) => {
    setNewWebhook(prev => ({
      ...prev,
      events: checked 
        ? [...prev.events, eventId]
        : prev.events.filter(e => e !== eventId)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Webhook Configuration</h2>
          <p className="text-muted-foreground">
            Configure webhooks to receive real-time notifications
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input
                  id="webhook-name"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Production Webhook"
                />
              </div>
              
              <div>
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://api.yourapp.com/webhooks/typemagic"
                />
              </div>

              <div>
                <Label>Events to Subscribe</Label>
                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                  {availableEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id={event.id}
                        checked={newWebhook.events.includes(event.id)}
                        onChange={(e) => handleEventSelection(event.id, e.target.checked)}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={event.id} className="text-sm font-medium">
                          {event.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={newWebhook.timeout}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                    min="5"
                    max="60"
                  />
                </div>
                <div>
                  <Label htmlFor="retry-count">Retry Count</Label>
                  <Input
                    id="retry-count"
                    type="number"
                    value={newWebhook.retry_count}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, retry_count: parseInt(e.target.value) }))}
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={createWebhook} className="flex-1">
                  Create Webhook
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className={`${!webhook.is_active ? 'opacity-60' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <Webhook className="h-4 w-4" />
                    <span className="font-medium">{webhook.name}</span>
                    {webhook.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>URL: {webhook.url}</p>
                    <p>Events: {webhook.events.length} subscribed</p>
                    <p>Success: {webhook.success_count} | Failures: {webhook.failure_count}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((eventId) => (
                      <Badge key={eventId} variant="outline" className="text-xs">
                        {availableEvents.find(e => e.id === eventId)?.label || eventId}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testWebhook(webhook.id)}
                    disabled={testing === webhook.id}
                  >
                    <TestTube className="h-3 w-3 mr-1" />
                    {testing === webhook.id ? 'Testing...' : 'Test'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWebhook(webhook.id, webhook.is_active)}
                  >
                    {webhook.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteWebhook(webhook.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {webhooks.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Webhooks Configured</h3>
            <p className="text-muted-foreground mb-4">
              Create your first webhook to receive real-time notifications
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Webhook Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            All webhook requests include a signature header for verification:
          </p>
          <div className="bg-muted p-3 rounded font-mono text-sm">
            X-TypeMagic-Signature: sha256=&lt;signature&gt;
          </div>
          <p className="text-sm text-muted-foreground">
            Use the webhook secret to verify the signature and ensure the request is authentic.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookManager;
