
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Play, Pause } from 'lucide-react';
import { DashboardMetrics } from '@/hooks/useDashboardData';

interface RealTimeMetricsCardProps {
  metrics: DashboardMetrics | undefined;
  isRealTime: boolean;
  onToggleRealTime: () => void;
}

const RealTimeMetricsCard: React.FC<RealTimeMetricsCardProps> = ({
  metrics,
  isRealTime,
  onToggleRealTime
}) => {
  if (!metrics) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Metrics
            {isRealTime && (
              <Badge variant="default" className="ml-2 animate-pulse">
                Live
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleRealTime}
            className="flex items-center gap-2"
          >
            {isRealTime ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Live
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          Monitor your security metrics in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Security Score</div>
            <div className="text-2xl font-bold text-green-600">
              {metrics.securityScore.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Response Time</div>
            <div className="text-2xl font-bold">
              {metrics.avgResponseTime.toFixed(0)}ms
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Confidence</div>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.confidenceScore.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Authentications</div>
            <div className="text-2xl font-bold">
              {metrics.authenticationsToday}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMetricsCard;
