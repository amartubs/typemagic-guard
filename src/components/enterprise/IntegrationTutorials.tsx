
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Code, 
  CheckCircle, 
  Clock, 
  Users, 
  Smartphone, 
  Globe, 
  Server,
  ExternalLink,
  Copy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const IntegrationTutorials = () => {
  const [selectedTutorial, setSelectedTutorial] = useState('web-app');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const tutorials = [
    {
      id: 'web-app',
      title: 'Web Application Integration',
      description: 'Complete guide for React, Vue, Angular applications',
      icon: Globe,
      difficulty: 'Beginner',
      duration: '15 min',
      category: 'Frontend'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Integration',
      description: 'React Native and mobile web implementation',
      icon: Smartphone,
      difficulty: 'Intermediate',
      duration: '25 min',
      category: 'Mobile'
    },
    {
      id: 'backend-api',
      title: 'Backend API Integration',
      description: 'Server-side validation and user management',
      icon: Server,
      difficulty: 'Intermediate',
      duration: '20 min',
      category: 'Backend'
    },
    {
      id: 'enterprise',
      title: 'Enterprise SSO Integration',
      description: 'SAML and OAuth integration patterns',
      icon: Users,
      difficulty: 'Advanced',
      duration: '35 min',
      category: 'Enterprise'
    }
  ];

  const tutorialContent = {
    'web-app': {
      overview: 'Learn how to integrate TypeMagic Guard into your web application for seamless biometric authentication.',
      prerequisites: [
        'Basic knowledge of JavaScript/TypeScript',
        'Familiarity with REST APIs',
        'Active TypeMagic Guard account with API key'
      ],
      steps: [
        {
          title: 'Install the SDK',
          content: `Install the TypeMagic Guard JavaScript SDK using npm or yarn:`,
          code: `# Using npm
npm install @typemagic/guard-sdk

# Using yarn
yarn add @typemagic/guard-sdk

# Using CDN (for vanilla JS)
<script src="https://cdn.typemagic.com/guard-sdk/2.1.0/typemagic-guard.min.js"></script>`
        },
        {
          title: 'Initialize the SDK',
          content: `Initialize TypeMagic Guard with your API key and configuration:`,
          code: `import { TypeMagicGuard } from '@typemagic/guard-sdk';

const tmg = new TypeMagicGuard({
  apiKey: 'tmg_your_api_key_here',
  baseUrl: 'https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api',
  options: {
    autoCapture: true,
    minKeystrokesForAuth: 8,
    confidenceThreshold: 75
  }
});

// Initialize capture on page load
document.addEventListener('DOMContentLoaded', () => {
  tmg.initialize();
});`
        },
        {
          title: 'Set Up Keystroke Capture',
          content: `Configure keystroke capture on your login form:`,
          code: `<!-- HTML Form -->
<form id="login-form">
  <input 
    type="text" 
    id="username" 
    data-tmg-capture="username"
    placeholder="Username"
  />
  <input 
    type="password" 
    id="password" 
    data-tmg-capture="password"
    placeholder="Password"
  />
  <button type="submit">Login</button>
</form>

<script>
// JavaScript setup
tmg.attachToForm('#login-form', {
  fields: ['username', 'password'],
  onReady: () => console.log('Capture ready'),
  onDataCollected: (data) => console.log('Keystroke data collected', data)
});
</script>`
        },
        {
          title: 'Implement Authentication Flow',
          content: `Handle the authentication process with biometric validation:`,
          code: `async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    // First, validate credentials
    const credentialsValid = await validateCredentials(username, password);
    
    if (!credentialsValid) {
      showError('Invalid credentials');
      return;
    }
    
    // Then, perform biometric authentication
    const biometricResult = await tmg.authenticate({
      userId: username,
      context: 'login',
      metadata: {
        sessionId: generateSessionId(),
        ipAddress: await getUserIP()
      }
    });
    
    if (biometricResult.success && biometricResult.confidenceScore >= 75) {
      // High confidence - grant immediate access
      redirectToApp();
    } else if (biometricResult.confidenceScore >= 50) {
      // Medium confidence - request 2FA
      showTwoFactorPrompt();
    } else {
      // Low confidence - additional verification required
      showAdditionalVerification();
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    handleAuthError(error);
  }
}`
        },
        {
          title: 'Handle Results and Fallbacks',
          content: `Implement proper error handling and fallback mechanisms:`,
          code: `function handleAuthError(error) {
  switch (error.code) {
    case 'INSUFFICIENT_DATA':
      showMessage('Please continue typing to improve accuracy', 'info');
      // Allow user to continue, collect more data
      break;
      
    case 'PATTERN_MISMATCH':
      showMessage('Typing pattern not recognized. Please try again.', 'warning');
      // Offer alternative authentication
      showAlternativeAuth();
      break;
      
    case 'NETWORK_ERROR':
      showMessage('Connection issue. Falling back to standard authentication.', 'error');
      // Fall back to traditional 2FA
      proceedWithTraditionalAuth();
      break;
      
    case 'API_LIMIT_EXCEEDED':
      showMessage('Service temporarily unavailable. Please try again later.', 'error');
      break;
      
    default:
      showMessage('Authentication service error. Please contact support.', 'error');
  }
}

function showAlternativeAuth() {
  // Show options like SMS, email, or authenticator app
  document.getElementById('alternative-auth').style.display = 'block';
}

// Graceful degradation for unsupported browsers
if (!tmg.isSupported()) {
  console.log('Biometric authentication not supported, using fallback');
  document.getElementById('biometric-indicator').style.display = 'none';
  // Proceed with traditional authentication only
}`
        }
      ]
    },
    'mobile-app': {
      overview: 'Integrate TypeMagic Guard into React Native applications for mobile biometric authentication.',
      prerequisites: [
        'React Native development environment',
        'Understanding of mobile event handling',
        'TypeMagic Guard mobile SDK'
      ],
      steps: [
        {
          title: 'Install Mobile SDK',
          content: `Install the React Native compatible SDK:`,
          code: `# Install the mobile SDK
npm install @typemagic/guard-mobile-sdk

# For iOS, install pods
cd ios && pod install

# For Android, no additional setup required`
        },
        {
          title: 'Configure Mobile Capture',
          content: `Set up keystroke capture for mobile devices:`,
          code: `import { TypeMagicMobile } from '@typemagic/guard-mobile-sdk';
import { TextInput, KeyboardAvoidingView } from 'react-native';

const LoginScreen = () => {
  const [tmg] = useState(() => new TypeMagicMobile({
    apiKey: 'tmg_your_api_key_here',
    captureConfig: {
      touchPressure: true,
      swipeVelocity: true,
      deviceOrientation: true,
      minTouchPoints: 10
    }
  }));

  return (
    <KeyboardAvoidingView>
      <TextInput
        placeholder="Username"
        onTextChange={(text) => tmg.captureText('username', text)}
        onKeyPress={(event) => tmg.captureKeyEvent('username', event)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onTextChange={(text) => tmg.captureText('password', text)}
        onKeyPress={(event) => tmg.captureKeyEvent('password', event)}
      />
    </KeyboardAvoidingView>
  );
};`
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Integration Tutorials</h2>
        <p className="text-muted-foreground">
          Step-by-step guides for implementing TypeMagic Guard in your applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {tutorials.map((tutorial) => {
            const Icon = tutorial.icon;
            return (
              <Card 
                key={tutorial.id}
                className={`cursor-pointer transition-colors ${
                  selectedTutorial === tutorial.id ? 'bg-primary/5 border-primary' : ''
                }`}
                onClick={() => setSelectedTutorial(tutorial.id)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">{tutorial.category}</Badge>
                      <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : 
                                   tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tutorial.duration}
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {tutorials.find(t => t.id === selectedTutorial)?.title}
                  </CardTitle>
                  <CardDescription>
                    {tutorialContent[selectedTutorial as keyof typeof tutorialContent]?.overview}
                  </CardDescription>
                </div>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="steps" className="w-full">
                <TabsList>
                  <TabsTrigger value="steps">Tutorial Steps</TabsTrigger>
                  <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                
                <TabsContent value="steps" className="space-y-6">
                  {tutorialContent[selectedTutorial as keyof typeof tutorialContent]?.steps.map((step, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{step.content}</p>
                        {step.code && (
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{step.code}</code>
                            </pre>
                            <Button 
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(step.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="prerequisites" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Before You Begin</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tutorialContent[selectedTutorial as keyof typeof tutorialContent]?.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="resources" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Code Examples</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full">
                          <Code className="h-4 w-4 mr-2" />
                          Complete Example Project
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          GitHub Repository
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Additional Resources</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          API Reference
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Video Tutorial
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTutorials;
