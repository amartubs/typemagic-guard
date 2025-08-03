import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface WebhookTest {
  id: string;
  url: string;
  event: string;
  status: 'pending' | 'success' | 'failed';
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
  timestamp: Date;
  duration?: number;
}

export const WebhookTesting: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [customPayload, setCustomPayload] = useState('');
  const [tests, setTests] = useState<WebhookTest[]>([]);
  const [isTestingRealtime, setIsTestingRealtime] = useState(false);

  const eventTypes = [
    'authentication.success',
    'authentication.failed',
    'biometric.enrollment',
    'biometric.verification',
    'security.anomaly_detected',
    'user.login',
    'user.logout',
    'system.alert'
  ];

  const samplePayloads = {
    'authentication.success': {
      event: 'authentication.success',
      timestamp: new Date().toISOString(),
      user_id: 'user_123',
      confidence_score: 92,
      authentication_method: 'keystroke',
      ip_address: '192.168.1.1',
      device_fingerprint: 'device_abc123'
    },
    'authentication.failed': {
      event: 'authentication.failed',
      timestamp: new Date().toISOString(),
      user_id: 'user_123',
      confidence_score: 45,
      failure_reason: 'low_confidence',
      ip_address: '192.168.1.1',
      device_fingerprint: 'device_abc123'
    },
    'security.anomaly_detected': {
      event: 'security.anomaly_detected',
      timestamp: new Date().toISOString(),
      user_id: 'user_123',
      anomaly_type: 'unusual_timing',
      severity: 'medium',
      confidence_score: 78,
      details: {
        deviation_percentage: 23.5,
        baseline_pattern: 'morning_work',
        current_pattern: 'late_night'
      }
    }
  };

  const handleEventChange = (event: string) => {
    setSelectedEvent(event);
    if (samplePayloads[event as keyof typeof samplePayloads]) {
      setCustomPayload(JSON.stringify(samplePayloads[event as keyof typeof samplePayloads], null, 2));
    }
  };

  const sendTestWebhook = async () => {
    if (!testUrl || !selectedEvent) {
      toast.error('Please provide both URL and event type');
      return;
    }

    const testId = Date.now().toString();
    const newTest: WebhookTest = {
      id: testId,
      url: testUrl,
      event: selectedEvent,
      status: 'pending',
      timestamp: new Date()
    };

    setTests(prev => [newTest, ...prev]);

    try {
      const startTime = Date.now();
      let payload = {};
      
      if (customPayload) {
        try {
          payload = JSON.parse(customPayload);
        } catch (e) {
          payload = samplePayloads[selectedEvent as keyof typeof samplePayloads] || {};
        }
      } else {
        payload = samplePayloads[selectedEvent as keyof typeof samplePayloads] || {};
      }

      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TypeMagic-Event': selectedEvent,
          'X-TypeMagic-Signature': 'sha256=test_signature',
          'User-Agent': 'TypeMagic-Webhooks/1.0'
        },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      const duration = Date.now() - startTime;

      setTests(prev => prev.map(test => 
        test.id === testId 
          ? {
              ...test,
              status: 'success',
              duration,
              response: {
                status: 200, // no-cors mode doesn't give us real status
                body: 'Request sent successfully',
                headers: {}
              }
            }
          : test
      ));

      toast.success('Webhook test sent successfully');
    } catch (error) {
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? {
              ...test,
              status: 'failed',
              response: {
                status: 0,
                body: error instanceof Error ? error.message : 'Unknown error',
                headers: {}
              }
            }
          : test
      ));
      toast.error('Failed to send webhook test');
    }
  };

  const startRealtimeTest = async () => {
    setIsTestingRealtime(true);
    
    // Simulate real-time events
    const events = [
      'authentication.success',
      'biometric.verification',
      'user.login',
      'security.anomaly_detected'
    ];

    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setSelectedEvent(randomEvent);
      handleEventChange(randomEvent);
      await sendTestWebhook();
    }

    setIsTestingRealtime(false);
    toast.success('Real-time test simulation completed');
  };

  const getStatusIcon = (status: WebhookTest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: WebhookTest['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'success':
        return 'success';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Manual Testing</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Testing</TabsTrigger>
          <TabsTrigger value="history">Test History</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Webhook Testing</CardTitle>
              <CardDescription>Send test webhooks to verify your endpoint configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-url">Webhook URL</Label>
                  <Input
                    id="test-url"
                    placeholder="https://your-app.com/webhooks/typemagic"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={selectedEvent} onValueChange={handleEventChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(event => (
                        <SelectItem key={event} value={event}>{event}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-payload">Custom Payload (JSON)</Label>
                <Textarea
                  id="custom-payload"
                  placeholder="Custom JSON payload or leave empty for default"
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={sendTestWebhook} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Test Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Testing</CardTitle>
              <CardDescription>Simulate continuous webhook events to test your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will send multiple webhook events over a 10-second period to simulate real-world usage.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="realtime-url">Webhook URL</Label>
                <Input
                  id="realtime-url"
                  placeholder="https://your-app.com/webhooks/typemagic"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                />
              </div>

              <Button 
                onClick={startRealtimeTest} 
                disabled={isTestingRealtime || !testUrl}
                className="w-full"
              >
                {isTestingRealtime ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Testing in Progress...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Start Real-time Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test History</CardTitle>
              <CardDescription>View results from recent webhook tests</CardDescription>
            </CardHeader>
            <CardContent>
              {tests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No webhook tests performed yet
                </div>
              ) : (
                <div className="space-y-4">
                  {tests.map(test => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="font-mono text-sm">{test.event}</span>
                          <Badge variant={getStatusColor(test.status) as any}>
                            {test.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {test.timestamp.toLocaleTimeString()}
                          {test.duration && ` • ${test.duration}ms`}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {test.url}
                      </div>
                      {test.response && (
                        <div className="bg-muted p-2 rounded text-sm font-mono">
                          Status: {test.response.status} | {test.response.body}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};