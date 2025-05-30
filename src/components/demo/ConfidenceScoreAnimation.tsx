
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';

interface ConfidenceScoreAnimationProps {
  score: number;
  isUpdating: boolean;
  label?: string;
}

const ConfidenceScoreAnimation: React.FC<ConfidenceScoreAnimationProps> = ({
  score,
  isUpdating,
  label = "Confidence Score"
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);

  useEffect(() => {
    setPreviousScore(animatedScore);
    
    if (score !== animatedScore) {
      const startTime = Date.now();
      const duration = 800;
      const startScore = animatedScore;
      const scoreChange = score - startScore;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentScore = startScore + (scoreChange * easeOutCubic);
        
        setAnimatedScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [score]);

  const getScoreColor = () => {
    if (animatedScore >= 75) return 'text-green-600';
    if (animatedScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (animatedScore >= 75) return 'bg-green-500';
    if (animatedScore >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIcon = () => {
    if (animatedScore >= 75) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (animatedScore >= 60) return <Shield className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const scoreDiff = animatedScore - previousScore;

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm">{label}</span>
          {isUpdating && (
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main score display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {getIcon()}
            <span className={`text-3xl font-bold ${getScoreColor()}`}>
              {animatedScore.toFixed(1)}%
            </span>
          </div>
          
          {/* Score change indicator */}
          {Math.abs(scoreDiff) > 0.5 && (
            <div className={`text-sm ${scoreDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)}%
            </div>
          )}
        </div>

        {/* Progress bar with custom styling */}
        <div className="space-y-2">
          <div className="relative">
            <Progress value={animatedScore} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-800 ${getProgressColor()}`}
              style={{ width: `${animatedScore}%` }}
            />
          </div>
          
          {/* Score scale indicators */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status message */}
        <div className="text-center text-sm">
          {animatedScore >= 75 && (
            <span className="text-green-600 font-medium">Excellent Match</span>
          )}
          {animatedScore >= 60 && animatedScore < 75 && (
            <span className="text-yellow-600 font-medium">Good Match</span>
          )}
          {animatedScore < 60 && (
            <span className="text-red-600 font-medium">Poor Match</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceScoreAnimation;
