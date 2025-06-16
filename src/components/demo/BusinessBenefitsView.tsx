
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Zap, CheckCircle } from 'lucide-react';

interface BusinessBenefitsViewProps {
  currentSample: any;
}

const BusinessBenefitsView: React.FC<BusinessBenefitsViewProps> = ({ currentSample }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 border rounded-lg bg-green-50">
          <Clock className="mx-auto mb-2 text-green-600" size={24} />
          <h4 className="font-semibold">5 Minute Setup</h4>
          <p className="text-xs text-muted-foreground">Quick integration</p>
          <div className="text-2xl font-bold text-green-600 mt-2">99.9%</div>
          <p className="text-xs">Uptime SLA</p>
        </div>
        <div className="text-center p-4 border rounded-lg bg-blue-50">
          <Users className="mx-auto mb-2 text-blue-600" size={24} />
          <h4 className="font-semibold">Zero User Training</h4>
          <p className="text-xs text-muted-foreground">Invisible to users</p>
          <div className="text-2xl font-bold text-blue-600 mt-2">0ms</div>
          <p className="text-xs">Added latency</p>
        </div>
        <div className="text-center p-4 border rounded-lg bg-purple-50">
          <Zap className="mx-auto mb-2 text-purple-600" size={24} />
          <h4 className="font-semibold">99.8% Accuracy</h4>
          <p className="text-xs text-muted-foreground">Enterprise grade</p>
          <div className="text-2xl font-bold text-purple-600 mt-2">87%</div>
          <p className="text-xs">Avg fraud reduction</p>
        </div>
      </div>
      
      {currentSample && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="text-green-600" size={16} />
            <span className="font-semibold text-green-800">Ready for Production</span>
          </div>
          <p className="text-sm text-green-700">
            Your biometric profile shows {currentSample.confidenceScore >= 75 ? 'excellent' : 
            currentSample.confidenceScore >= 60 ? 'good' : 'developing'} consistency. 
            This technology can now protect your users invisibly while stopping fraudsters.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Ready to add invisible security to your application?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-semibold">Start Free Trial</div>
                <div className="text-xs opacity-80">1,000 free authentications/month</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-semibold">View Documentation</div>
                <div className="text-xs opacity-80">Complete integration guide</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessBenefitsView;
