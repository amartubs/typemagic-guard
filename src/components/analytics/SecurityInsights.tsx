
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  Users,
  Activity
} from 'lucide-react';

interface SecurityInsight {
  id: string;
  type: 'threat' | 'improvement' | 'anomaly' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  affectedUsers?: number;
  action?: string;
}

interface SecurityInsightsProps {
  insights: SecurityInsight[];
  threatTrends: {
    current: number;
    previous: number;
    change: number;
  };
  anomalyDetection: {
    totalAnomalies: number;
    resolvedAnomalies: number;
    activeThreats: number;
    riskScore: number;
  };
}

const SecurityInsights: React.FC<SecurityInsightsProps> = ({ insights, threatTrends, anomalyDetection }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Shield className="h-4 w-4 text-yellow-500" />;
      default: return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="h-4 w-4" />;
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      case 'anomaly': return <Activity className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className={`text-2xl font-bold ${getRiskScoreColor(anomalyDetection.riskScore)}`}>
                  {anomalyDetection.riskScore}
                </p>
                <p className="text-xs text-muted-foreground">Current level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold">{anomalyDetection.activeThreats}</p>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Anomalies</p>
                <p className="text-2xl font-bold">{anomalyDetection.totalAnomalies}</p>
                <p className="text-xs text-green-600">{anomalyDetection.resolvedAnomalies} resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              {threatTrends.change > 0 ? (
                <TrendingUp className="h-8 w-8 text-red-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-green-500" />
              )}
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Threat Trend</p>
                <p className="text-2xl font-bold">{Math.abs(threatTrends.change)}%</p>
                <p className={`text-xs ${threatTrends.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {threatTrends.change > 0 ? 'Increase' : 'Decrease'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Insights List */}
      <Card>
        <CardHeader>
          <CardTitle>Security Insights & Recommendations</CardTitle>
          <CardDescription>
            Real-time security analysis and actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <Alert key={insight.id} className="relative">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(insight.severity)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={getSeverityVariant(insight.severity) as any}>
                        {insight.severity}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        {getTypeIcon(insight.type)}
                        {insight.type}
                      </Badge>
                    </div>
                    <AlertDescription>{insight.description}</AlertDescription>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(insight.timestamp).toLocaleString()}
                      </div>
                      {insight.affectedUsers && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {insight.affectedUsers} users affected
                        </div>
                      )}
                      {insight.action && (
                        <div className="text-blue-600 font-medium">
                          Action: {insight.action}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityInsights;
