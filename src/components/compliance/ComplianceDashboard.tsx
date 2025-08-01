import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCompliance } from '@/hooks/useCompliance';
import { IndustryType, ComplianceStandard } from '@/types/compliance';
import { Shield, FileText, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const ComplianceDashboard: React.FC = () => {
  const { config, loading, createConfig, updateConfig, getComplianceRules, getDataRetentionPolicies, calculateComplianceScore } = useCompliance();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('general');
  const [selectedStandards, setSelectedStandards] = useState<ComplianceStandard[]>([]);

  const industries: { value: IndustryType; label: string }[] = [
    { value: 'financial', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'legal', label: 'Legal Services' },
    { value: 'government', label: 'Government' },
    { value: 'education', label: 'Education' },
    { value: 'general', label: 'General Business' }
  ];

  const standards: { value: ComplianceStandard; label: string }[] = [
    { value: 'GDPR', label: 'GDPR - General Data Protection Regulation' },
    { value: 'HIPAA', label: 'HIPAA - Health Insurance Portability' },
    { value: 'SOX', label: 'SOX - Sarbanes-Oxley Act' },
    { value: 'PCI-DSS', label: 'PCI-DSS - Payment Card Industry' },
    { value: 'NIST', label: 'NIST - Cybersecurity Framework' },
    { value: 'ISO27001', label: 'ISO 27001 - Information Security' }
  ];

  const handleCreateConfig = async () => {
    await createConfig(selectedIndustry, selectedStandards.length > 0 ? selectedStandards : undefined);
  };

  const handleStandardToggle = (standard: ComplianceStandard) => {
    setSelectedStandards(prev => 
      prev.includes(standard) 
        ? prev.filter(s => s !== standard)
        : [...prev, standard]
    );
  };

  const complianceRules = getComplianceRules();
  const retentionPolicies = getDataRetentionPolicies();
  const complianceScore = calculateComplianceScore();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 bg-muted animate-pulse rounded" />
          <div className="h-48 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Compliance Configuration Required</h3>
          <p className="text-muted-foreground mb-6">Set up your compliance framework to enable advanced audit and legal features.</p>
          
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Configure Compliance Framework</CardTitle>
              <CardDescription>Select your industry and applicable compliance standards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Industry Type</label>
                <Select value={selectedIndustry} onValueChange={(value) => setSelectedIndustry(value as IndustryType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Compliance Standards</label>
                <div className="space-y-2">
                  {standards.map(standard => (
                    <div key={standard.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={standard.value}
                        checked={selectedStandards.includes(standard.value)}
                        onCheckedChange={() => handleStandardToggle(standard.value)}
                      />
                      <label htmlFor={standard.value} className="text-sm">
                        {standard.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateConfig} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Create Compliance Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Dashboard</h2>
          <p className="text-muted-foreground">Industry: {config.industry} • Audit Level: {config.audit_level}</p>
        </div>
        <Badge variant={complianceScore >= 80 ? 'default' : complianceScore >= 60 ? 'secondary' : 'destructive'}>
          Compliance Score: {complianceScore}%
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Compliance Standards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {config.standards.map(standard => (
                <Badge key={standard} variant="outline" className="mr-2">
                  {standard}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{config.data_retention_days}</p>
            <p className="text-sm text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Audit Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold capitalize">{config.audit_level}</p>
            <p className="text-sm text-muted-foreground">
              {config.legal_hold_enabled ? 'Legal hold enabled' : 'Standard retention'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Compliance Rules Status
            </CardTitle>
            <CardDescription>Current implementation status of required compliance rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{rule.requirement}</p>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                  <div className="flex items-center">
                    {rule.implementation_status === 'implemented' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : rule.implementation_status === 'failed' ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <Badge 
                      variant={rule.implementation_status === 'implemented' ? 'default' : 'secondary'}
                      className="ml-2 text-xs"
                    >
                      {rule.implementation_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Data Retention Policies
            </CardTitle>
            <CardDescription>Automated data lifecycle management based on compliance requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {retentionPolicies.map((policy, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{policy.data_type.replace('_', ' ')}</h4>
                    <Badge variant="outline" className="text-xs">
                      {policy.retention_days} days
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Archive: {policy.archive_after_days} days</div>
                    <div>Method: {policy.deletion_method}</div>
                  </div>
                  {policy.legal_hold_override && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      Legal Hold Override
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Score Overview</CardTitle>
          <CardDescription>Overall compliance posture based on implemented controls and audit findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Compliance</span>
                <span className="text-sm font-bold">{complianceScore}%</span>
              </div>
              <Progress value={complianceScore} className="h-2" />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Encryption Required</p>
                <p className="text-muted-foreground">{config.encryption_required ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="font-medium">Anonymization Required</p>
                <p className="text-muted-foreground">{config.anonymization_required ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};