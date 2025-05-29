
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';

const ApiOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Getting Started with TypeMagic Guard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          TypeMagic Guard provides enterprise-grade biometric authentication through keystroke dynamics. 
          Our APIs allow you to seamlessly integrate behavioral biometric security into your applications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">🚀 Quick Integration</h3>
            <p className="text-sm text-muted-foreground">
              Get started in minutes with our SDKs and comprehensive documentation
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">🔒 Enterprise Security</h3>
            <p className="text-sm text-muted-foreground">
              Bank-grade security with configurable confidence thresholds and risk assessment
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">📊 Rich Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Detailed insights into authentication patterns and security metrics
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">🛠️ Developer Friendly</h3>
            <p className="text-sm text-muted-foreground">
              RESTful APIs, webhook support, and SDKs for popular programming languages
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiOverview;
