import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Heart, 
  Scale, 
  DollarSign, 
  Download, 
  Play, 
  Settings, 
  CheckCircle,
  Clock,
  Code,
  FileText,
  Zap,
  Shield
} from 'lucide-react';

interface IntegrationTemplate {
  id: string;
  name: string;
  industry: 'financial' | 'healthcare' | 'legal' | 'government';
  description: string;
  useCase: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  technologies: string[];
  features: string[];
  complianceStandards: string[];
  codeSnippets: {
    language: string;
    code: string;
    description: string;
  }[];
  documentation: string[];
  status: 'ready' | 'beta' | 'development';
}

const IndustryIntegrationTemplates: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('financial');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: IntegrationTemplate[] = [
    {
      id: 'financial-banking-api',
      name: 'Banking API Integration',
      industry: 'financial',
      description: 'Secure biometric authentication for online banking systems',
      useCase: 'Customer login and transaction verification for digital banking platforms',
      complexity: 'complex',
      estimatedTime: '3-5 days',
      technologies: ['REST API', 'JWT', 'OAuth 2.0', 'WebSocket', 'AES-256'],
      features: [
        'Multi-factor biometric authentication',
        'Transaction risk scoring',
        'Real-time fraud detection',
        'PCI DSS compliance monitoring',
        'Audit trail generation'
      ],
      complianceStandards: ['PCI DSS', 'SOX', 'GDPR', 'PSD2'],
      codeSnippets: [
        {
          language: 'javascript',
          code: `// Banking API Integration
const BiometricBankingAuth = {
  async authenticateCustomer(customerId, biometricData) {
    const response = await fetch('/api/banking/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getApiKey()
      },
      body: JSON.stringify({
        customerId,
        biometricData,
        transactionContext: this.getTransactionContext()
      })
    });
    
    return response.json();
  },
  
  async verifyTransaction(transactionId, biometricConfidence) {
    if (biometricConfidence < 85) {
      return this.requestAdditionalAuth(transactionId);
    }
    
    return this.approveTransaction(transactionId);
  }
};`,
          description: 'Core banking authentication integration'
        }
      ],
      documentation: [
        'Banking API Setup Guide',
        'PCI DSS Compliance Checklist',
        'Transaction Monitoring Best Practices',
        'Fraud Detection Configuration'
      ],
      status: 'ready'
    },
    {
      id: 'healthcare-ehr-integration',
      name: 'EHR System Integration',
      industry: 'healthcare',
      description: 'HIPAA-compliant biometric access for electronic health records',
      useCase: 'Secure healthcare provider access to patient records and medical systems',
      complexity: 'complex',
      estimatedTime: '4-6 days',
      technologies: ['HL7 FHIR', 'HTTPS', 'SAML 2.0', 'X.509 Certificates', 'AES-256'],
      features: [
        'Healthcare provider authentication',
        'Patient data access logging',
        'HIPAA audit trail',
        'Emergency access protocols',
        'Role-based access control'
      ],
      complianceStandards: ['HIPAA', 'HITECH', 'FDA CFR Part 11', 'GDPR'],
      codeSnippets: [
        {
          language: 'javascript',
          code: `// Healthcare EHR Integration
const HealthcareAuth = {
  async authenticateProvider(providerId, biometricData, patientId) {
    const auditLog = {
      providerId,
      patientId,
      timestamp: new Date().toISOString(),
      accessReason: 'patient_care'
    };
    
    const authResult = await this.biometricAuth(providerId, biometricData);
    
    if (authResult.success) {
      await this.logHIPAAAccess(auditLog);
      return this.generateSessionToken(providerId, authResult.trustScore);
    }
    
    throw new Error('Authentication failed');
  }
};`,
          description: 'HIPAA-compliant provider authentication'
        }
      ],
      documentation: [
        'HIPAA Integration Guide',
        'HL7 FHIR Setup Instructions',
        'Audit Logging Requirements',
        'Emergency Access Procedures'
      ],
      status: 'ready'
    },
    {
      id: 'legal-docusign-integration',
      name: 'Digital Signature Integration',
      industry: 'legal',
      description: 'Enhanced document signing with biometric verification',
      useCase: 'Legal document authentication and digital signature verification',
      complexity: 'medium',
      estimatedTime: '2-3 days',
      technologies: ['DocuSign API', 'PKI', 'X.509', 'PDF/A', 'Timestamp Authority'],
      features: [
        'Biometric-enhanced signatures',
        'Document integrity verification',
        'Legal-grade audit trails',
        'Multi-party signing workflows',
        'Compliance reporting'
      ],
      complianceStandards: ['eIDAS', 'ESIGN Act', 'UETA', 'GDPR'],
      codeSnippets: [
        {
          language: 'javascript',
          code: `// Legal Document Signing Integration
const LegalSigningAuth = {
  async enhancedDocumentSigning(documentId, signerId, biometricData) {
    // Verify signer identity with biometrics
    const identityVerification = await this.verifySignerIdentity(
      signerId, 
      biometricData
    );
    
    if (identityVerification.confidence < 90) {
      throw new Error('Insufficient identity confidence for legal signing');
    }
    
    // Create legal-grade audit entry
    const auditEntry = {
      documentId,
      signerId,
      biometricConfidence: identityVerification.confidence,
      timestamp: new Date().toISOString(),
      legalSignificance: 'high'
    };
    
    return this.executeDocuSignWorkflow(documentId, auditEntry);
  }
};`,
          description: 'Biometric-enhanced document signing'
        }
      ],
      documentation: [
        'DocuSign Integration Setup',
        'Digital Signature Standards',
        'Legal Compliance Guide',
        'Audit Trail Requirements'
      ],
      status: 'ready'
    },
    {
      id: 'government-clearance-system',
      name: 'Security Clearance System',
      industry: 'government',
      description: 'Multi-level security clearance authentication system',
      useCase: 'Government personnel access to classified information systems',
      complexity: 'complex',
      estimatedTime: '5-7 days',
      technologies: ['SAML', 'PKI', 'CAC Integration', 'FIPS 140-2', 'Common Criteria'],
      features: [
        'Security clearance verification',
        'Multi-level access control',
        'Continuous monitoring',
        'Insider threat detection',
        'FISMA compliance'
      ],
      complianceStandards: ['FISMA', 'NIST 800-53', 'FedRAMP', 'CJIS', 'ICD 503'],
      codeSnippets: [
        {
          language: 'javascript',
          code: `// Government Security Clearance Integration
const GovernmentAuth = {
  async authenticatePersonnel(personnelId, clearanceLevel, biometricData) {
    // Verify clearance level and status
    const clearanceStatus = await this.verifyClearanceStatus(
      personnelId, 
      clearanceLevel
    );
    
    if (!clearanceStatus.active) {
      throw new Error('Security clearance inactive or expired');
    }
    
    // Enhanced biometric verification for classified access
    const biometricResult = await this.performEnhancedBiometricAuth(
      personnelId,
      biometricData,
      clearanceLevel
    );
    
    if (biometricResult.trustScore < 95) {
      await this.triggerSecurityAlert(personnelId, 'low_confidence_access');
    }
    
    return this.generateClassifiedAccessToken(personnelId, clearanceLevel);
  }
};`,
          description: 'Security clearance authentication system'
        }
      ],
      documentation: [
        'FISMA Compliance Guide',
        'Security Clearance Integration',
        'NIST 800-53 Implementation',
        'Continuous Monitoring Setup'
      ],
      status: 'ready'
    }
  ];

  const industryConfig = {
    financial: {
      icon: <DollarSign className="h-5 w-5" />,
      color: 'hsl(var(--primary))',
      name: 'Financial Services'
    },
    healthcare: {
      icon: <Heart className="h-5 w-5" />,
      color: 'hsl(var(--accent))',
      name: 'Healthcare'
    },
    legal: {
      icon: <Scale className="h-5 w-5" />,
      color: 'hsl(var(--secondary))',
      name: 'Legal'
    },
    government: {
      icon: <Building2 className="h-5 w-5" />,
      color: 'hsl(var(--destructive))',
      name: 'Government'
    }
  };

  const filteredTemplates = templates.filter(t => t.industry === selectedIndustry);
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'complex': return 'text-red-600 bg-red-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-50';
      case 'beta': return 'text-blue-600 bg-blue-50';
      case 'development': return 'text-orange-600 bg-orange-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Industry Integration Templates</h2>
        <Badge variant="outline">
          {filteredTemplates.length} templates available
        </Badge>
      </div>

      <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
        <TabsList className="w-full">
          {Object.entries(industryConfig).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="flex-1">
              <div className="flex items-center space-x-2">
                {config.icon}
                <span>{config.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(industryConfig).map((industry) => (
          <TabsContent key={industry} value={industry}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Templates</h3>
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {template.estimatedTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-2">
                {selectedTemplateData ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{selectedTemplateData.name}</CardTitle>
                          <CardDescription>{selectedTemplateData.description}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Deploy
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview">
                        <TabsList>
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="code">Code</TabsTrigger>
                          <TabsTrigger value="compliance">Compliance</TabsTrigger>
                          <TabsTrigger value="docs">Documentation</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div>
                            <h5 className="font-semibold mb-2">Use Case</h5>
                            <p className="text-sm text-muted-foreground">
                              {selectedTemplateData.useCase}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold mb-2">Complexity</h5>
                              <Badge className={getComplexityColor(selectedTemplateData.complexity)}>
                                {selectedTemplateData.complexity}
                              </Badge>
                            </div>
                            <div>
                              <h5 className="font-semibold mb-2">Estimated Time</h5>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">{selectedTemplateData.estimatedTime}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-2">Technologies</h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedTemplateData.technologies.map((tech) => (
                                <Badge key={tech} variant="outline">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-2">Features</h5>
                            <ul className="space-y-2">
                              {selectedTemplateData.features.map((feature) => (
                                <li key={feature} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="code" className="space-y-4">
                          {selectedTemplateData.codeSnippets.map((snippet, index) => (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold">{snippet.description}</h5>
                                <Badge variant="outline">
                                  <Code className="h-3 w-3 mr-1" />
                                  {snippet.language}
                                </Badge>
                              </div>
                              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                                <code>{snippet.code}</code>
                              </pre>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="compliance" className="space-y-4">
                          <div>
                            <h5 className="font-semibold mb-3">Compliance Standards</h5>
                            <div className="grid grid-cols-2 gap-4">
                              {selectedTemplateData.complianceStandards.map((standard) => (
                                <div key={standard} className="flex items-center space-x-2 p-3 border rounded-lg">
                                  <Shield className="h-5 w-5 text-green-600" />
                                  <div>
                                    <p className="font-medium">{standard}</p>
                                    <p className="text-xs text-muted-foreground">Compliant</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="docs" className="space-y-4">
                          <div>
                            <h5 className="font-semibold mb-3">Documentation</h5>
                            <div className="space-y-2">
                              {selectedTemplateData.documentation.map((doc) => (
                                <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm">{doc}</span>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        Select a template to view details and integration instructions
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default IndustryIntegrationTemplates;