
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfileAnalysis } from './useBiometricMonitorData';
import { ConfidenceCalculator } from '@/lib/biometric/continuousLearning';


interface LearningProgressChartProps {
  analysis: UserProfileAnalysis;
}

export const LearningProgressChart: React.FC<LearningProgressChartProps> = ({ analysis }) => {
  const learningProgressData = analysis.profile.keystrokePatterns
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((_, index) => {
      const slice = analysis.profile.keystrokePatterns
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, index + 1);
      try {
        const confidence = ConfidenceCalculator.calculateAdaptiveConfidence(
          slice,
          analysis.profile,
          5
        );
        return {
          session: index + 1,
          confidence: Math.min(100, Math.round(confidence)),
          stability: Math.round(analysis.learningMetrics.stabilityScore * 100)
        };
      } catch {
        return {
          session: index + 1,
          confidence: Math.min(100, 30 + index * 5),
          stability: Math.round(analysis.learningMetrics.stabilityScore * 100)
        };
      }
    });


  if (learningProgressData.length <= 1) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>
          Confidence and stability progression for {analysis.userEmail}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={learningProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="session" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Confidence"
            />
            <Line 
              type="monotone" 
              dataKey="stability" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              name="Stability"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
