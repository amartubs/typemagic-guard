
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  BarChart3
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'active' | 'revoked' | 'expired';
  lastUsed: string | null;
  usageCount: number;
  rateLimit: number;
  expiresAt: string | null;
  createdAt: string;
}

const EnhancedApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_abc123...xyz789',
      permissions: ['read', 'write', 'admin'],
      status: 'active',
      lastUsed: '2024-01-15T10:30:00Z',
      usageCount: 15420,
      rateLimit: 1000,
      expiresAt: null,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Testing Environment',
      key: 'sk_test_def456...uvw012',
      permissions: ['read', 'write'],
      status: 'active',
      lastUsed: '2024-01-14T15:45:00Z',
      usageCount: 892,
      rateLimit: 500,
      expiresAt: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-10T00:00:00Z'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState('1000');
  const [newKeyExpiration, setNewKeyExpiration] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key.",
        variant: "destructive",
      });
      return;
    }

    const newKey: ApiKey = {
      id: (apiKeys.length + 1).toString(),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`,
      permissions: newKeyPermissions,
      status: 'active',
      lastUsed: null,
      usageCount: 0,
      rateLimit: parseInt(newKeyRateLimit),
      expiresAt: newKeyExpiration || null,
      createdAt: new Date().toISOString()
    };

    setApiKeys([...apiKeys, newKey]);
    setShowCreateForm(false);
    setNewKeyName('');
    setNewKeyPermissions([]);
    setNewKeyRateLimit('1000');
    setNewKeyExpiration('');

    toast({
      title: "API Key Created",
      description: "Your new API key has been generated successfully.",
    });
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ));
    
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked and is no longer valid.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'revoked':
        return <Badge variant="destructive">Revoked</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Enhanced API Key Management
              </CardTitle>
              <CardDescription>
                Create and manage API keys with advanced permissions and monitoring
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create API Key Form */}
          {showCreateForm && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">API Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="Enter a descriptive name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2">
                      {['read', 'write', 'admin', 'analytics'].map(permission => (
                        <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newKeyPermissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewKeyPermissions([...newKeyPermissions, permission]);
                              } else {
                                setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm capitalize">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                      <Select value={newKeyRateLimit} onValueChange={setNewKeyRateLimit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="1000">1,000</SelectItem>
                          <SelectItem value="5000">5,000</SelectItem>
                          <SelectItem value="10000">10,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiration">Expiration Date (Optional)</Label>
                      <Input
                        id="expiration"
                        type="date"
                        value={newKeyExpiration}
                        onChange={(e) => setNewKeyExpiration(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateKey} className="gap-2">
                      <Key className="h-4 w-4" />
                      Generate API Key
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys List */}
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className={apiKey.status === 'revoked' ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(apiKey.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(apiKey.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeKey(apiKey.id)}
                          disabled={apiKey.status === 'revoked'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/./g, '•')}
                          readOnly
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>Permissions: {apiKey.permissions.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span>Usage: {apiKey.usageCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>Rate Limit: {apiKey.rateLimit}/hr</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Last Used: {apiKey.lastUsed ? 
                            new Date(apiKey.lastUsed).toLocaleDateString() : 
                            'Never'
                          }
                        </span>
                      </div>
                    </div>

                    {apiKey.expiresAt && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This key expires on {new Date(apiKey.expiresAt).toLocaleDateString()}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage Statistics */}
          <Separator />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                API Usage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {apiKeys.filter(k => k.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Keys</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {apiKeys.reduce((sum, key) => sum + key.usageCount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Requests</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(apiKeys.reduce((sum, key) => sum + key.usageCount, 0) / apiKeys.length).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. per Key</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedApiKeyManager;
