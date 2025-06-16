
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { UserProfileAnalysis } from './useBiometricMonitorData';

interface UserProfileAnalysisCardProps {
  analysis: UserProfileAnalysis;
}

export const UserProfileAnalysisCard: React.FC<UserProfileAnalysisCardProps> = ({ analysis }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'learning': return 'bg-blue-500';
      case 'locked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600';
    if (risk >= 40) return 'text-orange-600';
    if (risk >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile Analysis</CardTitle>
        <CardDescription>{analysis.userEmail}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge className={getStatusColor(analysis.profile.status)}>
              {analysis.profile.status}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Confidence Score:</span>
            <span className="font-bold">{analysis.profile.confidenceScore}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Risk Score:</span>
            <span className={`font-bold ${getRiskColor(analysis.riskScore)}`}>
              {analysis.riskScore}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Pattern Count:</span>
            <span>{analysis.profile.keystrokePatterns.length}</span>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Fraud Indicators</h4>
            <div className="space-y-1 text-sm">
              {analysis.fraudIndicators.machineGeneratedPattern && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  Machine-generated pattern detected
                </div>
              )}
              {analysis.fraudIndicators.suspiciousTimingPatterns && (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-3 w-3" />
                  Suspicious timing patterns
                </div>
              )}
              {analysis.fraudIndicators.copyPasteDetected && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-3 w-3" />
                  Copy-paste behavior detected
                </div>
              )}
              {!Object.values(analysis.fraudIndicators).some(Boolean) && (
                <div className="text-green-600">No fraud indicators detected</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
