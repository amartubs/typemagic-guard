
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfileAnalysis } from './useBiometricMonitorData';

interface RiskAssessmentListProps {
  userAnalyses: UserProfileAnalysis[];
  onUserSelect: (userId: string) => void;
}

export const RiskAssessmentList: React.FC<RiskAssessmentListProps> = ({ 
  userAnalyses, 
  onUserSelect 
}) => {
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
        <CardTitle>Risk Assessment Overview</CardTitle>
        <CardDescription>Users sorted by risk score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {userAnalyses
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 10)
            .map((analysis) => (
              <div 
                key={analysis.userId} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onUserSelect(analysis.userId)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(analysis.profile.status)}`} />
                  <div>
                    <p className="font-medium">{analysis.userEmail}</p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.profile.keystrokePatterns.length} patterns, 
                      {analysis.profile.confidenceScore}% confidence
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getRiskColor(analysis.riskScore)}`}>
                    {analysis.riskScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Risk</p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
