
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const FrameworkExamples = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const frameworkExamples = {
    react: {
      title: 'React Integration',
      description: 'Hook-based integration with React components',
      installation: 'npm install @typemagic/guard-react',
      examples: [
        {
          title: 'Basic Hook Usage',
          code: `import { useTypeMagicAuth } from '@typemagic/guard-react';

function LoginForm() {
  const { startCapture, authenticate, isCapturing } = useTypeMagicAuth({
    apiKey: 'tmg_your_api_key_here',
    onAuthSuccess: (result) => {
      console.log('Auth successful:', result);
      // Redirect user or update state
    },
    onAuthFailure: (error) => {
      console.error('Auth failed:', error);
      // Show error message
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await authenticate({
      userId: 'user123',
      context: 'login'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Username"
        onFocus={() => startCapture('username')}
      />
      <input 
        type="password" 
        placeholder="Password"
        onFocus={() => startCapture('password')}
      />
      <button type="submit" disabled={isCapturing}>
        {isCapturing ? 'Analyzing...' : 'Login'}
      </button>
    </form>
  );
}`
        },
        {
          title: 'Provider Setup',
          code: `import { TypeMagicProvider } from '@typemagic/guard-react';

function App() {
  return (
    <TypeMagicProvider
      apiKey="tmg_your_api_key_here"
      config={{
        autoCapture: true,
        confidenceThreshold: 75,
        retryAttempts: 3
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </TypeMagicProvider>
  );
}`
        }
      ]
    },
    vue: {
      title: 'Vue.js Integration',
      description: 'Composition API and directive support',
      installation: 'npm install @typemagic/guard-vue',
      examples: [
        {
          title: 'Composition API',
          code: `<template>
  <form @submit.prevent="handleLogin">
    <input 
      v-model="username"
      v-typemagic-capture="'username'"
      placeholder="Username"
    />
    <input 
      v-model="password"
      v-typemagic-capture="'password'"
      type="password"
      placeholder="Password"
    />
    <button type="submit" :disabled="isAuthenticating">
      {{ isAuthenticating ? 'Analyzing...' : 'Login' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useTypeMagic } from '@typemagic/guard-vue';

const username = ref('');
const password = ref('');

const { authenticate, isAuthenticating } = useTypeMagic({
  apiKey: 'tmg_your_api_key_here',
  onSuccess: (result) => {
    router.push('/dashboard');
  },
  onError: (error) => {
    console.error('Authentication failed:', error);
  }
});

const handleLogin = async () => {
  await authenticate({
    userId: username.value,
    context: 'login'
  });
};
</script>`
        }
      ]
    },
    angular: {
      title: 'Angular Integration',
      description: 'Service and directive integration',
      installation: 'npm install @typemagic/guard-angular',
      examples: [
        {
          title: 'Service Integration',
          code: `import { Injectable } from '@angular/core';
import { TypeMagicService } from '@typemagic/guard-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private typeMagic: TypeMagicService) {
    this.typeMagic.configure({
      apiKey: 'tmg_your_api_key_here',
      baseUrl: 'https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api'
    });
  }

  async authenticateUser(userId: string): Promise<any> {
    try {
      const result = await this.typeMagic.authenticate({
        userId,
        context: 'login'
      });
      
      if (result.success) {
        // Set user session
        this.setUserSession(result);
        return result;
      }
      
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }
  
  private setUserSession(authResult: any) {
    localStorage.setItem('authToken', authResult.token);
    localStorage.setItem('confidenceScore', authResult.confidenceScore);
  }
}`
        },
        {
          title: 'Component Usage',
          code: `import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: \`
    <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
      <input 
        type="text" 
        [(ngModel)]="username"
        tmgCapture="username"
        placeholder="Username"
        required
      />
      <input 
        type="password" 
        [(ngModel)]="password"
        tmgCapture="password"
        placeholder="Password"
        required
      />
      <button 
        type="submit" 
        [disabled]="isAuthenticating"
      >
        {{ isAuthenticating ? 'Analyzing...' : 'Login' }}
      </button>
    </form>
  \`
})
export class LoginComponent {
  username = '';
  password = '';
  isAuthenticating = false;

  constructor(private authService: AuthService) {}

  async onSubmit() {
    this.isAuthenticating = true;
    
    try {
      await this.authService.authenticateUser(this.username);
      // Navigate to dashboard
    } catch (error) {
      // Handle error
    } finally {
      this.isAuthenticating = false;
    }
  }
}`
        }
      ]
    }
  };

  const [selectedFramework, setSelectedFramework] = useState('react');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Framework-Specific Examples</h3>
        <p className="text-sm text-muted-foreground">
          Ready-to-use code examples for popular frontend frameworks
        </p>
      </div>

      <Tabs value={selectedFramework} onValueChange={setSelectedFramework}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="vue">Vue.js</TabsTrigger>
          <TabsTrigger value="angular">Angular</TabsTrigger>
        </TabsList>

        {Object.entries(frameworkExamples).map(([key, framework]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {framework.title}
                  <Badge variant="outline">
                    Official SDK
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {framework.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Installation:</h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                        {framework.installation}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(framework.installation)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {framework.examples.map((example, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{example.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{example.code}</code>
                            </pre>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(example.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Documentation
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Example Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FrameworkExamples;
