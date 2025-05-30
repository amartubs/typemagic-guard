
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Smartphone, 
  Key, 
  QrCode, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  RefreshCw
} from 'lucide-react';

const TwoFactorSetup: React.FC = () => {
  const { user } = useAuth();
  const [setupStep, setSetupStep] = useState<'disabled' | 'setup' | 'verify' | 'enabled'>('disabled');
  const [qrCode, setQrCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock QR code and backup codes for demo
  const generateMockSetup = () => {
    setQrCode('otpauth://totp/TypeMagicGuard:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=TypeMagicGuard');
    setBackupCodes([
      '1a2b-3c4d-5e6f',
      '7g8h-9i0j-1k2l',
      '3m4n-5o6p-7q8r',
      '9s0t-1u2v-3w4x',
      '5y6z-7a8b-9c0d'
    ]);
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call a backend service
      await new Promise(resolve => setTimeout(resolve, 1000));
      generateMockSetup();
      setSetupStep('setup');
      
      toast({
        title: "2FA Setup Started",
        description: "Scan the QR code with your authenticator app.",
      });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to start 2FA setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would verify the code with the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSetupStep('enabled');
      
      toast({
        title: "2FA Enabled Successfully",
        description: "Two-factor authentication is now active on your account.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would disable 2FA on the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSetupStep('disabled');
      setQrCode('');
      setBackupCodes([]);
      setVerificationCode('');
      
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    } catch (error) {
      toast({
        title: "Disable Failed",
        description: "Failed to disable 2FA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Backup code copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
            <Badge variant={setupStep === 'enabled' ? 'default' : 'secondary'}>
              {setupStep === 'enabled' ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {setupStep === 'disabled' && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication adds an extra layer of security by requiring 
                  a code from your mobile device in addition to your password.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Smartphone className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium">Authenticator App Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Install an authenticator app like Google Authenticator or Authy
                  </p>
                </div>
              </div>
              
              <Button onClick={handleEnable2FA} disabled={loading} className="gap-2">
                <Key className="h-4 w-4" />
                {loading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
              </Button>
            </div>
          )}

          {setupStep === 'setup' && (
            <div className="space-y-6">
              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertDescription>
                  Scan this QR code with your authenticator app, then enter the 6-digit code below.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <div className="p-4 bg-white border rounded-lg">
                  <div className="w-48 h-48 bg-muted flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                    <span className="sr-only">QR Code for 2FA setup</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleVerify2FA} 
                  disabled={loading || verificationCode.length !== 6}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </Button>
                <Button variant="outline" onClick={() => setSetupStep('disabled')}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {setupStep === 'enabled' && (
            <div className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Two-factor authentication is active. Your account is more secure!
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Backup Codes
                </h4>
                <p className="text-sm text-muted-foreground">
                  Save these backup codes in a safe place. You can use them to access your account 
                  if you lose your authenticator device.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded font-mono text-sm">
                      <span className="flex-1">{code}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Generate New Backup Codes
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDisable2FA}
                  disabled={loading}
                  className="gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {loading ? 'Disabling...' : 'Disable 2FA'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorSetup;
