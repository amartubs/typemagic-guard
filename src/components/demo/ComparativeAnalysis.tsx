
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeyTiming } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Compare, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TypingSample {
  id: string;
  label: string;
  keystrokes: KeyTiming[];
  confidenceScore: number;
  timestamp: Date;
}

interface ComparativeAnalysisProps {
  currentSample?: TypingSample;
  onAddSample: (sample: TypingSample) => void;
}

const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({
  currentSample,
  onAddSample
}) => {
  const [samples, setSamples] = useState<TypingSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<TypingSample | null>(null);

  useEffect(() => {
    if (currentSample && !samples.find(s => s.id === currentSample.id)) {
      setSamples(prev => [...prev, currentSample]);
    }
  }, [currentSample, samples]);

  const calculateMetrics = (keystrokes: KeyTiming[]) => {
    if (keystrokes.length < 2) return null;
    
    const dwellTimes = keystrokes.map(k => k.duration);
    const flightTimes = keystrokes.slice(1).map((k, i) => k.pressTime - keystrokes[i].releaseTime);
    
    return {
      avgDwellTime: dwellTimes.reduce((sum, t) => sum + t, 0) / dwellTimes.length,
      avgFlightTime: flightTimes.reduce((sum, t) => sum + t, 0) / flightTimes.length,
      dwellVariance: calculateVariance(dwellTimes),
      flightVariance: calculateVariance(flightTimes),
      typingSpeed: (keystrokes.length / (keystrokes[keystrokes.length - 1].releaseTime - keystrokes[0].pressTime)) * 60000
    };
  };

  const calculateVariance = (values: number[]) => {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  };

  const getComparisonData = () => {
    if (!selectedSample || !currentSample) return null;

    const currentMetrics = calculateMetrics(currentSample.keystrokes);
    const selectedMetrics = calculateMetrics(selectedSample.keystrokes);

    if (!currentMetrics || !selectedMetrics) return null;

    return [
      {
        metric: 'Dwell Time',
        current: currentMetrics.avgDwellTime,
        selected: selectedMetrics.avgDwellTime,
        unit: 'ms'
      },
      {
        metric: 'Flight Time',
        current: Math.abs(currentMetrics.avgFlightTime),
        selected: Math.abs(selectedMetrics.avgFlightTime),
        unit: 'ms'
      },
      {
        metric: 'Typing Speed',
        current: currentMetrics.typingSpeed,
        selected: selectedMetrics.typingSpeed,
        unit: 'CPM'
      },
      {
        metric: 'Confidence',
        current: currentSample.confidenceScore,
        selected: selectedSample.confidenceScore,
        unit: '%'
      }
    ];
  };

  const getTimingChart = () => {
    if (!selectedSample || !currentSample) return null;

    const maxLength = Math.min(currentSample.keystrokes.length, selectedSample.keystrokes.length, 20);
    
    return Array.from({ length: maxLength }, (_, i) => ({
      keystroke: i + 1,
      current: currentSample.keystrokes[i]?.duration || 0,
      selected: selectedSample.keystrokes[i]?.duration || 0
    }));
  };

  const getTrendIcon = (current: number, selected: number) => {
    const diff = ((current - selected) / selected) * 100;
    if (Math.abs(diff) < 5) return <Minus className="h-4 w-4 text-gray-500" />;
    return diff > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const comparisonData = getComparisonData();
  const timingChart = getTimingChart();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compare className="h-5 w-5" />
          Comparative Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sample selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Compare with previous sample:</label>
          <div className="flex flex-wrap gap-2">
            {samples.slice(0, -1).map((sample) => (
              <Button
                key={sample.id}
                variant={selectedSample?.id === sample.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSample(sample)}
                className="flex items-center gap-2"
              >
                {sample.label}
                <Badge variant="secondary" className="text-xs">
                  {sample.confidenceScore.toFixed(0)}%
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {selectedSample && currentSample && comparisonData && (
          <>
            {/* Metrics comparison */}
            <div className="space-y-3">
              <h4 className="font-medium">Metrics Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisonData.map((item) => (
                  <div key={item.metric} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.metric}</span>
                      {getTrendIcon(item.current, item.selected)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current:</span>
                        <span className="font-medium">
                          {item.current.toFixed(item.unit === '%' ? 1 : 0)}{item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Previous:</span>
                        <span className="font-medium">
                          {item.selected.toFixed(item.unit === '%' ? 1 : 0)}{item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Difference:</span>
                        <span className={`font-medium ${
                          item.current > item.selected ? 'text-green-600' : 
                          item.current < item.selected ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.current > item.selected ? '+' : ''}
                          {(item.current - item.selected).toFixed(item.unit === '%' ? 1 : 0)}{item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timing pattern comparison chart */}
            {timingChart && (
              <div className="space-y-3">
                <h4 className="font-medium">Keystroke Timing Patterns</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timingChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="keystroke" 
                        label={{ value: 'Keystroke #', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          `${value.toFixed(0)}ms`,
                          name === 'current' ? 'Current Sample' : 'Previous Sample'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="current" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="current"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="selected" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="selected"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Similarity analysis */}
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium mb-2">Pattern Similarity</h4>
              <p className="text-sm text-muted-foreground">
                Based on the comparison, your typing patterns show{' '}
                {Math.abs(currentSample.confidenceScore - selectedSample.confidenceScore) < 10 ? (
                  <span className="text-green-600 font-medium">high consistency</span>
                ) : Math.abs(currentSample.confidenceScore - selectedSample.confidenceScore) < 25 ? (
                  <span className="text-yellow-600 font-medium">moderate consistency</span>
                ) : (
                  <span className="text-red-600 font-medium">low consistency</span>
                )}
                {' '}across samples. This indicates your biometric signature is{' '}
                {Math.abs(currentSample.confidenceScore - selectedSample.confidenceScore) < 10 ? 
                  'highly stable and reliable for authentication.' :
                  'developing and may improve with more training samples.'
                }
              </p>
            </div>
          </>
        )}

        {samples.length < 2 && (
          <div className="text-center text-muted-foreground text-sm">
            Complete more typing samples to enable comparative analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparativeAnalysis;
