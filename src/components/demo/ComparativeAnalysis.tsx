
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyTiming } from '@/lib/types';
import { GitCompare } from 'lucide-react';
import SampleSelector from './comparative-analysis/SampleSelector';
import ComparisonMetrics from './comparative-analysis/ComparisonMetrics';
import TimingChart from './comparative-analysis/TimingChart';
import SimilarityAnalysis from './comparative-analysis/SimilarityAnalysis';

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

  const comparisonData = getComparisonData();
  const timingChart = getTimingChart();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Comparative Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SampleSelector
          samples={samples}
          selectedSample={selectedSample}
          onSampleSelect={setSelectedSample}
        />

        {selectedSample && currentSample && comparisonData && (
          <>
            <ComparisonMetrics comparisonData={comparisonData} />

            {timingChart && (
              <TimingChart timingChart={timingChart} />
            )}

            <SimilarityAnalysis
              currentSample={currentSample}
              selectedSample={selectedSample}
            />
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
