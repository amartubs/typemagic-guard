
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Globe, Smartphone, Building, CreditCard, GraduationCap } from 'lucide-react';

const IntegrationExamples = () => {
  const [selectedExample, setSelectedExample] = useState('ecommerce');

  const examples = [
    {
      id: 'ecommerce',
      title: 'E-commerce Login',
      icon: <CreditCard className="h-5 w-5" />,
      industry: 'Retail',
      description: 'Secure customer accounts and prevent payment fraud',
      mockup: (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Welcome Back</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="w-full h-10 bg-gray-100 border rounded px-3 flex items-center text-gray-500">
                user@example.com
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="w-full h-10 bg-gray-100 border rounded px-3 flex items-center text-gray-500">
                ••••••••••
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Biometric verification active</span>
              </div>
            </div>
            <Button className="w-full">Sign In</Button>
          </div>
        </div>
      ),
      benefits: ['Prevent account takeovers', 'Reduce fraud chargebacks', 'Seamless user experience']
    },
    {
      id: 'banking',
      title: 'Banking Portal',
      icon: <Building className="h-5 w-5" />,
      industry: 'Financial',
      description: 'Enterprise-grade security for financial institutions',
      mockup: (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">B</div>
            <h3 className="text-lg font-semibold">SecureBank Login</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer ID</label>
              <div className="w-full h-10 bg-gray-100 border rounded px-3 flex items-center text-gray-500">
                12345678
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="w-full h-10 bg-gray-100 border rounded px-3 flex items-center text-gray-500">
                ••••••••••
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700">Enhanced security: Typing pattern verified</span>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Access Account</Button>
          </div>
        </div>
      ),
      benefits: ['Meet compliance requirements', 'Stop insider threats', 'Continuous monitoring']
    },
    {
      id: 'education',
      title: 'Learning Platform',
      icon: <GraduationCap className="h-5 w-5" />,
      industry: 'Education',
      description: 'Prevent cheating and ensure identity verification for online exams',
      mockup: (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Exam Portal Access</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <div className="w-full h-10 bg-gray-100 border rounded px-3 flex items-center text-gray-500">
                STU2024001
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="w-full h-10 bg-gray-100 border rounded px-3 flex items-center text-gray-500">
                ••••••••••
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <div className="text-sm text-amber-700">
                <strong>Identity Verification:</strong> Your typing pattern is being verified for exam integrity
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">Start Exam</Button>
          </div>
        </div>
      ),
      benefits: ['Prevent exam fraud', 'Continuous identity verification', 'Academic integrity']
    }
  ];

  const codeExample = `// Simple integration example
import { Shoale } from '@shoale/auth-sdk';

// Initialize on login form
const shoale = new Shoale({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Enable keystroke capture
shoale.capture('login-form', {
  onAuthenticated: (result) => {
    if (result.confidence > 0.75) {
      // High confidence - proceed with login
      window.location.href = '/dashboard';
    } else {
      // Lower confidence - additional verification
      showTwoFactorAuth();
    }
  }
});`;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real-World Integration Examples</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how businesses across industries integrate Shoale to protect their users 
            without changing the login experience.
          </p>
        </div>

        <Tabs value={selectedExample} onValueChange={setSelectedExample} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            {examples.map((example) => (
              <TabsTrigger key={example.id} value={example.id} className="flex items-center gap-2">
                {example.icon}
                <span className="hidden sm:inline">{example.industry}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {examples.map((example) => (
            <TabsContent key={example.id} value={example.id}>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Badge variant="outline" className="mb-2">{example.industry} Industry</Badge>
                    <h3 className="text-2xl font-bold mb-2">{example.title}</h3>
                    <p className="text-muted-foreground">{example.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {example.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Integration Code
                      </CardTitle>
                      <CardDescription>Simple SDK integration example</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        <code>{codeExample}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">User Experience Preview:</h4>
                  {example.mockup}
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    <strong>Note:</strong> Users see a normal login form. The biometric analysis 
                    happens invisibly in the background - no extra steps required.
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default IntegrationExamples;
