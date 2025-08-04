import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Shield, FileText, CheckCircle, Clock, DollarSign, Heart, Scale, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface ComplianceStandard {
  id: string;
  name: string;
  industry: string;
  description: string;
  requirements: ComplianceRequirement[];
  status: 'compliant' | 'partial' | 'non_compliant';
  lastAudit: string;
  nextAudit: string;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'met' | 'partial' | 'not_met';
  priority: 'critical' | 'high' | 'medium' | 'low';
  evidence: string[];
  lastChecked: string;
}

interface IndustryComplianceManagerProps {
  industry: 'financial' | 'healthcare' | 'legal' | 'government';
}

const IndustryComplianceManager: React.FC<IndustryComplianceManagerProps> = ({ industry }) => {
  const { user } = useAuth();
  const [standards, setStandards] = useState<ComplianceStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);

  const industryConfig = {
    financial: {
      icon: <DollarSign className="h-5 w-5" />,
      color: 'hsl(var(--primary))',
      standards: ['PCI DSS', 'SOX', 'GDPR', 'ISO 27001', 'FFIEC'],
      primaryColor: 'text-blue-600'
    },
    healthcare: {
      icon: <Heart className="h-5 w-5" />,
      color: 'hsl(var(--accent))',
      standards: ['HIPAA', 'HITECH', 'FDA CFR Part 11', 'GDPR', 'ISO 27799'],
      primaryColor: 'text-green-600'
    },
    legal: {
      icon: <Scale className="h-5 w-5" />,
      color: 'hsl(var(--secondary))',
      standards: ['GDPR', 'eIDAS', 'ISO 27001', 'ABA Guidelines', 'State Bar Requirements'],
      primaryColor: 'text-purple-600'
    },
    government: {
      icon: <Building2 className="h-5 w-5" />,
      color: 'hsl(var(--destructive))',
      standards: ['FISMA', 'NIST 800-53', 'FedRAMP', 'CJIS', 'ICD 503'],
      primaryColor: 'text-red-600'
    }
  };

  const mockStandards: ComplianceStandard[] = [
    {
      id: 'pci-dss',
      name: 'PCI DSS',
      industry: 'financial',
      description: 'Payment Card Industry Data Security Standard',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      requirements: [
        {
          id: 'pci-1',
          title: 'Install and maintain firewall configuration',
          description: 'Maintain firewall and router configurations that protect cardholder data',
          status: 'met',
          priority: 'critical',
          evidence: ['Firewall rules audit', 'Network topology'],
          lastChecked: '2024-01-15'
        },
        {
          id: 'pci-2',
          title: 'Strong authentication and access control',
          description: 'Implement strong authentication measures for access to cardholder data',
          status: 'met',
          priority: 'high',
          evidence: ['Authentication logs', 'Access control matrix'],
          lastChecked: '2024-01-15'
        }
      ]
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      industry: 'healthcare',
      description: 'Health Insurance Portability and Accountability Act',
      status: 'partial',
      lastAudit: '2024-02-01',
      nextAudit: '2024-08-01',
      requirements: [
        {
          id: 'hipaa-1',
          title: 'Administrative Safeguards',
          description: 'Implement administrative safeguards to protect PHI',
          status: 'met',
          priority: 'critical',
          evidence: ['Policy documentation', 'Training records'],
          lastChecked: '2024-02-01'
        },
        {
          id: 'hipaa-2',
          title: 'Technical Safeguards',
          description: 'Implement technical safeguards for PHI access',
          status: 'partial',
          priority: 'high',
          evidence: ['Audit logs', 'Encryption certificates'],
          lastChecked: '2024-02-01'
        }
      ]
    }
  ];

  useEffect(() => {
    const loadComplianceData = async () => {
      try {
        // In production, this would fetch from compliance_configs table
        const filteredStandards = mockStandards.filter(s => s.industry === industry);
        setStandards(filteredStandards);
        if (filteredStandards.length > 0) {
          setSelectedStandard(filteredStandards[0].id);
        }
      } catch (error) {
        console.error('Error loading compliance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComplianceData();
  }, [industry]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'met':
        return 'text-green-600 bg-green-50';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50';
      case 'non_compliant':
      case 'not_met':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'met':
        return <CheckCircle className="h-4 w-4" />;
      case 'partial':
        return <Clock className="h-4 w-4" />;
      case 'non_compliant':
      case 'not_met':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const calculateOverallCompliance = () => {
    if (standards.length === 0) return 0;
    const scores = standards.map(standard => {
      const metRequirements = standard.requirements.filter(req => req.status === 'met').length;
      return (metRequirements / standard.requirements.length) * 100;
    });
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const selectedStandardData = standards.find(s => s.id === selectedStandard);
  const config = industryConfig[industry];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {config.icon}
          <h2 className="text-2xl font-bold">
            {industry.charAt(0).toUpperCase() + industry.slice(1)} Compliance Manager
          </h2>
        </div>
        <Badge variant="outline" className="capitalize">
          {calculateOverallCompliance()}% Compliant
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Compliance</p>
                <p className="text-2xl font-bold">{calculateOverallCompliance()}%</p>
              </div>
            </div>
            <Progress value={calculateOverallCompliance()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Standards Monitored</p>
                <p className="text-2xl font-bold">{standards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold">
                  {standards.reduce((count, standard) => 
                    count + standard.requirements.filter(req => 
                      req.status === 'not_met' && req.priority === 'critical'
                    ).length, 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedStandard || ''} onValueChange={setSelectedStandard}>
        <TabsList className="w-full">
          {standards.map((standard) => (
            <TabsTrigger key={standard.id} value={standard.id} className="flex-1">
              <div className="flex items-center space-x-2">
                {getStatusIcon(standard.status)}
                <span>{standard.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {standards.map((standard) => (
          <TabsContent key={standard.id} value={standard.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{standard.name}</CardTitle>
                    <CardDescription>{standard.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(standard.status)}>
                    {getStatusIcon(standard.status)}
                    <span className="ml-1 capitalize">{standard.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last Audit</p>
                      <p className="font-medium">{new Date(standard.lastAudit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Audit</p>
                      <p className="font-medium">{new Date(standard.nextAudit).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Requirements</h4>
                    {standard.requirements.map((requirement) => (
                      <div key={requirement.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStatusIcon(requirement.status)}
                              <h5 className="font-medium">{requirement.title}</h5>
                              <Badge variant={requirement.priority === 'critical' ? 'destructive' : 'secondary'}>
                                {requirement.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {requirement.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Last checked: {new Date(requirement.lastChecked).toLocaleDateString()}</span>
                              <span>Evidence: {requirement.evidence.length} items</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(requirement.status)}>
                            {requirement.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button>Generate Report</Button>
                    <Button variant="outline">Schedule Audit</Button>
                    <Button variant="outline">Export Evidence</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default IndustryComplianceManager;