
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Target
} from 'lucide-react';

interface MetricsCardsProps {
  metrics: {
    successRate: number;
    avgConfidence: number;
    activeUsers: number;
    securityEvents: number;
    avgResponseTime: number;
    threatLevel: 'low' | 'medium' | 'high';
    systemUptime: number;
    authenticationsToday: number;
  };
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{metrics.successRate}%</p>
              <p className="text-xs text-green-600">+2.1% from last week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
              <p className="text-2xl font-bold">{metrics.avgConfidence}%</p>
              <p className="text-xs text-blue-600">+5.3% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-purple-600">+12% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <AlertTriangle className={`h-8 w-8 ${getThreatColor(metrics.threatLevel)}`} />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Security Events</p>
              <p className="text-2xl font-bold">{metrics.securityEvents}</p>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{metrics.avgResponseTime}ms</p>
              <p className="text-xs text-green-600">-15ms from yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Shield className={`h-8 w-8 ${getThreatColor(metrics.threatLevel)}`} />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
              <p className="text-2xl font-bold capitalize">{metrics.threatLevel}</p>
              <p className="text-xs text-muted-foreground">Current status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-cyan-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
              <p className="text-2xl font-bold">{metrics.systemUptime}%</p>
              <p className="text-xs text-cyan-600">99.9% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Auths Today</p>
              <p className="text-2xl font-bold">{metrics.authenticationsToday.toLocaleString()}</p>
              <p className="text-xs text-indigo-600">+8% vs yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
