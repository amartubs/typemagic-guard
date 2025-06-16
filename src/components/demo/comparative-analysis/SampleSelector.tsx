
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TypingSample {
  id: string;
  label: string;
  keystrokes: any[];
  confidenceScore: number;
  timestamp: Date;
}

interface SampleSelectorProps {
  samples: TypingSample[];
  selectedSample: TypingSample | null;
  onSampleSelect: (sample: TypingSample) => void;
}

const SampleSelector: React.FC<SampleSelectorProps> = ({
  samples,
  selectedSample,
  onSampleSelect
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Compare with previous sample:</label>
      <div className="flex flex-wrap gap-2">
        {samples.slice(0, -1).map((sample) => (
          <Button
            key={sample.id}
            variant={selectedSample?.id === sample.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSampleSelect(sample)}
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
  );
};

export default SampleSelector;
