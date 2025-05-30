
interface TutorialStep {
  title: string;
  content: string;
  code?: string;
}

interface TutorialContentData {
  overview: string;
  prerequisites: string[];
  steps: TutorialStep[];
}

export const tutorialContent: Record<string, TutorialContentData> = {
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
  },
  'backend-api': {
    overview: 'Implement server-side TypeMagic Guard integration for secure API validation.',
    prerequisites: [
      'Backend development experience',
      'API key management knowledge',
      'Understanding of HTTP requests'
    ],
    steps: [
      {
        title: 'Server-Side SDK Installation',
        content: `Install the appropriate server SDK for your platform:`,
        code: `# Node.js/Express
npm install @typemagic/guard-server

# Python/Django
pip install typemagic-guard-server

# PHP/Laravel
composer require typemagic/guard-server

# Java/Spring
implementation 'com.typemagic:guard-server:1.0.0'`
      },
      {
        title: 'Configure Server Integration',
        content: `Set up the server-side validation endpoint:`,
        code: `// Node.js Express example
const express = require('express');
const { TypeMagicServer } = require('@typemagic/guard-server');

const app = express();
const tmgServer = new TypeMagicServer({
  apiKey: process.env.TYPEMAGIC_API_KEY,
  baseUrl: 'https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api'
});

app.post('/api/auth/biometric', async (req, res) => {
  try {
    const { userId, keystrokeData, context } = req.body;
    
    const result = await tmgServer.validateBiometric({
      userId,
      keystrokeData,
      context,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: result.success,
      confidenceScore: result.confidenceScore,
      riskLevel: result.riskLevel,
      sessionToken: result.success ? generateSessionToken(userId) : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Biometric validation failed' });
  }
});`
      }
    ]
  },
  'webhooks': {
    overview: 'Configure webhooks to receive real-time notifications about authentication events and security alerts.',
    prerequisites: [
      'HTTP endpoint for receiving webhooks',
      'Understanding of webhook security',
      'SSL certificate for production'
    ],
    steps: [
      {
        title: 'Configure Webhook Endpoint',
        content: `Set up your webhook endpoint to receive TypeMagic Guard events:`,
        code: `// Express.js webhook endpoint
const express = require('express');
const crypto = require('crypto');

app.post('/webhooks/typemagic', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-typemagic-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.TYPEMAGIC_WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');
  
  if (signature !== \`sha256=\${expectedSignature}\`) {
    return res.status(401).send('Unauthorized');
  }
  
  const event = JSON.parse(payload);
  
  switch (event.type) {
    case 'authentication.success':
      handleAuthSuccess(event.data);
      break;
    case 'authentication.failed':
      handleAuthFailure(event.data);
      break;
    case 'security.alert':
      handleSecurityAlert(event.data);
      break;
    case 'user.pattern_updated':
      handlePatternUpdate(event.data);
      break;
  }
  
  res.status(200).send('OK');
});`
      },
      {
        title: 'Event Handler Implementation',
        content: `Implement handlers for different webhook events:`,
        code: `function handleAuthSuccess(data) {
  console.log('Successful authentication:', {
    userId: data.userId,
    confidenceScore: data.confidenceScore,
    timestamp: data.timestamp
  });
  
  // Update user session
  updateUserSession(data.userId, {
    lastAuth: data.timestamp,
    authMethod: 'biometric',
    confidence: data.confidenceScore
  });
}

function handleAuthFailure(data) {
  console.log('Failed authentication attempt:', {
    userId: data.userId,
    reason: data.reason,
    ipAddress: data.ipAddress
  });
  
  // Log security event
  logSecurityEvent({
    type: 'auth_failure',
    userId: data.userId,
    details: data
  });
}

function handleSecurityAlert(data) {
  console.log('Security alert:', data);
  
  if (data.severity === 'high') {
    // Send immediate notification
    notifySecurityTeam(data);
    
    // Consider blocking user if needed
    if (data.alertType === 'suspicious_pattern') {
      temporarilyBlockUser(data.userId);
    }
  }
}`
      },
      {
        title: 'Webhook Configuration',
        content: `Configure your webhook settings through the API or dashboard:`,
        code: `// Configure webhook via API
const webhookConfig = {
  url: 'https://yourapp.com/webhooks/typemagic',
  events: [
    'authentication.success',
    'authentication.failed',
    'security.alert',
    'user.pattern_updated'
  ],
  secret: 'your_webhook_secret_here'
};

// Register webhook
fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/webhooks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'tmg_your_api_key_here'
  },
  body: JSON.stringify(webhookConfig)
});

// Test webhook
fetch('https://wybjhqehohapazufkjfb.supabase.co/functions/v1/enterprise-api/webhooks/test', {
  method: 'POST',
  headers: {
    'x-api-key': 'tmg_your_api_key_here'
  }
});`
      }
    ]
  }
};
