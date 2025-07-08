import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  services: {
    database: string;
    biometric_engine: string;
    rate_limiter: string;
    authentication?: string;
  };
  uptime?: number;
  memory?: {
    used: number;
    total: number;
  };
  performance?: {
    responseTime: number;
    rateLimitStore: number;
    activeConnections: number;
  };
  compliance?: {
    gdpr: string;
    security: string;
    encryption: string;
  };
}

const HealthCheck = () => {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('biometric-api', {
        body: { action: 'health' }
      });

      if (error) throw error;

      setHealthData(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthData({
        status: 'error',
        timestamp: new Date().toISOString(),
        version: 'unknown',
        services: {
          database: 'error',
          biometric_engine: 'error',
          rate_limiter: 'error'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'operational':
      case 'active':
      case 'available':
      case 'compliant':
      case 'enhanced':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'healthy' || status === 'connected' || status === 'operational' || status === 'active'
      ? 'default'
      : status === 'degraded' || status === 'warning'
      ? 'secondary'
      : 'destructive';

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Health</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of TypeMagic Guard services
          </p>
        </div>
        <Button 
          onClick={checkHealth} 
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {healthData && (
        <div className="grid gap-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall System Status</span>
                {getStatusBadge(healthData.status)}
              </CardTitle>
              <CardDescription>
                Last checked: {lastChecked?.toLocaleString() || 'Never'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-2xl font-bold">{healthData.version}</p>
                </div>
                {healthData.uptime !== undefined && (
                  <div>
                    <p className="text-sm font-medium">Uptime</p>
                    <p className="text-2xl font-bold">{Math.floor(healthData.uptime / 60)}m</p>
                  </div>
                )}
                {healthData.memory && (
                  <div>
                    <p className="text-sm font-medium">Memory Usage</p>
                    <p className="text-2xl font-bold">
                      {healthData.memory.used}MB / {healthData.memory.total}MB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services Status */}
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Status of individual system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(healthData.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {service.replace('_', ' ')}
                    </span>
                    {getStatusBadge(status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          {healthData.performance && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Current system performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold">{healthData.performance.responseTime.toFixed(2)}ms</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rate Limit Store</p>
                    <p className="text-2xl font-bold">{healthData.performance.rateLimitStore}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Connections</p>
                    <p className="text-2xl font-bold">{healthData.performance.activeConnections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Status */}
          {healthData.compliance && (
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Security</CardTitle>
                <CardDescription>
                  Security and compliance status indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(healthData.compliance).map(([area, status]) => (
                    <div key={area} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {area.replace('_', ' ')}
                      </span>
                      {getStatusBadge(status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthCheck;