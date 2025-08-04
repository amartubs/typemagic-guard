import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Shield, 
  FileText, 
  Building2,
  Heart,
  DollarSign,
  Scale,
  Users
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface IndustryDashboardsProps {
  industry: 'financial' | 'healthcare' | 'legal' | 'government';
  timeRange: string;
}

const IndustryDashboards: React.FC<IndustryDashboardsProps> = ({ industry, timeRange }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  const getIndustryData = () => {
    switch (industry) {
      case 'financial':
        return {
          title: 'Financial Risk Assessment Dashboard',
          icon: <DollarSign className="h-5 w-5" />,
          color: 'hsl(var(--primary))',
          metrics: {
            riskScore: 72,
            fraudDetections: 3,
            complianceScore: 96,
            transactionVolume: 12450,
            suspiciousActivities: 8,
            kycCompliance: 98
          },
          charts: [
            {
              id: 'risk-trends',
              title: 'Risk Assessment Trends',
              data: [
                { date: 'Mon', risk: 65, fraud: 2, compliance: 94 },
                { date: 'Tue', risk: 72, fraud: 3, compliance: 96 },
                { date: 'Wed', risk: 68, fraud: 1, compliance: 97 },
                { date: 'Thu', risk: 75, fraud: 4, compliance: 95 },
                { date: 'Fri', risk: 70, fraud: 2, compliance: 98 }
              ]
            },
            {
              id: 'transaction-analysis',
              title: 'Transaction Risk Distribution',
              data: [
                { name: 'Low Risk', value: 85, count: 10582 },
                { name: 'Medium Risk', value: 12, count: 1494 },
                { name: 'High Risk', value: 3, count: 374 }
              ]
            }
          ],
          alerts: [
            { type: 'critical', message: 'Unusual transaction pattern detected for user ID 4521', time: '2 minutes ago' },
            { type: 'warning', message: 'KYC document verification failed for 3 users', time: '15 minutes ago' },
            { type: 'info', message: 'New AML rule triggered 2 additional reviews', time: '1 hour ago' }
          ]
        };
      case 'healthcare':
        return {
          title: 'Healthcare Access Pattern Analysis',
          icon: <Heart className="h-5 w-5" />,
          color: 'hsl(var(--accent))',
          metrics: {
            accessCompliance: 94,
            hipaaBreach: 0,
            unauthorizedAccess: 2,
            patientRecords: 8750,
            staffAccess: 245,
            auditFindings: 1
          },
          charts: [
            {
              id: 'access-patterns',
              title: 'Patient Record Access Patterns',
              data: [
                { hour: '00', doctors: 2, nurses: 5, admin: 1 },
                { hour: '06', doctors: 15, nurses: 25, admin: 8 },
                { hour: '12', doctors: 45, nurses: 60, admin: 15 },
                { hour: '18', doctors: 30, nurses: 40, admin: 10 },
                { hour: '24', doctors: 5, nurses: 12, admin: 3 }
              ]
            },
            {
              id: 'compliance-metrics',
              title: 'HIPAA Compliance Metrics',
              data: [
                { name: 'Compliant Access', value: 94, count: 8225 },
                { name: 'Flagged Access', value: 4, count: 350 },
                { name: 'Violations', value: 2, count: 175 }
              ]
            }
          ],
          alerts: [
            { type: 'warning', message: 'After-hours access to patient records by Dr. Smith', time: '5 minutes ago' },
            { type: 'info', message: 'Bulk export request requires additional approval', time: '20 minutes ago' },
            { type: 'success', message: 'Weekly HIPAA audit completed successfully', time: '2 hours ago' }
          ]
        };
      case 'legal':
        return {
          title: 'Legal Document Authenticity Reports',
          icon: <Scale className="h-5 w-5" />,
          color: 'hsl(var(--secondary))',
          metrics: {
            documentIntegrity: 99,
            digitalSignatures: 156,
            authenticityScore: 97,
            tamperDetections: 1,
            certifiedDocs: 142,
            auditTrail: 100
          },
          charts: [
            {
              id: 'signature-trends',
              title: 'Digital Signature Verification',
              data: [
                { date: 'Week 1', verified: 45, failed: 1, pending: 3 },
                { date: 'Week 2', verified: 52, failed: 0, pending: 2 },
                { date: 'Week 3', verified: 38, failed: 2, pending: 1 },
                { date: 'Week 4', verified: 41, failed: 1, pending: 4 }
              ]
            },
            {
              id: 'document-types',
              title: 'Document Type Distribution',
              data: [
                { name: 'Contracts', value: 45, count: 65 },
                { name: 'Legal Briefs', value: 30, count: 43 },
                { name: 'Court Filings', value: 15, count: 22 },
                { name: 'Agreements', value: 10, count: 14 }
              ]
            }
          ],
          alerts: [
            { type: 'critical', message: 'Document tampering detected in contract #CRT-2024-156', time: '1 minute ago' },
            { type: 'warning', message: 'Digital signature verification failed for 2 documents', time: '30 minutes ago' },
            { type: 'info', message: 'New e-signature certificate uploaded', time: '1 hour ago' }
          ]
        };
      case 'government':
        return {
          title: 'Government Security Incident Reporting',
          icon: <Building2 className="h-5 w-5" />,
          color: 'hsl(var(--destructive))',
          metrics: {
            securityLevel: 87,
            clearanceViolations: 0,
            unauthorizedAccess: 1,
            classifiedDocs: 2340,
            activePersonnel: 156,
            incidentReports: 3
          },
          charts: [
            {
              id: 'security-incidents',
              title: 'Security Incident Trends',
              data: [
                { month: 'Jan', incidents: 2, severity: 'low', resolved: 2 },
                { month: 'Feb', incidents: 1, severity: 'medium', resolved: 1 },
                { month: 'Mar', incidents: 3, severity: 'low', resolved: 3 },
                { month: 'Apr', incidents: 0, severity: 'none', resolved: 0 },
                { month: 'May', incidents: 1, severity: 'high', resolved: 0 }
              ]
            },
            {
              id: 'clearance-levels',
              title: 'Security Clearance Access',
              data: [
                { name: 'Top Secret', value: 15, count: 23 },
                { name: 'Secret', value: 35, count: 55 },
                { name: 'Confidential', value: 30, count: 47 },
                { name: 'Public', value: 20, count: 31 }
              ]
            }
          ],
          alerts: [
            { type: 'critical', message: 'Unauthorized access attempt to classified documents', time: '3 minutes ago' },
            { type: 'warning', message: 'Security clearance expiring for 5 personnel', time: '45 minutes ago' },
            { type: 'info', message: 'Monthly security briefing scheduled', time: '2 hours ago' }
          ]
        };
      default:
        return null;
    }
  };

  const industryData = getIndustryData();
  if (!industryData) return null;

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const renderMetricsCards = () => {
    const metrics = Object.entries(industryData.metrics);
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {metrics.map(([key, value], index) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof value === 'number' ? 
                      (key.includes('Score') || key.includes('Compliance') ? `${value}%` : value.toLocaleString()) 
                      : value
                    }
                  </p>
                </div>
                {key.includes('Score') || key.includes('Compliance') ? (
                  <Progress value={value as number} className="w-12" />
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderChart = (chart: any) => {
    if (chart.id.includes('distribution') || chart.id.includes('types') || chart.id.includes('clearance')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chart.data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey={Object.keys(chart.data[0] || {}).find(key => key !== 'date') || 'value'} 
            stroke={industryData.color} 
            fill={industryData.color} 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <Shield className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {industryData.icon}
          <h2 className="text-2xl font-bold">{industryData.title}</h2>
        </div>
        <Badge variant="outline" className="capitalize">{industry}</Badge>
      </div>

      {renderMetricsCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {industryData.charts.map((chart) => (
          <Card key={chart.id}>
            <CardHeader>
              <CardTitle>{chart.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart(chart)}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Real-time Alerts</span>
          </CardTitle>
          <CardDescription>Recent security and compliance notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {industryData.alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryDashboards;