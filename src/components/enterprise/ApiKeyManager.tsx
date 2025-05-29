
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Key, Copy, Trash2, Plus } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  permissions: string[];
  rate_limit: number;
  active: boolean;
  created_at: string;
  last_used?: string;
  api_key?: string; // Only present when newly created
}

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['biometric_auth']);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(1000);
  const [loading, setLoading] = useState(false);

  const permissions = [
    { id: 'biometric_auth', label: 'Biometric Authentication' },
    { id: 'user_management', label: 'User Management' },
    { id: 'analytics', label: 'Analytics & Reporting' },
    { id: 'security_settings', label: 'Security Settings' },
  ];

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-key-management', {
        method: 'GET'
      });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('api-key-management', {
        method: 'POST',
        body: {
          name: newKeyName,
          permissions: newKeyPermissions,
          rateLimit: newKeyRateLimit
        }
      });

      if (error) throw error;

      setApiKeys([...apiKeys, data]);
      setNewKeyName('');
      setNewKeyPermissions(['biometric_auth']);
      setNewKeyRateLimit(1000);
      setShowCreateForm(false);

      toast({
        title: "API Key Created",
        description: "Your new API key has been created successfully",
      });

      // Show the API key in an alert since it won't be shown again
      if (data.api_key) {
        navigator.clipboard.writeText(data.api_key);
        toast({
          title: "API Key Copied",
          description: "The API key has been copied to your clipboard. Store it safely!",
        });
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase.functions.invoke('api-key-management', {
        method: 'DELETE',
        body: null,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) throw error;

      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast({
        title: "API Key Deleted",
        description: "The API key has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Key Management</h2>
          <p className="text-muted-foreground">
            Manage API keys for enterprise integrations
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="My API Key"
              />
            </div>
            
            <div>
              <Label>Permissions</Label>
              <div className="space-y-2 mt-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={newKeyPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewKeyPermissions([...newKeyPermissions, permission.id]);
                        } else {
                          setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission.id));
                        }
                      }}
                    />
                    <Label htmlFor={permission.id}>{permission.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="rateLimit">Rate Limit (requests per hour)</Label>
              <Input
                id="rateLimit"
                type="number"
                value={newKeyRateLimit}
                onChange={(e) => setNewKeyRateLimit(parseInt(e.target.value) || 1000)}
                min="1"
                max="10000"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={createApiKey} disabled={loading}>
                Create API Key
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span className="font-medium">{apiKey.name}</span>
                    {apiKey.active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permissions.find(p => p.id === permission)?.label || permission}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Rate limit: {apiKey.rate_limit} requests/hour
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(apiKey.created_at).toLocaleDateString()}
                    {apiKey.last_used && (
                      <span> • Last used: {new Date(apiKey.last_used).toLocaleDateString()}</span>
                    )}
                  </p>

                  {apiKey.api_key && (
                    <div className="flex items-center space-x-2 mt-2">
                      <code className="bg-muted p-2 rounded text-sm">
                        {apiKey.api_key}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey.api_key!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apiKeys.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-4">
              Create your first API key to start integrating with the TypeMagic Guard API
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiKeyManager;
