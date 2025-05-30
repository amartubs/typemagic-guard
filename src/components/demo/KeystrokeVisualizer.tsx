
import React, { useState, useEffect } from 'react';
import { KeyTiming } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface KeystrokeVisualizerProps {
  keystrokes: KeyTiming[];
  isActive: boolean;
}

const KeystrokeVisualizer: React.FC<KeystrokeVisualizerProps> = ({ keystrokes, isActive }) => {
  const [animatedKeystrokes, setAnimatedKeystrokes] = useState<(KeyTiming & { id: string })[]>([]);

  useEffect(() => {
    if (keystrokes.length > 0) {
      const newKeystroke = keystrokes[keystrokes.length - 1];
      const keystrokeWithId = { ...newKeystroke, id: `${Date.now()}-${Math.random()}` };
      
      setAnimatedKeystrokes(prev => [...prev, keystrokeWithId]);
      
      // Remove after animation
      setTimeout(() => {
        setAnimatedKeystrokes(prev => prev.filter(k => k.id !== keystrokeWithId.id));
      }, 2000);
    }
  }, [keystrokes]);

  const getRecentMetrics = () => {
    if (keystrokes.length < 2) return null;
    
    const recent = keystrokes.slice(-10);
    const avgDwellTime = recent.reduce((sum, k) => sum + k.duration, 0) / recent.length;
    const avgFlightTime = recent.slice(1).reduce((sum, k, i) => {
      return sum + (k.pressTime - recent[i].releaseTime);
    }, 0) / (recent.length - 1);
    
    return { avgDwellTime, avgFlightTime };
  };

  const metrics = getRecentMetrics();

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Real-time Keystroke Analysis
          {isActive && (
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual keystroke display */}
        <div className="relative h-32 bg-muted/20 rounded-lg overflow-hidden border">
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            {keystrokes.length === 0 ? 'Start typing to see visualization...' : ''}
          </div>
          
          {animatedKeystrokes.map((keystroke) => (
            <div
              key={keystroke.id}
              className="absolute w-3 h-3 bg-primary rounded-full animate-ping"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDuration: '1s'
              }}
            />
          ))}
          
          {/* Rhythm visualization */}
          {keystrokes.length > 1 && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="flex items-end gap-1 h-8">
                {keystrokes.slice(-20).map((keystroke, index) => (
                  <div
                    key={index}
                    className="bg-primary/60 rounded-t min-w-[2px] transition-all duration-300"
                    style={{
                      height: `${Math.min(keystroke.duration / 200 * 100, 100)}%`,
                      flex: 1
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-time metrics */}
        {metrics && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Dwell Time</span>
                <span className="font-medium">{metrics.avgDwellTime.toFixed(0)}ms</span>
              </div>
              <Progress 
                value={Math.min(metrics.avgDwellTime / 200 * 100, 100)} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Flight Time</span>
                <span className="font-medium">{Math.abs(metrics.avgFlightTime).toFixed(0)}ms</span>
              </div>
              <Progress 
                value={Math.min(Math.abs(metrics.avgFlightTime) / 300 * 100, 100)} 
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Keystroke count */}
        <div className="text-center text-sm text-muted-foreground">
          Keystrokes captured: {keystrokes.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeystrokeVisualizer;
