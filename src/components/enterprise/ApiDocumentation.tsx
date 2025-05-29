import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Code, Database, Shield, BarChart, Book, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ApiDocumentation = () => {
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

  const integrationGuides = [
    {
      id: 'quickstart',
      title: 'Quick Start Guide',
      description: 'Get started with TypeMagic Guard in 5 minutes',
      steps: [
        'Generate your API key',
        'Install the SDK or set up HTTP calls',
        'Initialize the biometric authentication',
        'Handle authentication responses',
        'Test your integration'
      ]
    },
    {
      id: 'web-app',
      title: 'Web Application Integration',
      description: 'Complete guide for integrating into web applications',
      steps: [
        'Add TypeMagic Guard JavaScript SDK',
        'Initialize keystroke capture',
        'Implement authentication flow',
        'Handle success and failure states',
        'Customize security settings'
      ]
    },
    {
      id: 'mobile-app',
      title: 'Mobile Application Integration',
      description: 'Guide for React Native and mobile web apps',
      steps: [
        'Install mobile-compatible SDK',
        'Set up touch and keyboard event capture',
        'Configure biometric thresholds',
        'Implement offline fallback',
        'Test across devices'
      ]
    },
    {
      id: 'backend',
      title: 'Backend API Integration',
      description: 'Server-to-server authentication validation',
      steps: [
        'Set up server-side API calls',
        'Implement webhook endpoints',
        'Configure user management',
        'Set up analytics reporting',
        'Implement security policies'
      ]
    }
  ];

  const sdkLanguages = [
    {
      name: 'JavaScript/TypeScript',
      version: '2.1.0',
      install: 'npm install @typemagic/guard-sdk',
      docs: 'https://docs.typemagic.com/sdk/javascript'
    },
    {
      name: 'Python',
      version: '1.8.0', 
      install: 'pip install typemagic-guard',
      docs: 'https://docs.typemagic.com/sdk/python'
    },
    {
      name: 'PHP',
      version: '1.5.0',
      install: 'composer require typemagic/guard-sdk',
      docs: 'https://docs.typemagic.com/sdk/php'
    },
    {
      name: 'Java',
      version: '1.6.0',
      install: 'implementation "com.typemagic:guard-sdk:1.6.0"',
      docs: 'https://docs.typemagic.com/sdk/java'
    },
    {
      name: 'C#/.NET',
      version: '1.4.0',
      install: 'Install-Package TypeMagic.Guard.SDK',
      docs: 'https://docs.typemagic.com/sdk/dotnet'
    },
    {
      name: 'Ruby',
      version: '1.3.0',
      install: 'gem install typemagic-guard',
      docs: 'https://docs.typemagic.com/sdk/ruby'
    }
  ];

  const bestPractices = [
    {
      category: 'Security',
      practices: [
        'Store API keys securely using environment variables',
        'Implement proper error handling for authentication failures',
        'Use HTTPS for all API communications',
        'Rotate API keys regularly',
        'Monitor authentication patterns for anomalies'
      ]
    },
    {
      category: 'Performance',
      practices: [
        'Cache biometric profiles when possible',
        'Implement request batching for bulk operations',
        'Use webhooks instead of polling for real-time updates',
        'Set appropriate timeout values for API calls',
        'Implement retry logic with exponential backoff'
      ]
    },
    {
      category: 'User Experience',
      practices: [
        'Provide clear feedback during authentication',
        'Implement graceful fallbacks for authentication failures',
        'Allow users to retrain their biometric profile',
        'Show confidence scores to help users improve',
        'Provide accessibility options for users with disabilities'
      ]
    }
  ];

  const codeExamples = {
    auth: {
      javascript: `// TypeMagic Guard JavaScript SDK Example
import { TypeMagicGuard } from '@typemagic/guard-sdk';

// Initialize the SDK
const tmg = new TypeMagicGuard({
  apiKey: 'tmg_your_api_key_here',
  baseUrl: 'https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api'
});

// Start keystroke capture
tmg.startCapture('login-form');

// Authenticate user
async function authenticateUser(userId) {
  try {
    const result = await tmg.authenticate({
      userId: userId,
      context: 'login'
    });
    
    console.log('Authentication result:', {
      success: result.success,
      confidence: result.confidenceScore,
      riskLevel: result.riskLevel
    });
    
    if (result.success && result.confidenceScore > 75) {
      // Grant access
      window.location.href = '/dashboard';
    } else {
      // Request additional verification
      showTwoFactorPrompt();
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    handleAuthError(error);
  }
}

// Handle authentication errors
function handleAuthError(error) {
  if (error.code === 'INSUFFICIENT_DATA') {
    showMessage('Please type a few more characters to improve accuracy.');
  } else if (error.code === 'PATTERN_MISMATCH') {
    showMessage('Typing pattern not recognized. Please try again.');
  } else {
    showMessage('Authentication service temporarily unavailable.');
  }
}`,
      
      curl: `# Quick authentication test
curl -X POST \\
  https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/auth \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: tmg_your_api_key_here" \\
  -d '{
    "userId": "user-123",
    "keystrokeData": {
      "timings": [
        {"key": "p", "pressTime": 1000, "releaseTime": 1080, "duration": 80},
        {"key": "a", "pressTime": 1120, "releaseTime": 1190, "duration": 70},
        {"key": "s", "pressTime": 1220, "releaseTime": 1300, "duration": 80},
        {"key": "s", "pressTime": 1340, "releaseTime": 1410, "duration": 70}
      ],
      "metadata": {
        "inputField": "password",
        "sessionId": "sess_123",
        "userAgent": "Mozilla/5.0..."
      }
    },
    "context": "login"
  }'

# Expected response:
# {
#   "success": true,
#   "patternId": "pat_456",
#   "confidenceScore": 87,
#   "riskLevel": "low",
#   "recommendations": ["continue"]
# }`,
      
      python: `# TypeMagic Guard Python SDK Example
from typemagic_guard import TypeMagicGuard
import asyncio

# Initialize the client
tmg = TypeMagicGuard(
    api_key='tmg_your_api_key_here',
    base_url='https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api'
)

async def authenticate_user(user_id, keystroke_data):
    """Authenticate user with biometric data"""
    try:
        result = await tmg.authenticate(
            user_id=user_id,
            keystroke_data=keystroke_data,
            context='login'
        )
        
        print(f"Confidence Score: {result.confidence_score}%")
        print(f"Risk Level: {result.risk_level}")
        
        if result.success and result.confidence_score >= 75:
            print("✅ Authentication successful")
            return True
        else:
            print("❌ Authentication failed - additional verification required")
            return False
            
    except Exception as e:
        print(f"Authentication error: {e}")
        return False

# Example usage
async def main():
    keystroke_data = {
        "timings": [
            {"key": "p", "press_time": 1000, "release_time": 1080, "duration": 80},
            {"key": "a", "press_time": 1120, "release_time": 1190, "duration": 70}
        ],
        "metadata": {
            "input_field": "password",
            "session_id": "sess_123"
        }
    }
    
    success = await authenticate_user("user-123", keystroke_data)
    if success:
        print("User granted access to application")
    else:
        print("User requires additional verification")

if __name__ == "__main__":
    asyncio.run(main())`
    },
    users: {
      javascript: `// User Management SDK Example
const response = await tmg.users.get('user-123');
console.log('User data:', response.data);

// List users with pagination
const userList = await tmg.users.list({
  page: 1,
  limit: 50,
  filter: { status: 'active' }
});
console.log('Total users:', userList.pagination.total);`,
      
      curl: `# Get specific user
curl -X GET \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/users?userId=user-123" \\
  -H "x-api-key: tmg_your_api_key_here"`,
      
      python: `# Get user information
user = await tmg.users.get("user-123")
print(f"User: {user.name} ({user.email})")

# List users
users = await tmg.users.list(page=1, limit=50)
print(f"Total users: {users.pagination.total}")`
    },
    analytics: {
      javascript: `// Analytics SDK Example
const analytics = await tmg.analytics.getAuthenticationAttempts({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
console.log('Success rate:', analytics.successRate);`,
      
      curl: `# Get analytics
curl -X GET \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/analytics?type=authentication-attempts" \\
  -H "x-api-key: tmg_your_api_key_here"`,
      
      python: `# Get analytics
analytics = await tmg.analytics.get_authentication_attempts(
    start_date="2024-01-01"
)
print(f"Success rate: {analytics.success_rate}%")`
    },
    security: {
      javascript: `// Security Settings SDK Example
const settings = await tmg.security.getSettings('user-123');
console.log('Security level:', settings.securityLevel);

// Update settings
await tmg.security.updateSettings('user-123', {
  minConfidenceThreshold: 80,
  securityLevel: 'high'
});`,
      
      curl: `# Update security settings
curl -X PUT \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/security?userId=user-123" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: tmg_your_api_key_here" \\
  -d '{"min_confidence_threshold": 80}'`,
      
      python: `# Update security settings
await tmg.security.update_settings("user-123", {
    "min_confidence_threshold": 80,
    "security_level": "high"
})`
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">API Documentation & Integration Guides</h2>
        <p className="text-muted-foreground mt-2">
          Complete documentation, SDKs, and integration guides for TypeMagic Guard
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="endpoints">API Reference</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
          <TabsTrigger value="guides">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="quickstart" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrationGuides.map((guide) => (
              <Card key={guide.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Button variant="outline" size="sm" className="mt-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Official SDKs
              </CardTitle>
              <CardDescription>
                Native libraries for popular programming languages and frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sdkLanguages.map((sdk) => (
                  <Card key={sdk.name} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{sdk.name}</h3>
                      <Badge variant="secondary">v{sdk.version}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Installation:</label>
                        <div className="bg-muted p-2 rounded text-sm font-mono mt-1">
                          {sdk.install}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium mb-2">Community SDKs</h4>
                <p className="text-sm text-muted-foreground">
                  Can't find an SDK for your language? Check out our community-maintained libraries or 
                  contribute your own. We also provide OpenAPI specifications for generating custom clients.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Community SDKs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="space-y-6">
            {bestPractices.map((section) => (
              <Card key={section.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {section.category} Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.practices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{practice}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Guide</CardTitle>
              <CardDescription>
                Common issues and their solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-medium">Low Confidence Scores</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Users experiencing low confidence scores may need more training data. 
                    Ensure they complete the initial training period and consider adjusting 
                    sensitivity settings for their specific use case.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium">Authentication Failures</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check API key permissions, ensure proper error handling, and verify 
                    that keystroke data is being captured correctly. Review our debugging 
                    guide for detailed troubleshooting steps.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Integration Issues</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    For integration problems, check CORS settings, verify SSL/TLS 
                    configuration, and ensure your application meets minimum browser 
                    requirements for keystroke capture.
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="mt-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Troubleshooting Guide
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocumentation;
