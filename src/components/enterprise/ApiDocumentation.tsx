
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Code, Database, Shield, BarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ApiDocumentation = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('auth');

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

  const codeExamples = {
    auth: {
      javascript: `// Store biometric authentication data
const response = await fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'tmg_your_api_key_here'
  },
  body: JSON.stringify({
    userId: 'user-123',
    keystrokeData: {
      timings: [
        { key: 'a', pressTime: 1000, releaseTime: 1100, duration: 100 },
        { key: 'b', pressTime: 1150, releaseTime: 1220, duration: 70 }
      ]
    },
    context: 'login'
  })
});

const result = await response.json();
console.log('Confidence score:', result.confidenceScore);`,
      
      curl: `curl -X POST \\
  https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/auth \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: tmg_your_api_key_here" \\
  -d '{
    "userId": "user-123",
    "keystrokeData": {
      "timings": [
        {"key": "a", "pressTime": 1000, "releaseTime": 1100, "duration": 100}
      ]
    },
    "context": "login"
  }'`,
      
      python: `import requests

url = "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/auth"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "tmg_your_api_key_here"
}
data = {
    "userId": "user-123",
    "keystrokeData": {
        "timings": [
            {"key": "a", "pressTime": 1000, "releaseTime": 1100, "duration": 100}
        ]
    },
    "context": "login"
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
print(f"Confidence score: {result['confidenceScore']}")`
    },
    users: {
      javascript: `// Get user information
const response = await fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/users?userId=user-123', {
  method: 'GET',
  headers: {
    'x-api-key': 'tmg_your_api_key_here'
  }
});

const user = await response.json();
console.log('User data:', user);

// List users with pagination
const listResponse = await fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/users?page=1&limit=50', {
  method: 'GET',
  headers: {
    'x-api-key': 'tmg_your_api_key_here'
  }
});

const userList = await listResponse.json();
console.log('Users:', userList.users);
console.log('Total:', userList.pagination.total);`,
      
      curl: `# Get specific user
curl -X GET \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/users?userId=user-123" \\
  -H "x-api-key: tmg_your_api_key_here"

# List users
curl -X GET \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/users?page=1&limit=50" \\
  -H "x-api-key: tmg_your_api_key_here"`,
      
      python: `import requests

# Get specific user
url = "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/users"
headers = {"x-api-key": "tmg_your_api_key_here"}
params = {"userId": "user-123"}

response = requests.get(url, headers=headers, params=params)
user = response.json()
print(f"User: {user['name']}")

# List users
params = {"page": 1, "limit": 50}
response = requests.get(url, headers=headers, params=params)
data = response.json()
print(f"Total users: {data['pagination']['total']}")`
    },
    analytics: {
      javascript: `// Get authentication analytics
const response = await fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/analytics?type=authentication-attempts&startDate=2024-01-01', {
  method: 'GET',
  headers: {
    'x-api-key': 'tmg_your_api_key_here'
  }
});

const analytics = await response.json();
console.log('Success rate:', (analytics.successfulAttempts / analytics.totalAttempts * 100).toFixed(2) + '%');
console.log('Average confidence:', analytics.averageConfidence);

// Get user activity analytics
const userResponse = await fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/analytics?type=user-activity', {
  method: 'GET',
  headers: {
    'x-api-key': 'tmg_your_api_key_here'
  }
});

const userAnalytics = await userResponse.json();
console.log('Active users:', userAnalytics.activeUsers);`,
      
      curl: `# Authentication analytics
curl -X GET \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/analytics?type=authentication-attempts&startDate=2024-01-01" \\
  -H "x-api-key: tmg_your_api_key_here"

# User activity analytics  
curl -X GET \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/analytics?type=user-activity" \\
  -H "x-api-key: tmg_your_api_key_here"`,
      
      python: `import requests
from datetime import datetime, timedelta

headers = {"x-api-key": "tmg_your_api_key_here"}
base_url = "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/analytics"

# Authentication analytics
start_date = (datetime.now() - timedelta(days=30)).isoformat()
params = {"type": "authentication-attempts", "startDate": start_date}
response = requests.get(base_url, headers=headers, params=params)
data = response.json()

success_rate = (data['successfulAttempts'] / data['totalAttempts']) * 100
print(f"Success rate: {success_rate:.2f}%")

# User activity
params = {"type": "user-activity"}
response = requests.get(base_url, headers=headers, params=params)
user_data = response.json()
print(f"Active users: {user_data['activeUsers']}")`
    },
    security: {
      javascript: `// Get security settings
const response = await fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/security?userId=user-123', {
  method: 'GET',
  headers: {
    'x-api-key': 'tmg_your_api_key_here'
  }
});

const settings = await response.json();
console.log('Security level:', settings.security_level);
console.log('Confidence threshold:', settings.min_confidence_threshold);

// Update security settings
const updateResponse = await fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/security?userId=user-123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'tmg_your_api_key_here'
  },
  body: JSON.stringify({
    min_confidence_threshold: 75,
    security_level: 'high',
    max_failed_attempts: 3
  })
});

const updated = await updateResponse.json();
console.log('Updated settings:', updated);`,
      
      curl: `# Get security settings
curl -X GET \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/security?userId=user-123" \\
  -H "x-api-key: tmg_your_api_key_here"

# Update security settings
curl -X PUT \\
  "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/security?userId=user-123" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: tmg_your_api_key_here" \\
  -d '{
    "min_confidence_threshold": 75,
    "security_level": "high",
    "max_failed_attempts": 3
  }'`,
      
      python: `import requests

headers = {"x-api-key": "tmg_your_api_key_here"}
base_url = "https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/security"
params = {"userId": "user-123"}

# Get security settings
response = requests.get(base_url, headers=headers, params=params)
settings = response.json()
print(f"Security level: {settings['security_level']}")

# Update security settings
headers["Content-Type"] = "application/json"
data = {
    "min_confidence_threshold": 75,
    "security_level": "high", 
    "max_failed_attempts": 3
}

response = requests.put(base_url, headers=headers, params=params, json=data)
updated = response.json()
print("Settings updated successfully")`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API Documentation</h2>
        <p className="text-muted-foreground">
          Comprehensive guide for integrating TypeMagic Guard APIs
        </p>
      </div>

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
                  
                  <Tabs defaultValue="javascript">
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

                <Button variant="outline" className="flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Download SDK Package</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
