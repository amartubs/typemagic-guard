
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { KeyTiming } from '@/lib/types';

interface PatternAnalysisViewProps {
  keystrokes: KeyTiming[];
  confidenceScore: number;
}

const PatternAnalysisView: React.FC<PatternAnalysisViewProps> = ({
  keystrokes,
  confidenceScore
}) => {
  const avgDwellTime = keystrokes.length > 0 ? 
    Math.round(keystrokes.reduce((sum, k) => sum + k.duration, 0) / keystrokes.length) : 92;
  
  const avgFlightTime = keystrokes.length > 1 ? 
    Math.round(Math.abs(keystrokes.slice(-1)[0].pressTime - keystrokes.slice(-2)[0].releaseTime)) : 145;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dwell Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {avgDwellTime}ms
            </div>
            <p className="text-xs text-muted-foreground">Average key hold duration</p>
            <div className="mt-2 h-1 bg-muted rounded">
              <div 
                className="h-1 bg-green-500 rounded transition-all duration-500"
                style={{ width: keystrokes.length > 0 ? '75%' : '60%' }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Flight Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {avgFlightTime}ms
            </div>
            <p className="text-xs text-muted-foreground">Between keystrokes</p>
            <div className="mt-2 h-1 bg-muted rounded">
              <div 
                className="h-1 bg-blue-500 rounded transition-all duration-500"
                style={{ width: keystrokes.length > 1 ? '65%' : '45%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle size={16} />
        <span className="text-sm">Pattern recognition confidence: {confidenceScore}%</span>
      </div>
    </div>
  );
};

export default PatternAnalysisView;
