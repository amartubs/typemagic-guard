
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfileAnalysis } from './useBiometricMonitorData';

interface ConfidenceDistributionChartProps {
  userAnalyses: UserProfileAnalysis[];
}

export const ConfidenceDistributionChart: React.FC<ConfidenceDistributionChartProps> = ({ userAnalyses }) => {
  const confidenceDistribution = userAnalyses.map((analysis, index) => ({
    x: index,
    y: analysis.profile.confidenceScore,
    status: analysis.profile.status,
    email: analysis.userEmail
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Score Distribution</CardTitle>
        <CardDescription>
          Each point represents a user's biometric profile confidence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={confidenceDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" hide />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value, name, props) => [
                `${value}%`,
                'Confidence',
                props.payload?.email
              ]}
            />
            <Scatter dataKey="y" fill="hsl(var(--primary))" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
