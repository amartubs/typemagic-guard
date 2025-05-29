
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, KeyRound, RefreshCw } from 'lucide-react';

interface TwoFactorFormProps {
  onSubmit: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  loading: boolean;
}

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
  onSubmit,
  onResendCode,
  loading
}) => {
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Two-Factor Verification</h1>
          <p className="text-muted-foreground mt-2">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={onResendCode}
          >
            <RefreshCw className="h-4 w-4" />
            Resend Code
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default TwoFactorForm;
