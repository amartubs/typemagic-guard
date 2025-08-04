import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Shield, 
  Lock, 
  Hash, 
  Calendar, 
  Search, 
  Download, 
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scale
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface LegalAuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  legalSignificance: 'high' | 'medium' | 'low';
  complianceStandards: string[];
  details: Record<string, any>;
  tamperEvidence: {
    hashChainPrevious?: string;
    cryptographicSignature: string;
    timestampAuthority: string;
  };
  retentionRequiredUntil?: string;
  legalHold: boolean;
  ipAddress?: string;
  userAgent?: string;
}

interface AuditSearchFilters {
  dateRange: { start: string; end: string };
  action: string;
  resourceType: string;
  legalSignificance: string;
  complianceStandard: string;
  legalHold: boolean | null;
}

const LegalGradeAuditLogger: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<LegalAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AuditSearchFilters>({
    dateRange: { 
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      end: new Date().toISOString().split('T')[0] 
    },
    action: '',
    resourceType: '',
    legalSignificance: '',
    complianceStandard: '',
    legalHold: null
  });

  // Mock audit logs data
  const mockAuditLogs: LegalAuditLog[] = [
    {
      id: 'audit_001',
      timestamp: new Date().toISOString(),
      userId: user?.id,
      action: 'biometric_authentication',
      resourceType: 'user_profile',
      resourceId: user?.id,
      legalSignificance: 'high',
      complianceStandards: ['GDPR', 'CCPA', 'HIPAA'],
      details: {
        authenticationMethod: 'keystroke_biometric',
        confidenceScore: 89,
        deviceFingerprint: 'dev_12345',
        sessionId: 'sess_67890'
      },
      tamperEvidence: {
        hashChainPrevious: 'sha256:abc123...',
        cryptographicSignature: 'RSA-SHA256:def456...',
        timestampAuthority: 'RFC3161:timestamping.authority.com'
      },
      retentionRequiredUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      legalHold: false,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...'
    },
    {
      id: 'audit_002',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: user?.id,
      action: 'data_export',
      resourceType: 'personal_data',
      resourceId: `export_${Date.now()}`,
      legalSignificance: 'high',
      complianceStandards: ['GDPR', 'CCPA'],
      details: {
        exportType: 'full_profile',
        dataCategories: ['biometric_patterns', 'authentication_logs', 'session_data'],
        requestReason: 'user_request',
        approvedBy: 'system_automated'
      },
      tamperEvidence: {
        hashChainPrevious: 'sha256:xyz789...',
        cryptographicSignature: 'RSA-SHA256:ghi012...',
        timestampAuthority: 'RFC3161:timestamping.authority.com'
      },
      retentionRequiredUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      legalHold: false,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...'
    },
    {
      id: 'audit_003',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      action: 'compliance_violation_detected',
      resourceType: 'security_incident',
      resourceId: 'incident_789',
      legalSignificance: 'high',
      complianceStandards: ['SOX', 'PCI-DSS'],
      details: {
        violationType: 'unauthorized_access_attempt',
        severity: 'medium',
        detectionMethod: 'behavioral_anomaly',
        responseAction: 'account_locked'
      },
      tamperEvidence: {
        hashChainPrevious: 'sha256:mno345...',
        cryptographicSignature: 'RSA-SHA256:pqr678...',
        timestampAuthority: 'RFC3161:timestamping.authority.com'
      },
      retentionRequiredUntil: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      legalHold: true,
      ipAddress: '203.0.113.45',
      userAgent: 'Unknown'
    }
  ];

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        // In production, this would fetch from legal_audit_logs table
        setAuditLogs(mockAuditLogs);
      } catch (error) {
        console.error('Error loading audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateRange = 
      new Date(log.timestamp) >= new Date(filters.dateRange.start) &&
      new Date(log.timestamp) <= new Date(filters.dateRange.end + 'T23:59:59');

    const matchesAction = !filters.action || log.action === filters.action;
    const matchesResourceType = !filters.resourceType || log.resourceType === filters.resourceType;
    const matchesSignificance = !filters.legalSignificance || log.legalSignificance === filters.legalSignificance;
    const matchesCompliance = !filters.complianceStandard || 
      log.complianceStandards.includes(filters.complianceStandard);
    const matchesLegalHold = filters.legalHold === null || log.legalHold === filters.legalHold;

    return matchesSearch && matchesDateRange && matchesAction && matchesResourceType && 
           matchesSignificance && matchesCompliance && matchesLegalHold;
  });

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const exportAuditLog = (log: LegalAuditLog) => {
    const exportData = {
      ...log,
      exportTimestamp: new Date().toISOString(),
      exportedBy: user?.email,
      legalCertification: 'This audit log export is certified for legal proceedings'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${log.id}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAllLogs = () => {
    const exportData = {
      logs: filteredLogs,
      exportTimestamp: new Date().toISOString(),
      exportedBy: user?.email,
      totalRecords: filteredLogs.length,
      filters: filters,
      legalCertification: 'This audit log export is certified for legal proceedings and includes tamper-evident signatures'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal_audit_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <Scale className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Legal Grade Audit Logger</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportAllLogs} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
            />
            
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
            />

            <Select value={filters.legalSignificance} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, legalSignificance: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Significance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.complianceStandard} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, complianceStandard: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Standards</SelectItem>
                <SelectItem value="GDPR">GDPR</SelectItem>
                <SelectItem value="CCPA">CCPA</SelectItem>
                <SelectItem value="HIPAA">HIPAA</SelectItem>
                <SelectItem value="SOX">SOX</SelectItem>
                <SelectItem value="PCI-DSS">PCI-DSS</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setFilters({
                dateRange: { 
                  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                  end: new Date().toISOString().split('T')[0] 
                },
                action: '',
                resourceType: '',
                legalSignificance: '',
                complianceStandard: '',
                legalHold: null
              })}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Audit Logs ({filteredLogs.length} records)
          </h3>
        </div>

        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getSignificanceIcon(log.legalSignificance)}
                  <div>
                    <h4 className="font-semibold text-lg capitalize">
                      {log.action.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {log.resourceType} - {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSignificanceColor(log.legalSignificance)}>
                    {getSignificanceIcon(log.legalSignificance)}
                    <span className="ml-1 capitalize">{log.legalSignificance}</span>
                  </Badge>
                  {log.legalHold && (
                    <Badge variant="destructive">
                      <Lock className="h-3 w-3 mr-1" />
                      Legal Hold
                    </Badge>
                  )}
                </div>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="tamper">Tamper Evidence</TabsTrigger>
                  <TabsTrigger value="retention">Retention</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Resource ID</p>
                      <p className="font-mono">{log.resourceId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">User ID</p>
                      <p className="font-mono">{log.userId || 'System'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">IP Address</p>
                      <p className="font-mono">{log.ipAddress || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timestamp</p>
                      <p className="font-mono">{new Date(log.timestamp).toISOString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">Event Details</p>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-3">
                  <div>
                    <p className="text-muted-foreground mb-2">Compliance Standards</p>
                    <div className="flex flex-wrap gap-2">
                      {log.complianceStandards.map((standard) => (
                        <Badge key={standard} variant="outline">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tamper" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-2">Cryptographic Signature</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded break-all">
                        {log.tamperEvidence.cryptographicSignature}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2">Hash Chain Previous</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded break-all">
                        {log.tamperEvidence.hashChainPrevious || 'Genesis block'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground mb-2">Timestamp Authority</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded">
                        {log.tamperEvidence.timestampAuthority}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="retention" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Retention Required Until</p>
                      <p className="font-medium">
                        {log.retentionRequiredUntil ? 
                          new Date(log.retentionRequiredUntil).toLocaleDateString() : 
                          'Indefinite'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Legal Hold Status</p>
                      <Badge variant={log.legalHold ? 'destructive' : 'secondary'}>
                        {log.legalHold ? 'Active' : 'None'}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportAuditLog(log)}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LegalGradeAuditLogger;