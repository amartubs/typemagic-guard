
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Shield, User, Clock, Globe } from 'lucide-react';

const WebhookEventTypes = () => {
  const eventTypes = [
    {
      name: 'authentication.success',
      description: 'Fired when a user successfully authenticates with biometric data',
      icon: CheckCircle,
      color: 'text-green-600',
      frequency: 'High',
      payload: {
        userId: 'string',
        confidenceScore: 'number',
        timestamp: 'string',
        ipAddress: 'string',
        userAgent: 'string',
        sessionId: 'string'
      }
    },
    {
      name: 'authentication.failed',
      description: 'Fired when an authentication attempt fails',
      icon: AlertTriangle,
      color: 'text-red-600',
      frequency: 'Medium',
      payload: {
        userId: 'string',
        reason: 'string',
        confidenceScore: 'number',
        timestamp: 'string',
        ipAddress: 'string',
        attemptCount: 'number'
      }
    },
    {
      name: 'security.alert',
      description: 'Fired when suspicious activity or security threats are detected',
      icon: Shield,
      color: 'text-orange-600',
      frequency: 'Low',
      payload: {
        userId: 'string',
        alertType: 'string',
        severity: 'string',
        description: 'string',
        timestamp: 'string',
        metadata: 'object'
      }
    },
    {
      name: 'user.pattern_updated',
      description: 'Fired when a user\'s biometric pattern is updated or retrained',
      icon: User,
      color: 'text-blue-600',
      frequency: 'Low',
      payload: {
        userId: 'string',
        previousConfidence: 'number',
        newConfidence: 'number',
        updateReason: 'string',
        timestamp: 'string'
      }
    },
    {
      name: 'session.expired',
      description: 'Fired when a user session expires or is terminated',
      icon: Clock,
      color: 'text-gray-600',
      frequency: 'Medium',
      payload: {
        userId: 'string',
        sessionId: 'string',
        expirationReason: 'string',
        duration: 'number',
        timestamp: 'string'
      }
    },
    {
      name: 'api.rate_limit_exceeded',
      description: 'Fired when API rate limits are exceeded',
      icon: Globe,
      color: 'text-purple-600',
      frequency: 'Low',
      payload: {
        apiKey: 'string',
        endpoint: 'string',
        currentRate: 'number',
        limit: 'number',
        resetTime: 'string',
        timestamp: 'string'
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Webhook Event Types</h3>
        <p className="text-sm text-muted-foreground">
          Configure which events you want to receive notifications for
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventTypes.map((event) => {
          const Icon = event.icon;
          return (
            <Card key={event.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${event.color}`} />
                    {event.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {event.frequency}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Payload Structure:</h4>
                    <div className="bg-muted/50 p-3 rounded text-xs">
                      <pre>
{JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Example Webhook Payload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`{
  "id": "evt_1234567890",
  "type": "authentication.success",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "userId": "user_abc123",
    "confidenceScore": 87.5,
    "timestamp": "2024-01-15T10:30:00Z",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "sessionId": "sess_xyz789",
    "metadata": {
      "loginMethod": "password",
      "deviceFingerprint": "fp_device123",
      "location": "New York, NY"
    }
  },
  "signature": "sha256=a1b2c3d4e5f6..."
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookEventTypes;
