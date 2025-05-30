
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface UptimeData {
  date: string;
  uptime: number;
  incidents: number;
}

interface Service {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  lastIncident?: string;
}

interface UptimeTrackerProps {
  services: Service[];
  uptimeHistory: UptimeData[];
  overallUptime: number;
}

const UptimeTracker: React.FC<UptimeTrackerProps> = ({
  services,
  uptimeHistory,
  overallUptime
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'outage':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'operational':
        return 'default';
      case 'degraded':
        return 'secondary';
      case 'outage':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Service Outage';
      default:
        return 'Unknown';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'bg-green-500';
    if (uptime >= 99.0) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            System Status
          </CardTitle>
          <CardDescription>
            Current status of all services and components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-2xl font-bold">{overallUptime.toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground">Overall Uptime (30 days)</p>
            </div>
            <Badge variant="default" className="px-4 py-2">
              All Systems Operational
            </Badge>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium">{service.name}</p>
                    {service.lastIncident && (
                      <p className="text-sm text-muted-foreground">
                        Last incident: {new Date(service.lastIncident).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{service.uptime.toFixed(2)}%</p>
                    <p className="text-sm text-muted-foreground">30-day uptime</p>
                  </div>
                  <Badge variant={getStatusVariant(service.status)}>
                    {getStatusText(service.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uptime History */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime History</CardTitle>
          <CardDescription>
            Daily uptime percentage for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
            
            <div className="flex gap-1">
              {uptimeHistory.map((day, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div
                    className={`w-3 h-8 rounded-sm ${getUptimeColor(day.uptime)} opacity-80 hover:opacity-100 transition-opacity`}
                    title={`${day.date}: ${day.uptime.toFixed(2)}% uptime, ${day.incidents} incidents`}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {day.date}: {day.uptime.toFixed(2)}%
                    {day.incidents > 0 && <br />}{day.incidents} incidents
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span>99.9%+ uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                <span>99.0-99.9% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span>&lt;99.0% uptime</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UptimeTracker;
