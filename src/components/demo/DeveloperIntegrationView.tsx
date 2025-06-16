
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { KeyTiming } from '@/lib/types';

interface DeveloperIntegrationViewProps {
  confidenceScore: number;
  keystrokes: KeyTiming[];
}

const DeveloperIntegrationView: React.FC<DeveloperIntegrationViewProps> = ({
  confidenceScore,
  keystrokes
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Integration Code
          </CardTitle>
          <CardDescription>Add this to your login form to enable biometric protection</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            <code>{`// Install the SDK
npm install @shoale/auth-sdk

// Initialize in your app
import { Shoale } from '@shoale/auth-sdk';

const shoale = new Shoale({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Enable on login form
shoale.capture('password-field', {
  onResult: (result) => {
    if (result.confidence > 0.75) {
      // High confidence - proceed normally
      submitLogin();
    } else {
      // Low confidence - trigger 2FA
      showTwoFactorAuth();
    }
  }
});`}</code>
          </pre>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Real-time Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {confidenceScore}%
            </div>
            <p className="text-xs text-muted-foreground">Based on typing patterns</p>
            <div className="mt-2 h-1 bg-muted rounded">
              <div 
                className="h-1 bg-green-500 rounded transition-all duration-500"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">API Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {keystrokes.length > 0 ? Math.round(Math.random() * 20) + 15 : 23}ms
            </div>
            <p className="text-xs text-muted-foreground">Real-time analysis</p>
            <div className="mt-2 h-1 bg-muted rounded">
              <div 
                className="h-1 bg-blue-500 rounded transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperIntegrationView;
