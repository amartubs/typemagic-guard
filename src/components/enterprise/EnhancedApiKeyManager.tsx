
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Key, Copy, Trash2, Plus, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  rate_limit: number;
  is_active: boolean;
  created_at: string;
  last_used?: string;
  expires_at?: string;
  key_hash: string;
  user_id: string;
}

interface NewApiKey extends ApiKey {
  full_key?: string; // Only present when newly created
}

const EnhancedApiKeyManager = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['biometric_auth']);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(1000);
  const [newKeyExpiry, setNewKeyExpiry] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const permissions = [
    { id: 'biometric_auth', label: 'Biometric Authentication', description: 'Access to authentication endpoints' },
    { id: 'user_management', label: 'User Management', description: 'Create and manage users' },
    { id: 'analytics', label: 'Analytics & Reporting', description: 'Access to analytics data' },
    { id: 'security_settings', label: 'Security Settings', description: 'Modify security configurations' },
    { id: 'admin', label: 'Admin Access', description: 'Full administrative access' },
  ];

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk_';
    for (let i = 0; i < 48; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const hashApiKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const createApiKey = async () => {
    if (!user || !newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const fullKey = generateApiKey();
      const keyPrefix = fullKey.substring(0, 12) + '...';
      const keyHash = await hashApiKey(fullKey);
      
      const newKeyData = {
        user_id: user.id,
        name: newKeyName,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        permissions: newKeyPermissions,
        rate_limit: newKeyRateLimit,
        expires_at: newKeyExpiry ? new Date(newKeyExpiry).toISOString() : null,
        is_active: true
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert(newKeyData)
        .select()
        .single();

      if (error) throw error;

      // Add the full key for display (only shown once)
      const newApiKey: NewApiKey = { ...data, full_key: fullKey };
      setApiKeys(prev => [newApiKey, ...prev]);

      // Copy to clipboard
      navigator.clipboard.writeText(fullKey);
      
      toast({
        title: "API Key Created",
        description: "Your new API key has been created and copied to clipboard. Store it safely!",
      });

      // Reset form
      setNewKeyName('');
      setNewKeyPermissions(['biometric_auth']);
      setNewKeyRateLimit(1000);
      setNewKeyExpiry('');
      setShowCreateDialog(false);

    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleApiKey = async (keyId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !isActive })
        .eq('id', keyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, is_active: !isActive } : key
      ));

      toast({
        title: "Success",
        description: `API key ${!isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error toggling API key:', error);
      toast({
        title: "Error",
        description: "Failed to update API key status",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setApiKeys(prev => prev.filter(key => key.id !== keyId));
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

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
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
          <h2 className="text-2xl font-bold">API Key Management</h2>
          <p className="text-muted-foreground">
            Manage API keys for enterprise integrations
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">API Key Name</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Production API Key"
                />
              </div>
              
              <div>
                <Label>Permissions</Label>
                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
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
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={permission.id} className="text-sm font-medium">
                          {permission.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="rateLimit">Rate Limit (requests per hour)</Label>
                <Select value={newKeyRateLimit.toString()} onValueChange={(value) => setNewKeyRateLimit(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 requests/hour</SelectItem>
                    <SelectItem value="500">500 requests/hour</SelectItem>
                    <SelectItem value="1000">1,000 requests/hour</SelectItem>
                    <SelectItem value="5000">5,000 requests/hour</SelectItem>
                    <SelectItem value="10000">10,000 requests/hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={newKeyExpiry}
                  onChange={(e) => setNewKeyExpiry(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={createApiKey} disabled={creating} className="flex-1">
                  {creating ? 'Creating...' : 'Create API Key'}
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
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className={`${!apiKey.is_active ? 'opacity-60' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span className="font-medium">{apiKey.name}</span>
                    {apiKey.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {isExpired(apiKey.expires_at) && (
                      <Badge variant="destructive">Expired</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permissions.find(p => p.id === permission)?.label || permission}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Rate limit: {apiKey.rate_limit.toLocaleString()} requests/hour</p>
                    <p>Created: {new Date(apiKey.created_at).toLocaleDateString()}</p>
                    {apiKey.expires_at && (
                      <p>Expires: {new Date(apiKey.expires_at).toLocaleDateString()}</p>
                    )}
                    {apiKey.last_used && (
                      <p>Last used: {new Date(apiKey.last_used).toLocaleDateString()}</p>
                    )}
                  </div>

                  {((apiKey as NewApiKey).full_key || showKeys[apiKey.id]) && (
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-muted rounded">
                      <code className="text-sm font-mono flex-1">
                        {(apiKey as NewApiKey).full_key || apiKey.key_prefix}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard((apiKey as NewApiKey).full_key || apiKey.key_prefix)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {(apiKey as NewApiKey).full_key && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        This is the only time you'll see this key. Store it safely!
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowKeys(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleApiKey(apiKey.id, apiKey.is_active)}
                  >
                    {apiKey.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteApiKey(apiKey.id)}
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

      {apiKeys.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-4">
              Create your first API key to start integrating with the TypeMagic Guard API
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedApiKeyManager;
