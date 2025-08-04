import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, DollarSign, Scale, Shield, Download, Eye, CheckCircle } from 'lucide-react';

export const IndustryTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = {
    healthcare: {
      icon: Heart,
      name: "Healthcare Template",
      description: "HIPAA-compliant interface with patient privacy controls",
      features: ["Patient consent management", "FHIR data integration", "Audit logging", "Role-based access"],
      compliance: ["HIPAA", "21 CFR Part 11", "GDPR", "HITECH"],
      colors: { primary: "hsl(210, 100%, 45%)", accent: "hsl(210, 100%, 85%)" }
    },
    financial: {
      icon: DollarSign,
      name: "Financial Services Template", 
      description: "Banking-grade security with transaction monitoring",
      features: ["Transaction verification", "Risk assessment", "Fraud detection", "Regulatory reporting"],
      compliance: ["PCI DSS Level 1", "SOX", "PSD2", "GDPR"],
      colors: { primary: "hsl(142, 76%, 36%)", accent: "hsl(142, 76%, 85%)" }
    },
    legal: {
      icon: Scale,
      name: "Legal Industry Template",
      description: "Document integrity with digital signature support",
      features: ["Document authentication", "Digital signatures", "Chain of custody", "Legal admissibility"],
      compliance: ["eIDAS", "ESIGN Act", "UETA", "ISO 27001"],
      colors: { primary: "hsl(259, 94%, 51%)", accent: "hsl(259, 94%, 85%)" }
    },
    government: {
      icon: Shield,
      name: "Government Template",
      description: "Clearance-based access with FISMA compliance",
      features: ["Security clearance levels", "Compartmentalized access", "Continuous monitoring", "Incident response"],
      compliance: ["FISMA", "FedRAMP", "NIST 800-53", "CJIS"],
      colors: { primary: "hsl(0, 72%, 51%)", accent: "hsl(0, 72%, 85%)" }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Download className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Industry Templates</h2>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Pre-configured templates with industry-specific compliance features and UI components.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(templates).map(([key, template]) => {
          const IconComponent = template.icon;
          return (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" style={{ color: template.colors.primary }} />
                  {template.name}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Features</h4>
                  <div className="space-y-1">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Compliance Standards</h4>
                  <div className="flex gap-2 flex-wrap">
                    {template.compliance.map((standard, index) => (
                      <Badge key={index} variant="secondary" style={{ backgroundColor: template.colors.accent }}>
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedTemplate(key)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    size="sm"
                    style={{ backgroundColor: template.colors.primary }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Deploy Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Template Preview: {templates[selectedTemplate as keyof typeof templates].name}</CardTitle>
            <CardDescription>Interactive preview of the selected industry template</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ui-components" className="space-y-4">
              <TabsList>
                <TabsTrigger value="ui-components">UI Components</TabsTrigger>
                <TabsTrigger value="compliance">Compliance Features</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
              </TabsList>

              <TabsContent value="ui-components" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Login Component</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="w-full h-20 bg-background border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Industry Login UI</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Dashboard Layout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="w-full h-20 bg-background border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Compliance Dashboard</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Audit Panel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="w-full h-20 bg-background border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Audit Trail View</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {templates[selectedTemplate as keyof typeof templates].compliance.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <span className="font-medium">{item} Compliance</span>
                              <p className="text-sm text-muted-foreground">
                                Automated compliance monitoring and reporting
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Regulatory Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Data encryption</span>
                            <Badge variant="secondary">Required</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Audit logging</span>
                            <Badge variant="secondary">Required</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Access controls</span>
                            <Badge variant="secondary">Required</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Incident response</span>
                            <Badge variant="secondary">Required</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Implementation Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Quick Start</h4>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                        <div>1. npm install @typemagic/industry-template</div>
                        <div>2. Configure compliance settings</div>
                        <div>3. Deploy with industry-specific features</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Configuration</h4>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                        {`{
  "industry": "${selectedTemplate}",
  "compliance": {
    "enabled": true,
    "standards": [${templates[selectedTemplate as keyof typeof templates].compliance.map(s => `"${s}"`).join(', ')}]
  }
}`}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Support Resources</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">24/7 compliance support</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Regulatory updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Implementation consulting</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};