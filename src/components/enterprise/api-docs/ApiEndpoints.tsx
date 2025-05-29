
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Database, Shield, BarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { codeExamples } from './codeExamples';

const ApiEndpoints = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('auth');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code example copied to clipboard",
    });
  };

  const endpoints = [
    {
      id: 'auth',
      title: 'Biometric Authentication',
      icon: Shield,
      description: 'Integrate keystroke biometric authentication',
      methods: ['POST', 'GET']
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Database,
      description: 'Manage user accounts programmatically',
      methods: ['GET', 'PUT']
    },
    {
      id: 'analytics',
      title: 'Analytics & Reporting',
      icon: BarChart,
      description: 'Access authentication and usage analytics',
      methods: ['GET']
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: Shield,
      description: 'Configure security parameters',
      methods: ['GET', 'PUT']
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="space-y-2">
        {endpoints.map((endpoint) => {
          const Icon = endpoint.icon;
          return (
            <Card 
              key={endpoint.id}
              className={`cursor-pointer transition-colors ${
                selectedEndpoint === endpoint.id ? 'bg-primary/5 border-primary' : ''
              }`}
              onClick={() => setSelectedEndpoint(endpoint.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{endpoint.title}</h3>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    <div className="flex space-x-1 mt-2">
                      {endpoint.methods.map((method) => (
                        <Badge key={method} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-xl">
              {endpoints.find(e => e.id === selectedEndpoint)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              <p>
                Base URL: <code className="bg-muted px-1 rounded text-sm">
                  https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/
                </code>
              </p>

              <div className="space-y-4">
                <h3 className="font-medium">Authentication</h3>
                <p className="text-sm">
                  All API requests require an API Key to be included in the <code className="bg-muted px-1 rounded text-xs">x-api-key</code> header.
                  Your API key can be generated in the API Key Manager. Keep your API key secure and do not share it publicly.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Code Examples</h3>
                
                <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="javascript" className="mt-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{codeExamples[selectedEndpoint as keyof typeof codeExamples].javascript}</code>
                      </pre>
                      <Button 
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(codeExamples[selectedEndpoint as keyof typeof codeExamples].javascript)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="curl" className="mt-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{codeExamples[selectedEndpoint as keyof typeof codeExamples].curl}</code>
                      </pre>
                      <Button 
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(codeExamples[selectedEndpoint as keyof typeof codeExamples].curl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="python" className="mt-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{codeExamples[selectedEndpoint as keyof typeof codeExamples].python}</code>
                      </pre>
                      <Button 
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(codeExamples[selectedEndpoint as keyof typeof codeExamples].python)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiEndpoints;
