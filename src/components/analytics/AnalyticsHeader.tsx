
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';

interface AnalyticsHeaderProps {
  timeRange: '7d' | '30d' | '90d';
  refreshing: boolean;
  onTimeRangeChange: (value: '7d' | '30d' | '90d') => void;
  onRefresh: () => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeRange,
  refreshing,
  onTimeRangeChange,
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into authentication patterns, security, and user behavior
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
