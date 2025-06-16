
import React from 'react';

interface TypingSample {
  id: string;
  label: string;
  keystrokes: any[];
  confidenceScore: number;
  timestamp: Date;
}

interface SimilarityAnalysisProps {
  currentSample: TypingSample;
  selectedSample: TypingSample;
}

const SimilarityAnalysis: React.FC<SimilarityAnalysisProps> = ({
  currentSample,
  selectedSample
}) => {
  const getConsistencyLevel = () => {
    const diff = Math.abs(currentSample.confidenceScore - selectedSample.confidenceScore);
    if (diff < 10) return { level: 'high consistency', color: 'text-green-600' };
    if (diff < 25) return { level: 'moderate consistency', color: 'text-yellow-600' };
    return { level: 'low consistency', color: 'text-red-600' };
  };

  const getStabilityMessage = () => {
    const diff = Math.abs(currentSample.confidenceScore - selectedSample.confidenceScore);
    if (diff < 10) {
      return 'highly stable and reliable for authentication.';
    }
    return 'developing and may improve with more training samples.';
  };

  const consistency = getConsistencyLevel();

  return (
    <div className="p-4 bg-muted/20 rounded-lg">
      <h4 className="font-medium mb-2">Pattern Similarity</h4>
      <p className="text-sm text-muted-foreground">
        Based on the comparison, your typing patterns show{' '}
        <span className={`${consistency.color} font-medium`}>
          {consistency.level}
        </span>
        {' '}across samples. This indicates your biometric signature is{' '}
        {getStabilityMessage()}
      </p>
    </div>
  );
};

export default SimilarityAnalysis;
