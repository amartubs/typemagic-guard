
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricData {
  metric: string;
  current: number;
  selected: number;
  unit: string;
}

interface ComparisonMetricsProps {
  comparisonData: MetricData[];
}

const ComparisonMetrics: React.FC<ComparisonMetricsProps> = ({ comparisonData }) => {
  const getTrendIcon = (current: number, selected: number) => {
    const diff = ((current - selected) / selected) * 100;
    if (Math.abs(diff) < 5) return <Minus className="h-4 w-4 text-gray-500" />;
    return diff > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
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
  );
};

export default ComparisonMetrics;
