import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Code, Package, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface SdkConfig {
  language: string;
  packageName: string;
  version: string;
  features: string[];
  authentication: 'api_key' | 'oauth' | 'jwt';
  includeExamples: boolean;
  includeTests: boolean;
  includeDocumentation: boolean;
}

export const SdkGenerator: React.FC = () => {
  const [config, setConfig] = useState<SdkConfig>({
    language: '',
    packageName: '',
    version: '1.0.0',
    features: [],
    authentication: 'api_key',
    includeExamples: true,
    includeTests: false,
    includeDocumentation: true
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript/Node.js', ext: 'js' },
    { id: 'python', name: 'Python', ext: 'py' },
    { id: 'java', name: 'Java', ext: 'java' },
    { id: 'csharp', name: 'C#', ext: 'cs' },
    { id: 'php', name: 'PHP', ext: 'php' },
    { id: 'ruby', name: 'Ruby', ext: 'rb' },
    { id: 'go', name: 'Go', ext: 'go' },
    { id: 'rust', name: 'Rust', ext: 'rs' }
  ];

  const features = [
    'biometric_authentication',
    'keystroke_analysis',
    'behavioral_monitoring',
    'anomaly_detection',
    'user_management',
    'webhook_handling',
    'analytics_reporting',
    'real_time_monitoring'
  ];

  const codeTemplates = {
    javascript: `
class TypeMagicSDK {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.typemagic.dev/v1';
    this.timeout = options.timeout || 30000;
  }

  async verifyBiometric(userId, keystrokeData, context = 'login') {
    try {
      const response = await fetch(\`\${this.baseUrl}/biometric/verify\`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          keystroke_data: keystrokeData,
          context
        })
      });

      if (!response.ok) {
        throw new Error(\`API Error: \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(\`Biometric verification failed: \${error.message}\`);
    }
  }

  async enrollUser(userId, keystrokeData) {
    try {
      const response = await fetch(\`\${this.baseUrl}/biometric/enroll\`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          keystroke_data: keystrokeData
        })
      });

      return await response.json();
    } catch (error) {
      throw new Error(\`User enrollment failed: \${error.message}\`);
    }
  }

  async getUserAnalytics(userId, startDate, endDate) {
    const params = new URLSearchParams({
      user_id: userId,
      start_date: startDate,
      end_date: endDate
    });

    try {
      const response = await fetch(\`\${this.baseUrl}/analytics/user?\${params}\`, {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        }
      });

      return await response.json();
    } catch (error) {
      throw new Error(\`Analytics retrieval failed: \${error.message}\`);
    }
  }
}

module.exports = TypeMagicSDK;`,

    python: `
import requests
import json
from typing import Dict, Any, Optional

class TypeMagicSDK:
    def __init__(self, api_key: str, base_url: str = "https://api.typemagic.dev/v1", timeout: int = 30):
        self.api_key = api_key
        self.base_url = base_url
        self.timeout = timeout
        
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                json=data,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
    
    def verify_biometric(self, user_id: str, keystroke_data: Dict, context: str = "login") -> Dict[str, Any]:
        """Verify user identity using biometric data"""
        data = {
            'user_id': user_id,
            'keystroke_data': keystroke_data,
            'context': context
        }
        return self._make_request('POST', 'biometric/verify', data)
    
    def enroll_user(self, user_id: str, keystroke_data: Dict) -> Dict[str, Any]:
        """Enroll a new user with biometric data"""
        data = {
            'user_id': user_id,
            'keystroke_data': keystroke_data
        }
        return self._make_request('POST', 'biometric/enroll', data)
    
    def get_user_analytics(self, user_id: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get analytics data for a specific user"""
        endpoint = f"analytics/user?user_id={user_id}&start_date={start_date}&end_date={end_date}"
        return self._make_request('GET', endpoint)`,

    java: `
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

public class TypeMagicSDK {
    private final String apiKey;
    private final String baseUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public TypeMagicSDK(String apiKey) {
        this(apiKey, "https://api.typemagic.dev/v1");
    }
    
    public TypeMagicSDK(String apiKey, String baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public Map<String, Object> verifyBiometric(String userId, Map<String, Object> keystrokeData, String context) 
            throws Exception {
        Map<String, Object> requestBody = Map.of(
            "user_id", userId,
            "keystroke_data", keystrokeData,
            "context", context
        );
        
        return makeRequest("POST", "biometric/verify", requestBody);
    }
    
    public Map<String, Object> enrollUser(String userId, Map<String, Object> keystrokeData) throws Exception {
        Map<String, Object> requestBody = Map.of(
            "user_id", userId,
            "keystroke_data", keystrokeData
        );
        
        return makeRequest("POST", "biometric/enroll", requestBody);
    }
    
    private Map<String, Object> makeRequest(String method, String endpoint, Map<String, Object> body) 
            throws Exception {
        String url = baseUrl + "/" + endpoint;
        String jsonBody = objectMapper.writeValueAsString(body);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .method(method, HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
            
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() >= 400) {
            throw new Exception("API Error: " + response.statusCode());
        }
        
        return objectMapper.readValue(response.body(), Map.class);
    }
}`
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const generateSdk = async () => {
    if (!config.language || !config.packageName) {
      toast.error('Please select language and package name');
      return;
    }

    setIsGenerating(true);
    
    // Simulate SDK generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = codeTemplates[config.language as keyof typeof codeTemplates];
    if (template) {
      setGeneratedCode(template);
      toast.success('SDK generated successfully');
    } else {
      setGeneratedCode(`// ${config.language} SDK generation coming soon!
// Package: ${config.packageName}
// Version: ${config.version}
// Features: ${config.features.join(', ')}

// This SDK will include:
// - Type-safe API client
// - Comprehensive error handling
// - Built-in retry logic
// - Request/response logging
// - Webhook signature verification
${config.includeExamples ? '// - Usage examples' : ''}
${config.includeTests ? '// - Unit tests' : ''}
${config.includeDocumentation ? '// - API documentation' : ''}`);
      toast.success('SDK configuration generated');
    }
    
    setIsGenerating(false);
  };

  const downloadSdk = () => {
    if (!generatedCode) return;
    
    const language = languages.find(l => l.id === config.language);
    const filename = `typemagic-sdk.${language?.ext || 'txt'}`;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('SDK downloaded successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">SDK Generator</h2>
      </div>

      <Tabs defaultValue="configure" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configuration</TabsTrigger>
          <TabsTrigger value="generate">Generate SDK</TabsTrigger>
          <TabsTrigger value="download">Download & Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
                <CardDescription>Configure your SDK package details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Programming Language</Label>
                  <Select value={config.language} onValueChange={(value) => setConfig(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-name">Package Name</Label>
                  <Input
                    id="package-name"
                    placeholder="typemagic-client"
                    value={config.packageName}
                    onChange={(e) => setConfig(prev => ({ ...prev, packageName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    placeholder="1.0.0"
                    value={config.version}
                    onChange={(e) => setConfig(prev => ({ ...prev, version: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Authentication Method</Label>
                  <Select value={config.authentication} onValueChange={(value: any) => setConfig(prev => ({ ...prev, authentication: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="oauth">OAuth 2.0</SelectItem>
                      <SelectItem value="jwt">JWT Token</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features & Options</CardTitle>
                <CardDescription>Select features to include in your SDK</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>API Features</Label>
                  {features.map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={config.features.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label>Additional Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="examples"
                      checked={config.includeExamples}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeExamples: checked as boolean }))}
                    />
                    <Label htmlFor="examples" className="text-sm">Include Examples</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tests"
                      checked={config.includeTests}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeTests: checked as boolean }))}
                    />
                    <Label htmlFor="tests" className="text-sm">Include Unit Tests</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="docs"
                      checked={config.includeDocumentation}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeDocumentation: checked as boolean }))}
                    />
                    <Label htmlFor="docs" className="text-sm">Include Documentation</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate SDK</CardTitle>
              <CardDescription>Generate your custom TypeMagic SDK based on your configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Configuration Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Language:</span> {config.language || 'Not selected'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Package:</span> {config.packageName || 'Not set'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Version:</span> {config.version}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auth:</span> {config.authentication}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.features.map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={generateSdk} 
                disabled={isGenerating || !config.language || !config.packageName}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Settings className="h-4 w-4 mr-2 animate-spin" />
                    Generating SDK...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    Generate SDK
                  </>
                )}
              </Button>

              {generatedCode && (
                <div className="mt-4">
                  <Label>Generated SDK Code</Label>
                  <Textarea
                    value={generatedCode}
                    readOnly
                    rows={20}
                    className="font-mono text-sm mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download SDK</CardTitle>
              <CardDescription>Download your generated SDK and access documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedCode ? (
                <>
                  <Button onClick={downloadSdk} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download SDK Package
                  </Button>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Installation Instructions</h4>
                    <div className="space-y-2 text-sm">
                      {config.language === 'javascript' && (
                        <div className="font-mono bg-background p-2 rounded">
                          npm install {config.packageName}
                        </div>
                      )}
                      {config.language === 'python' && (
                        <div className="font-mono bg-background p-2 rounded">
                          pip install {config.packageName}
                        </div>
                      )}
                      {config.language === 'java' && (
                        <div className="font-mono bg-background p-2 rounded">
                          mvn install {config.packageName}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Generate an SDK first to download it
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};