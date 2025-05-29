
export const codeExamples = {
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
