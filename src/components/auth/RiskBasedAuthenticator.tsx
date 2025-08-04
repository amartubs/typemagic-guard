import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Smartphone, 
  Mail, 
  Fingerprint,
  Key,
  MapPin,
  Clock,
  User,
  Wifi,
  Monitor
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface RiskFactor {
  id: string;
  name: string;
  value: number;
  weight: number;
  status: 'safe' | 'warning' | 'danger';
  description: string;
}

interface AuthenticationChallenge {
  id: string;
  type: 'biometric' | 'sms' | 'email' | 'totp' | 'backup_codes';
  required: boolean;
  completed: boolean;
  description: string;
  icon: React.ReactNode;
}

interface RiskBasedAuthenticatorProps {
  onAuthenticationComplete?: (success: boolean, trustScore: number) => void;
}

const RiskBasedAuthenticator: React.FC<RiskBasedAuthenticatorProps> = ({ 
  onAuthenticationComplete 
}) => {
  const { user } = useAuth();
  const [riskScore, setRiskScore] = useState(0);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [challenges, setChallenges] = useState<AuthenticationChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [authenticationStep, setAuthenticationStep] = useState<'assessment' | 'challenges' | 'complete'>('assessment');
  const [verificationCode, setVerificationCode] = useState('');

  // Initialize risk assessment
  useEffect(() => {
    const assessRisk = () => {
      const factors: RiskFactor[] = [
        {
          id: 'location',
          name: 'Location',
          value: Math.random() > 0.8 ? 75 : 15, // 20% chance of suspicious location
          weight: 0.25,
          status: Math.random() > 0.8 ? 'danger' : 'safe',
          description: 'Geographic location analysis'
        },
        {
          id: 'device',
          name: 'Device Recognition',
          value: Math.random() > 0.9 ? 60 : 5, // 10% chance of new device
          weight: 0.20,
          status: Math.random() > 0.9 ? 'warning' : 'safe',
          description: 'Device fingerprint and history'
        },
        {
          id: 'time_pattern',
          name: 'Time Pattern',
          value: Math.random() > 0.7 ? 40 : 10, // 30% chance of unusual time
          weight: 0.15,
          status: Math.random() > 0.7 ? 'warning' : 'safe',
          description: 'Login time analysis'
        },
        {
          id: 'network',
          name: 'Network Analysis',
          value: Math.random() > 0.85 ? 80 : 20, // 15% chance of suspicious network
          weight: 0.20,
          status: Math.random() > 0.85 ? 'danger' : 'safe',
          description: 'IP reputation and VPN detection'
        },
        {
          id: 'behavioral',
          name: 'Behavioral Patterns',
          value: Math.random() > 0.6 ? 30 : 5, // 40% chance of behavioral anomaly
          weight: 0.20,
          status: Math.random() > 0.6 ? 'warning' : 'safe',
          description: 'Keystroke and interaction patterns'
        }
      ];

      const calculatedRisk = factors.reduce((total, factor) => 
        total + (factor.value * factor.weight), 0
      );

      setRiskFactors(factors);
      setRiskScore(Math.round(calculatedRisk));

      // Determine required challenges based on risk
      const requiredChallenges: AuthenticationChallenge[] = [
        {
          id: 'biometric',
          type: 'biometric',
          required: true, // Always required
          completed: false,
          description: 'Biometric authentication (keystroke dynamics)',
          icon: <Fingerprint className="h-5 w-5" />
        }
      ];

      if (calculatedRisk > 30) {
        requiredChallenges.push({
          id: 'sms',
          type: 'sms',
          required: true,
          completed: false,
          description: 'SMS verification code',
          icon: <Smartphone className="h-5 w-5" />
        });
      }

      if (calculatedRisk > 50) {
        requiredChallenges.push({
          id: 'email',
          type: 'email',
          required: true,
          completed: false,
          description: 'Email verification',
          icon: <Mail className="h-5 w-5" />
        });
      }

      if (calculatedRisk > 70) {
        requiredChallenges.push({
          id: 'totp',
          type: 'totp',
          required: true,
          completed: false,
          description: 'Time-based one-time password',
          icon: <Key className="h-5 w-5" />
        });
      }

      setChallenges(requiredChallenges);

      // Start with first challenge
      setTimeout(() => {
        setAuthenticationStep('challenges');
        if (requiredChallenges.length > 0) {
          setCurrentChallenge(requiredChallenges[0].id);
        }
      }, 2000);
    };

    assessRisk();
  }, []);

  const getRiskLevel = () => {
    if (riskScore <= 25) return { level: 'Low', color: 'text-green-600 bg-green-50', icon: <CheckCircle className="h-4 w-4" /> };
    if (riskScore <= 50) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-50', icon: <AlertTriangle className="h-4 w-4" /> };
    if (riskScore <= 75) return { level: 'High', color: 'text-orange-600 bg-orange-50', icon: <AlertTriangle className="h-4 w-4" /> };
    return { level: 'Critical', color: 'text-red-600 bg-red-50', icon: <AlertTriangle className="h-4 w-4" /> };
  };

  const getFactorStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getFactorIcon = (factorId: string) => {
    switch (factorId) {
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'device': return <Monitor className="h-4 w-4" />;
      case 'time_pattern': return <Clock className="h-4 w-4" />;
      case 'network': return <Wifi className="h-4 w-4" />;
      case 'behavioral': return <User className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true }
        : challenge
    ));

    const nextChallenge = challenges.find(c => c.id !== challengeId && !c.completed);
    if (nextChallenge) {
      setCurrentChallenge(nextChallenge.id);
    } else {
      // All challenges completed
      setAuthenticationStep('complete');
      const finalTrustScore = Math.max(10, 100 - riskScore);
      onAuthenticationComplete?.(true, finalTrustScore);
    }
  };

  const handleBiometricAuth = () => {
    // Simulate biometric authentication
    setTimeout(() => {
      completeChallenge('biometric');
    }, 1500);
  };

  const handleCodeVerification = () => {
    if (verificationCode.length >= 4) {
      // Simulate code verification
      setTimeout(() => {
        completeChallenge(currentChallenge!);
        setVerificationCode('');
      }, 1000);
    }
  };

  const risk = getRiskLevel();

  if (authenticationStep === 'assessment') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Risk Assessment</span>
          </CardTitle>
          <CardDescription>
            Analyzing authentication context and risk factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2" style={{ color: risk.color.split(' ')[0] }}>
              {riskScore}%
            </div>
            <Badge className={risk.color}>
              {risk.icon}
              <span className="ml-1">{risk.level} Risk</span>
            </Badge>
          </div>

          <Progress value={riskScore} className="w-full" />

          <div className="space-y-3">
            <h4 className="font-semibold">Risk Factors Analysis</h4>
            {riskFactors.map((factor) => (
              <div key={factor.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFactorIcon(factor.id)}
                  <div>
                    <p className="font-medium">{factor.name}</p>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getFactorStatusColor(factor.status)}`}>
                    {factor.value}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Weight: {(factor.weight * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Based on the risk assessment, additional authentication steps will be required.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (authenticationStep === 'challenges') {
    const currentChallengeData = challenges.find(c => c.id === currentChallenge);
    const completedChallenges = challenges.filter(c => c.completed).length;
    const totalChallenges = challenges.length;

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Multi-Factor Authentication</span>
          </CardTitle>
          <CardDescription>
            Complete {totalChallenges} authentication challenges ({completedChallenges} of {totalChallenges} completed)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={(completedChallenges / totalChallenges) * 100} className="w-full" />

          {/* Challenge Progress */}
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                {challenge.icon}
                <div className="flex-1">
                  <p className="font-medium">{challenge.description}</p>
                </div>
                {challenge.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : challenge.id === currentChallenge ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
            ))}
          </div>

          {/* Current Challenge */}
          {currentChallengeData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {currentChallengeData.icon}
                  <span>{currentChallengeData.description}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentChallengeData.type === 'biometric' && (
                  <div className="text-center space-y-4">
                    <div className="animate-pulse">
                      <Fingerprint className="h-16 w-16 mx-auto text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Type naturally to complete biometric authentication
                    </p>
                    <Input 
                      placeholder="Start typing to capture your biometric pattern..."
                      onChange={(e) => {
                        if (e.target.value.length > 10) {
                          handleBiometricAuth();
                        }
                      }}
                    />
                  </div>
                )}

                {(currentChallengeData.type === 'sms' || currentChallengeData.type === 'email' || currentChallengeData.type === 'totp') && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Enter the verification code sent to your {currentChallengeData.type === 'sms' ? 'phone' : currentChallengeData.type === 'email' ? 'email' : 'authenticator app'}
                    </p>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Enter code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={8}
                      />
                      <Button 
                        onClick={handleCodeVerification}
                        disabled={verificationCode.length < 4}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  }

  // Authentication complete
  const finalTrustScore = Math.max(10, 100 - riskScore);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <span>Authentication Complete</span>
        </CardTitle>
        <CardDescription>
          All security challenges have been successfully completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2 text-green-600">
            {finalTrustScore}%
          </div>
          <Badge className="text-green-600 bg-green-50">
            <CheckCircle className="h-4 w-4 mr-1" />
            High Trust Score
          </Badge>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Authentication Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Initial Risk Score</p>
              <p className="font-bold">{riskScore}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Final Trust Score</p>
              <p className="font-bold text-green-600">{finalTrustScore}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Challenges Completed</p>
              <p className="font-bold">{challenges.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Authentication Time</p>
              <p className="font-bold">~{challenges.length * 15}s</p>
            </div>
          </div>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Authentication successful. Access granted with high confidence level.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default RiskBasedAuthenticator;