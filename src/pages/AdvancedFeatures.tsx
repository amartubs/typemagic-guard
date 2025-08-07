import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Activity, Shield } from 'lucide-react';
import ABTestingFramework from '@/components/analytics/ABTestingFramework';
import BehavioralAnomalyDetector from '@/components/analytics/BehavioralAnomalyDetector';
import GDPRMLAuditTrail from '@/components/compliance/GDPRMLAuditTrail';

const AdvancedFeatures: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Advanced Features</h1>
        <p className="text-muted-foreground mt-2">
          Advanced biometric authentication capabilities including A/B testing, real-time anomaly detection, and GDPR compliance
        </p>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FlaskConical className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">A/B Testing Framework</h3>
                <p className="text-sm text-muted-foreground">
                  Compare neural network vs traditional pattern matching
                </p>
                <Badge variant="default" className="mt-1">Production Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Real-time Anomaly Detection</h3>
                <p className="text-sm text-muted-foreground">
                  ML-powered behavioral analysis and threat detection
                </p>
                <Badge variant="default" className="mt-1">Enhanced</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">GDPR ML Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Automated audit trails for ML model decisions
                </p>
                <Badge variant="default" className="mt-1">Compliant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ab-testing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="anomaly-detection">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="gdpr-compliance">GDPR Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="ab-testing">
          <ABTestingFramework />
        </TabsContent>

        <TabsContent value="anomaly-detection">
          <BehavioralAnomalyDetector />
        </TabsContent>

        <TabsContent value="gdpr-compliance">
          <GDPRMLAuditTrail />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedFeatures;