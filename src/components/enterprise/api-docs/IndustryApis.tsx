import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, DollarSign, Scale, Shield, CheckCircle, FileText } from 'lucide-react';

export const IndustryApis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Industry-Specific APIs</h2>
      </div>

      <Tabs defaultValue="healthcare" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
        </TabsList>

        <TabsContent value="healthcare" className="space-y-4">
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              HL7 FHIR R4 compatible APIs with HIPAA compliance for healthcare integrations.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Patient Authentication
                </CardTitle>
                <CardDescription>Secure patient identity verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Endpoint</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    POST /api/v1/healthcare/patient/authenticate
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">FHIR Compliance</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">Patient Resource</Badge>
                    <Badge variant="secondary">Consent Resource</Badge>
                    <Badge variant="secondary">AuditEvent</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Example Request</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    {`{
  "patient_id": "fhir:Patient/123",
  "mrn": "MRN12345",
  "keystroke_data": {...},
  "consent_reference": "Consent/456"
}`}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EMR Integration</CardTitle>
                <CardDescription>Epic, Cerner, AllScripts compatible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Supported EMRs</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Epic MyChart</Badge>
                    <Badge variant="outline">Cerner PowerChart</Badge>
                    <Badge variant="outline">AllScripts</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Compliance Features</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">21 CFR Part 11</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">GDPR Ready</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              ISO 27001 compliant APIs for financial services with PCI DSS Level 1 certification.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Transaction Authentication
                </CardTitle>
                <CardDescription>High-value transaction verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Endpoint</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    POST /api/v1/financial/transaction/verify
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Risk Thresholds</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Low Risk (&lt;$1k)</span>
                      <Badge variant="secondary">85% confidence</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium Risk ($1k-$10k)</span>
                      <Badge variant="secondary">90% confidence</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">High Risk (&gt;$10k)</span>
                      <Badge variant="secondary">95% confidence</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Compliance</CardTitle>
                <CardDescription>Multi-jurisdiction support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Compliance Standards</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">PCI DSS Level 1</Badge>
                    <Badge variant="outline">SOX Compliant</Badge>
                    <Badge variant="outline">PSD2 Ready</Badge>
                    <Badge variant="outline">GDPR</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Audit Trail</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    {`{
  "transaction_id": "txn_abc123",
  "audit_trail": {
    "biometric_score": 0.95,
    "risk_assessment": "low",
    "compliance_flags": []
  }
}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Alert>
            <Scale className="h-4 w-4" />
            <AlertDescription>
              Digital signature compatible APIs with legal-grade identity verification.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Document Signing
                </CardTitle>
                <CardDescription>Integration with DocuSign, Adobe Sign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Supported Platforms</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">DocuSign</Badge>
                    <Badge variant="outline">Adobe Sign</Badge>
                    <Badge variant="outline">HelloSign</Badge>
                    <Badge variant="outline">PandaDoc</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Legal Standards</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">eIDAS Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">ESIGN Act</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">UETA Compliant</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notarization Support</CardTitle>
                <CardDescription>Remote online notarization (RON)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Identity Verification</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    {`{
  "signer_id": "legal_client_123",
  "document_hash": "sha256:abc...",
  "biometric_verification": {
    "confidence": 0.98,
    "legal_grade": true
  }
}`}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Audit Requirements</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Chain of custody</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Tamper evidence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Legal admissibility</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="government" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Government-grade security with clearance level support and FISMA compliance.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Clearance Verification
                </CardTitle>
                <CardDescription>Multi-level security clearance support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Security Levels</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Unclassified</span>
                      <Badge variant="secondary">Standard Auth</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Confidential</span>
                      <Badge variant="secondary">Enhanced Auth</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Secret</span>
                      <Badge variant="secondary">Multi-Factor</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Top Secret</span>
                      <Badge variant="secondary">Continuous Auth</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Endpoint</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    POST /api/v1/government/clearance/verify
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FISMA Compliance</CardTitle>
                <CardDescription>Federal security standards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Compliance Features</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">FISMA Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">FedRAMP Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">NIST 800-53</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">CJIS Compliant</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Audit Trail</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    {`{
  "access_request": {
    "clearance_level": "secret",
    "compartment": "sci",
    "need_to_know": true,
    "biometric_confidence": 0.97
  }
}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};