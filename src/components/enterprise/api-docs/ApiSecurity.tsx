import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react';

export const ApiSecurity: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">API Security</h2>
      </div>

      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="authorization">Authorization</TabsTrigger>
          <TabsTrigger value="rate-limiting">Rate Limiting</TabsTrigger>
          <TabsTrigger value="security-headers">Security Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              All API requests must include a valid API key in the Authorization header.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>API Key Authentication</CardTitle>
              <CardDescription>Secure your API requests with proper authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Request Headers</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div>Authorization: Bearer YOUR_API_KEY</div>
                  <div>Content-Type: application/json</div>
                  <div>X-API-Version: v1</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Example cURL Request</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  {`curl -X POST https://api.typemagic.dev/v1/biometric/verify \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_123",
    "keystroke_data": {...},
    "context": "login"
  }'`}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authorization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Permissions</CardTitle>
              <CardDescription>Control access to different API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Read Permissions</h4>
                  <div className="space-y-1">
                    <Badge variant="secondary">biometric:read</Badge>
                    <Badge variant="secondary">analytics:read</Badge>
                    <Badge variant="secondary">users:read</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Write Permissions</h4>
                  <div className="space-y-1">
                    <Badge variant="outline">biometric:write</Badge>
                    <Badge variant="outline">users:write</Badge>
                    <Badge variant="outline">webhooks:write</Badge>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  API keys can be configured with specific permissions to limit access to sensitive operations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rate-limiting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>API request limits by plan and endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Free Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">100</div>
                      <div className="text-xs text-muted-foreground">requests/hour</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Pro Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,000</div>
                      <div className="text-xs text-muted-foreground">requests/hour</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Enterprise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Custom</div>
                      <div className="text-xs text-muted-foreground">unlimited available</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Rate Limit Headers</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div>X-RateLimit-Limit: 1000</div>
                    <div>X-RateLimit-Remaining: 999</div>
                    <div>X-RateLimit-Reset: 1640995200</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-headers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Headers</CardTitle>
              <CardDescription>Important headers for secure API communication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Required Headers</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div><span className="text-primary">User-Agent:</span> YourApp/1.0</div>
                    <div><span className="text-primary">X-Request-ID:</span> unique-request-id</div>
                    <div><span className="text-primary">X-Forwarded-For:</span> client-ip-address</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Response Headers</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div><span className="text-primary">X-Request-ID:</span> echo-request-id</div>
                    <div><span className="text-primary">X-Response-Time:</span> 150ms</div>
                    <div><span className="text-primary">X-Server-Version:</span> 1.2.3</div>
                  </div>
                </div>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  All API communications are encrypted with TLS 1.3 and use HTTPS only.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};