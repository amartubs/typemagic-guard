import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Eye, 
  Download, 
  Trash2, 
  FileText, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  Database,
  Lock,
  UserCheck
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface MLAuditEntry {
  id: string;
  timestamp: string;
  modelType: 'neural_network' | 'traditional' | 'ensemble';
  action: 'prediction' | 'training' | 'evaluation' | 'data_access';
  userId: string;
  dataSubject: string;
  purpose: string;
  legalBasis: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation';
  dataProcessed: {
    type: 'keystroke' | 'mouse' | 'behavioral' | 'biometric';
    fields: string[];
    retention: string;
    encrypted: boolean;
  };
  modelDecision: {
    input: string;
    output: any;
    confidence: number;
    explanation: string;
  };
  privacyMeasures: {
    anonymized: boolean;
    pseudonymized: boolean;
    minimized: boolean;
    encrypted: boolean;
  };
  retentionSchedule: {
    createdAt: string;
    deleteAfter: string;
    deletionMethod: string;
  };
  consentRecord: {
    obtained: boolean;
    purpose: string;
    timestamp: string;
    withdrawable: boolean;
  };
  auditTrail: {
    accessLog: Array<{
      timestamp: string;
      accessor: string;
      purpose: string;
    }>;
    modifications: Array<{
      timestamp: string;
      type: string;
      justification: string;
    }>;
  };
}

interface GDPRComplianceStatus {
  overallScore: number;
  consentCompliance: number;
  dataMinimization: number;
  retentionCompliance: number;
  securityMeasures: number;
  auditReadiness: number;
  risks: Array<{
    level: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
}

interface DataSubjectRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: string;
  completionDate?: string;
  description: string;
  affectedData: string[];
  justification: string;
}

const GDPRMLAuditTrail: React.FC = () => {
  const { user } = useAuth();
  const [auditEntries, setAuditEntries] = useState<MLAuditEntry[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<GDPRComplianceStatus | null>(null);
  const [dataSubjectRequests, setDataSubjectRequests] = useState<DataSubjectRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<string>('');

  useEffect(() => {
    loadGDPRAuditData();
  }, [user]);

  const loadGDPRAuditData = async () => {
    setIsLoading(true);
    
    try {
      // Generate mock audit entries for ML model usage
      const mockAuditEntries: MLAuditEntry[] = Array.from({ length: 25 }, (_, i) => {
        const modelTypes = ['neural_network', 'traditional', 'ensemble'] as const;
        const actions = ['prediction', 'training', 'evaluation', 'data_access'] as const;
        const legalBases = ['consent', 'legitimate_interest', 'contract', 'legal_obligation'] as const;
        const dataTypes = ['keystroke', 'mouse', 'behavioral', 'biometric'] as const;

        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        return {
          id: `audit_${i + 1}`,
          timestamp: timestamp.toISOString(),
          modelType: modelTypes[Math.floor(Math.random() * modelTypes.length)],
          action: actions[Math.floor(Math.random() * actions.length)],
          userId: user?.id || 'unknown',
          dataSubject: user?.email || 'user@example.com',
          purpose: 'Biometric authentication and security analysis',
          legalBasis: legalBases[Math.floor(Math.random() * legalBases.length)],
          dataProcessed: {
            type: dataTypes[Math.floor(Math.random() * dataTypes.length)],
            fields: ['timing_data', 'pattern_vectors', 'confidence_scores'],
            retention: '90 days',
            encrypted: true
          },
          modelDecision: {
            input: 'Encrypted biometric pattern vector',
            output: {
              authenticated: Math.random() > 0.2,
              confidence: Math.round(Math.random() * 40 + 60),
              riskScore: Math.round(Math.random() * 30 + 10)
            },
            confidence: Math.round(Math.random() * 40 + 60),
            explanation: 'Pattern matching analysis with neural network ensemble'
          },
          privacyMeasures: {
            anonymized: Math.random() > 0.3,
            pseudonymized: true,
            minimized: true,
            encrypted: true
          },
          retentionSchedule: {
            createdAt: timestamp.toISOString(),
            deleteAfter: new Date(timestamp.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            deletionMethod: 'Secure cryptographic erasure'
          },
          consentRecord: {
            obtained: Math.random() > 0.1,
            purpose: 'Biometric authentication and fraud prevention',
            timestamp: new Date(timestamp.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            withdrawable: true
          },
          auditTrail: {
            accessLog: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
              timestamp: new Date(timestamp.getTime() + j * 1000 * 60).toISOString(),
              accessor: 'ML_Engine_Service',
              purpose: 'Automated biometric analysis'
            })),
            modifications: []
          }
        };
      });

      setAuditEntries(mockAuditEntries);

      // Generate compliance status
      const mockComplianceStatus: GDPRComplianceStatus = {
        overallScore: 87,
        consentCompliance: 92,
        dataMinimization: 85,
        retentionCompliance: 89,
        securityMeasures: 94,
        auditReadiness: 78,
        risks: [
          {
            level: 'medium',
            description: 'Some ML model decisions lack detailed explanations',
            recommendation: 'Implement explainable AI features for all model outputs'
          },
          {
            level: 'low',
            description: 'Minor gaps in consent tracking for model retraining',
            recommendation: 'Enhance consent management for continuous learning scenarios'
          }
        ]
      };

      setComplianceStatus(mockComplianceStatus);

      // Generate data subject requests
      const mockRequests: DataSubjectRequest[] = [
        {
          id: 'req_001',
          type: 'access',
          status: 'completed',
          requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Request for all biometric data and ML model decisions',
          affectedData: ['keystroke_patterns', 'ml_predictions', 'audit_logs'],
          justification: 'Data subject access rights under GDPR Article 15'
        },
        {
          id: 'req_002',
          type: 'erasure',
          status: 'processing',
          requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Request for complete data deletion',
          affectedData: ['biometric_profiles', 'ml_training_data', 'behavioral_patterns'],
          justification: 'Right to be forgotten under GDPR Article 17'
        }
      ];

      setDataSubjectRequests(mockRequests);

    } catch (error) {
      console.error('Failed to load GDPR audit data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditLog = async () => {
    try {
      const auditData = {
        timestamp: new Date().toISOString(),
        entries: auditEntries,
        complianceStatus,
        dataSubjectRequests,
        exportedBy: user?.email,
        purpose: 'GDPR compliance audit'
      };

      const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gdpr-ml-audit-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export audit log:', error);
    }
  };

  const processDataSubjectRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setDataSubjectRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: action === 'approve' ? 'completed' : 'rejected',
              completionDate: new Date().toISOString()
            }
          : req
      )
    );
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading GDPR audit data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <h2 className="text-2xl font-bold">GDPR ML Audit Trail</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportAuditLog}>
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      {complianceStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Compliance</p>
                  <p className={`text-2xl font-bold ${getComplianceColor(complianceStatus.overallScore)}`}>
                    {complianceStatus.overallScore}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={complianceStatus.overallScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Audit Entries</p>
                  <p className="text-2xl font-bold">{auditEntries.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Requests</p>
                  <p className="text-2xl font-bold">{dataSubjectRequests.filter(r => r.status === 'pending' || r.status === 'processing').length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="audit-log" className="w-full">
        <TabsList>
          <TabsTrigger value="audit-log">ML Audit Log</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="data-requests">Data Subject Requests</TabsTrigger>
          <TabsTrigger value="privacy-measures">Privacy Measures</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Machine Learning Audit Trail</CardTitle>
              <CardDescription>
                Complete record of ML model decisions and data processing activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Model Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Legal Basis</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Privacy Measures</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditEntries.slice(0, 10).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <Badge variant="outline">
                            {entry.modelType.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entry.legalBasis.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.dataProcessed.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {entry.privacyMeasures.encrypted && (
                            <div title="Encrypted">
                              <Lock className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                          {entry.privacyMeasures.anonymized && (
                            <div title="Anonymized">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {complianceStatus && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Metrics</CardTitle>
                    <CardDescription>GDPR compliance scores by category</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Consent Management', value: complianceStatus.consentCompliance },
                      { label: 'Data Minimization', value: complianceStatus.dataMinimization },
                      { label: 'Retention Compliance', value: complianceStatus.retentionCompliance },
                      { label: 'Security Measures', value: complianceStatus.securityMeasures },
                      { label: 'Audit Readiness', value: complianceStatus.auditReadiness }
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <span className={`text-sm font-bold ${getComplianceColor(metric.value)}`}>
                            {metric.value}%
                          </span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>Identified compliance risks and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complianceStatus.risks.map((risk, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getRiskColor(risk.level)}>
                                {risk.level.toUpperCase()}
                              </Badge>
                              <span className="font-medium">{risk.description}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <strong>Recommendation:</strong> {risk.recommendation}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="data-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Subject Requests</CardTitle>
              <CardDescription>
                Manage GDPR data subject rights requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Affected Data</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSubjectRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">
                        {request.id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {request.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'processing' ? 'secondary' :
                            request.status === 'rejected' ? 'destructive' : 'outline'
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(request.requestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {request.affectedData.slice(0, 2).map((data, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {data}
                            </Badge>
                          ))}
                          {request.affectedData.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{request.affectedData.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => processDataSubjectRequest(request.id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => processDataSubjectRequest(request.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy-measures" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Protection Measures</CardTitle>
                <CardDescription>Technical and organizational measures in place</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { measure: 'End-to-end Encryption', status: 'active', description: 'All biometric data encrypted at rest and in transit' },
                    { measure: 'Data Minimization', status: 'active', description: 'Only necessary data processed for authentication' },
                    { measure: 'Pseudonymization', status: 'active', description: 'User identifiers pseudonymized in ML models' },
                    { measure: 'Automated Deletion', status: 'active', description: '90-day retention with automatic erasure' },
                    { measure: 'Access Controls', status: 'active', description: 'Role-based access to sensitive data' },
                    { measure: 'Audit Logging', status: 'active', description: 'Comprehensive audit trail for all operations' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{item.measure}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ML Model Privacy</CardTitle>
                <CardDescription>Privacy-preserving machine learning measures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    All ML models are designed with privacy-by-design principles, ensuring minimal 
                    data exposure and explainable AI decisions for transparency.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  {[
                    'Federated Learning Implementation',
                    'Differential Privacy in Training',
                    'Model Explanation Generation',
                    'Bias Detection and Mitigation',
                    'Consent-Aware Model Updates',
                    'Right to Explanation Compliance'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GDPRMLAuditTrail;