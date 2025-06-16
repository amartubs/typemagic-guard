
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileJson, FileSpreadsheet, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { DashboardMetrics } from '@/hooks/useDashboardData';

interface ExportManagerProps {
  metrics: DashboardMetrics | undefined;
  recentActivity: any[];
}

const ExportManager: React.FC<ExportManagerProps> = ({ metrics, recentActivity }) => {
  const { user } = useAuth();
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [selectedData, setSelectedData] = useState<string[]>(['metrics', 'activity']);
  const [isExporting, setIsExporting] = useState(false);

  const isEnterprise = user?.subscription?.tier === 'enterprise';

  if (!isEnterprise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Data Export
          </CardTitle>
          <CardDescription>
            Export your analytics data and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enterprise Feature</h3>
            <p className="text-muted-foreground">
              Data export capabilities are available for Enterprise subscribers.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDataSelection = (dataType: string, checked: boolean) => {
    setSelectedData(prev => 
      checked 
        ? [...prev, dataType]
        : prev.filter(item => item !== dataType)
    );
  };

  const generateExportData = () => {
    const exportData: any = {
      timestamp: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        tier: user?.subscription?.tier
      }
    };

    if (selectedData.includes('metrics') && metrics) {
      exportData.metrics = metrics;
    }

    if (selectedData.includes('activity')) {
      exportData.recentActivity = recentActivity;
    }

    if (selectedData.includes('analytics')) {
      exportData.analytics = {
        period: '30d',
        generatedAt: new Date().toISOString(),
        summary: {
          totalAuthentications: metrics?.authenticationsToday || 0,
          averageConfidence: metrics?.confidenceScore || 0,
          securityEvents: metrics?.fraudDetections || 0
        }
      };
    }

    return exportData;
  };

  const handleExport = async () => {
    if (selectedData.length === 0) return;

    setIsExporting(true);
    
    try {
      const data = generateExportData();
      
      if (exportFormat === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadFile(blob, `analytics-export-${new Date().toISOString().split('T')[0]}.json`);
      } else {
        // Convert to CSV format
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadFile(blob, `analytics-export-${new Date().toISOString().split('T')[0]}.csv`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any): string => {
    const rows: string[] = [];
    
    // Add metrics data
    if (data.metrics) {
      rows.push('Metric,Value');
      Object.entries(data.metrics).forEach(([key, value]) => {
        rows.push(`${key},${value}`);
      });
      rows.push(''); // Empty row separator
    }
    
    // Add activity data
    if (data.recentActivity && data.recentActivity.length > 0) {
      const headers = Object.keys(data.recentActivity[0]);
      rows.push(headers.join(','));
      data.recentActivity.forEach((activity: any) => {
        const values = headers.map(header => activity[header] || '');
        rows.push(values.join(','));
      });
    }
    
    return rows.join('\n');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export
          <Badge variant="default" className="ml-2">
            Enterprise
          </Badge>
        </CardTitle>
        <CardDescription>
          Export your analytics data and reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Export Format</label>
          <Select value={exportFormat} onValueChange={(value: 'json' | 'csv') => setExportFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  JSON Format
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV Format
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Data to Export</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metrics"
                checked={selectedData.includes('metrics')}
                onCheckedChange={(checked) => handleDataSelection('metrics', !!checked)}
              />
              <label htmlFor="metrics" className="text-sm">Security Metrics</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="activity"
                checked={selectedData.includes('activity')}
                onCheckedChange={(checked) => handleDataSelection('activity', !!checked)}
              />
              <label htmlFor="activity" className="text-sm">Recent Activity</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="analytics"
                checked={selectedData.includes('analytics')}
                onCheckedChange={(checked) => handleDataSelection('analytics', !!checked)}
              />
              <label htmlFor="analytics" className="text-sm">Analytics Summary</label>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={selectedData.length === 0 || isExporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportManager;
