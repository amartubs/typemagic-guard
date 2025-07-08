import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OpenApiDocumentation = () => {
  const { toast } = useToast();
  const [selectedEndpoint, setSelectedEndpoint] = useState('train');

  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'TypeMagic Guard Biometric API',
      version: '1.0.0',
      description: 'Advanced biometric authentication API with multi-modal support',
      contact: {
        name: 'TypeMagic Guard Support',
        email: 'support@typemagicguard.com'
      }
    },
    servers: [
      {
        url: 'https://wybjhqehohapazufkjfb.supabase.co/functions/v1',
        description: 'Production server'
      }
    ],
    paths: {
      '/biometric-api': {
        post: {
          summary: 'Biometric authentication operations',
          description: 'Perform biometric training, verification, and profile management',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BiometricRequest'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/StandardResponse'
                  }
                }
              }
            },
            '400': {
              description: 'Bad request'
            },
            '429': {
              description: 'Rate limit exceeded'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      },
      '/biometric-api/health': {
        get: {
          summary: 'Health check',
          description: 'Check API health status',
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthResponse'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        BiometricRequest: {
          type: 'object',
          required: ['action'],
          properties: {
            action: {
              type: 'string',
              enum: ['train', 'verify', 'getProfile', 'multimodal-verify', 'device-trust', 'health']
            },
            email: {
              type: 'string',
              format: 'email'
            },
            keystrokeData: {
              $ref: '#/components/schemas/KeystrokeData'
            },
            multiModalData: {
              $ref: '#/components/schemas/MultiModalData'
            },
            deviceData: {
              $ref: '#/components/schemas/DeviceData'
            }
          }
        },
        StandardResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            confidenceScore: {
              type: 'number',
              minimum: 0,
              maximum: 100
            },
            riskLevel: {
              type: 'string',
              enum: ['low', 'medium', 'high']
            },
            modalityScores: {
              type: 'object',
              properties: {
                keystroke: { type: 'number' },
                touch: { type: 'number' },
                mouse: { type: 'number' },
                behavioral: { type: 'number' }
              }
            },
            deviceTrust: {
              type: 'number',
              minimum: 0,
              maximum: 100
            },
            anomalies: {
              type: 'array',
              items: { type: 'string' }
            },
            recommendation: {
              type: 'string'
            },
            message: {
              type: 'string'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            processingTime: {
              type: 'number'
            }
          }
        },
        KeystrokeData: {
          type: 'object',
          properties: {
            timings: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/KeystrokeTiming'
              }
            },
            context: {
              type: 'string'
            }
          }
        },
        KeystrokeTiming: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            pressTime: { type: 'number' },
            releaseTime: { type: 'number' },
            duration: { type: 'number' }
          }
        },
        MultiModalData: {
          type: 'object',
          properties: {
            deviceFingerprint: { type: 'string' },
            touchPatterns: { type: 'array', items: { type: 'object' } },
            mousePatterns: { type: 'array', items: { type: 'object' } },
            behavioralPatterns: { type: 'array', items: { type: 'object' } },
            deviceCapabilities: {
              $ref: '#/components/schemas/DeviceCapabilities'
            }
          }
        },
        DeviceCapabilities: {
          type: 'object',
          properties: {
            deviceType: {
              type: 'string',
              enum: ['desktop', 'mobile', 'tablet']
            },
            hasKeyboard: { type: 'boolean' },
            hasMouse: { type: 'boolean' },
            hasTouch: { type: 'boolean' },
            hasTrackpad: { type: 'boolean' }
          }
        },
        DeviceData: {
          type: 'object',
          properties: {
            fingerprint: { type: 'string' },
            ipAddress: { type: 'string' },
            userAgent: { type: 'string' },
            location: { type: 'string' }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            version: { type: 'string' },
            services: { type: 'object' },
            uptime: { type: 'number' },
            memory: { type: 'object' }
          }
        }
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const downloadSpec = () => {
    const blob = new Blob([JSON.stringify(openApiSpec, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typemagic-guard-api-spec.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const endpoints = [
    {
      id: 'train',
      name: 'Train Biometric',
      method: 'POST',
      path: '/biometric-api',
      description: 'Store keystroke patterns for user training',
      example: {
        action: 'train',
        email: 'user@example.com',
        keystrokeData: {
          timings: [
            {
              key: 'h',
              pressTime: 1234567890,
              releaseTime: 1234567950,
              duration: 60
            }
          ],
          context: 'training'
        }
      }
    },
    {
      id: 'verify',
      name: 'Verify Biometric',
      method: 'POST',
      path: '/biometric-api',
      description: 'Verify user identity using keystroke patterns',
      example: {
        action: 'verify',
        email: 'user@example.com',
        keystrokeData: {
          timings: [
            {
              key: 'h',
              pressTime: 1234567890,
              releaseTime: 1234567950,
              duration: 60
            }
          ],
          context: 'login'
        }
      }
    },
    {
      id: 'multimodal',
      name: 'Multi-Modal Verify',
      method: 'POST',
      path: '/biometric-api',
      description: 'Verify using multiple biometric modalities',
      example: {
        action: 'multimodal-verify',
        email: 'user@example.com',
        multiModalData: {
          deviceFingerprint: 'device-123',
          touchPatterns: [],
          mousePatterns: [],
          deviceCapabilities: {
            deviceType: 'desktop',
            hasKeyboard: true,
            hasMouse: true,
            hasTouch: false,
            hasTrackpad: false
          }
        }
      }
    },
    {
      id: 'health',
      name: 'Health Check',
      method: 'GET',
      path: '/biometric-api/health',
      description: 'Check API health and status',
      example: null
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">API Documentation</h2>
          <p className="text-muted-foreground">
            OpenAPI 3.0 specification for TypeMagic Guard Biometric API
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadSpec} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Spec
          </Button>
          <Button 
            onClick={() => copyToClipboard(JSON.stringify(openApiSpec, null, 2))}
            variant="outline"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Spec
          </Button>
        </div>
      </div>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="swagger">Swagger UI</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="grid gap-4">
            {endpoints.map((endpoint) => (
              <Card key={endpoint.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {endpoint.method}
                      </Badge>
                      {endpoint.name}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                    >
                      View Details
                    </Button>
                  </div>
                  <CardDescription>
                    <code className="text-sm">{endpoint.path}</code>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {endpoint.description}
                  </p>
                  {endpoint.example && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Example Request</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(endpoint.example, null, 2))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(endpoint.example, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schemas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Schemas</CardTitle>
              <CardDescription>
                OpenAPI schema definitions for request and response objects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(openApiSpec.components.schemas).map(([name, schema]) => (
                  <div key={name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{name}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(schema, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
              <CardDescription>
                Code examples for integrating with the TypeMagic Guard API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript">
                  <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
{`// JavaScript/TypeScript integration
const trainBiometric = async (email, keystrokeData) => {
  const response = await fetch('https://your-project.supabase.co/functions/v1/biometric-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      action: 'train',
      email,
      keystrokeData
    })
  });
  
  return await response.json();
};

// Verify biometric
const verifyBiometric = async (email, keystrokeData) => {
  const response = await fetch('https://your-project.supabase.co/functions/v1/biometric-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      action: 'verify',
      email,
      keystrokeData
    })
  });
  
  return await response.json();
};`}
                  </pre>
                </TabsContent>

                <TabsContent value="python">
                  <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
{`# Python integration
import requests
import json

def train_biometric(email, keystroke_data):
    url = "https://your-project.supabase.co/functions/v1/biometric-api"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    }
    data = {
        "action": "train",
        "email": email,
        "keystrokeData": keystroke_data
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

def verify_biometric(email, keystroke_data):
    url = "https://your-project.supabase.co/functions/v1/biometric-api"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    }
    data = {
        "action": "verify",
        "email": email,
        "keystrokeData": keystroke_data
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()`}
                  </pre>
                </TabsContent>

                <TabsContent value="curl">
                  <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
{`# cURL examples

# Train biometric
curl -X POST https://your-project.supabase.co/functions/v1/biometric-api \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "action": "train",
    "email": "user@example.com",
    "keystrokeData": {
      "timings": [{
        "key": "h",
        "pressTime": 1234567890,
        "releaseTime": 1234567950,
        "duration": 60
      }],
      "context": "training"
    }
  }'

# Verify biometric
curl -X POST https://your-project.supabase.co/functions/v1/biometric-api \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "action": "verify",
    "email": "user@example.com",
    "keystrokeData": {
      "timings": [{
        "key": "h",
        "pressTime": 1234567890,
        "releaseTime": 1234567950,
        "duration": 60
      }],
      "context": "login"
    }
  }'

# Health check
curl -X GET https://your-project.supabase.co/functions/v1/biometric-api/health`}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swagger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Swagger UI Integration</CardTitle>
              <CardDescription>
                Interactive API documentation using Swagger UI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To use this OpenAPI specification with Swagger UI, you can:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Download the OpenAPI specification using the button above</li>
                  <li>Go to <a href="https://editor.swagger.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">Swagger Editor <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                  <li>Paste the specification into the editor</li>
                  <li>Use the interactive documentation to test the API</li>
                </ol>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Base URL for Testing:</h4>
                  <code className="text-sm">https://wybjhqehohapazufkjfb.supabase.co/functions/v1</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpenApiDocumentation;