
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  FileText,
  Share,
  Settings,
  Plus
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'performance' | 'user_behavior' | 'compliance';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  lastGenerated: string;
  status: 'active' | 'inactive';
}

interface CustomReportsProps {
  templates: ReportTemplate[];
  onGenerateReport: (templateId: string, config: any) => void;
  onCreateTemplate: () => void;
}

const CustomReports: React.FC<CustomReportsProps> = ({ 
  templates, 
  onGenerateReport, 
  onCreateTemplate 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const [filterCriteria, setFilterCriteria] = useState<string>('all');

  const handleGenerateReport = () => {
    if (!selectedTemplate) return;
    
    const config = {
      dateRange,
      format: reportFormat,
      filters: filterCriteria
    };
    
    onGenerateReport(selectedTemplate, config);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'destructive';
      case 'performance': return 'default';
      case 'user_behavior': return 'secondary';
      case 'compliance': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Report Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Generate Custom Report
          </CardTitle>
          <CardDescription>
            Create detailed analytics reports with custom parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template">Report Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filters">Filters</Label>
              <Select value={filterCriteria} onValueChange={setFilterCriteria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All data</SelectItem>
                  <SelectItem value="success_only">Successful only</SelectItem>
                  <SelectItem value="failures_only">Failures only</SelectItem>
                  <SelectItem value="high_confidence">High confidence</SelectItem>
                  <SelectItem value="anomalies">Anomalies only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleGenerateReport} disabled={!selectedTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={onCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>
            Pre-configured report templates for common analytics needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <Badge variant={getTypeColor(template.type) as any}>
                      {template.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getStatusColor(template.status) as any}>
                      {template.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Frequency: {template.frequency}</span>
                    <span>Last generated: {new Date(template.lastGenerated).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onGenerateReport(template.id, { dateRange: '7d', format: 'pdf' })}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Quick Generate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Previously generated reports available for download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Mock recent reports */}
            {[
              { name: 'Security Analysis Report', date: '2024-01-29', size: '2.3 MB', format: 'PDF' },
              { name: 'User Behavior Analytics', date: '2024-01-28', size: '1.8 MB', format: 'Excel' },
              { name: 'Performance Metrics', date: '2024-01-27', size: '945 KB', format: 'CSV' },
              { name: 'Compliance Report', date: '2024-01-26', size: '1.2 MB', format: 'PDF' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.date} • {report.size} • {report.format}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReports;
