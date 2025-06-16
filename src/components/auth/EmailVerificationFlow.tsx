
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  email: string;
  onVerified: () => void;
}

export const EmailVerificationFlow: React.FC<Props> = ({ email, onVerified }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    // Check verification status on mount
    checkVerificationStatus();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        setVerificationStatus('verified');
        onVerified();
      }
    });

    return () => subscription.unsubscribe();
  }, [onVerified]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const checkVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setVerificationStatus('verified');
        onVerified();
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification email sent",
        description: "Please check your email inbox and spam folder.",
      });

      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      console.error('Error resending verification:', error);
      toast({
        title: "Failed to send verification email",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (verificationStatus === 'verified') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Email Verified
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your email has been successfully verified. You can now access all features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Verify Your Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            We've sent a verification email to <strong>{email}</strong>. 
            Please check your inbox and click the verification link to continue.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or request a new one.
          </p>

          <Button
            onClick={handleResendVerification}
            disabled={isResending || resendCooldown > 0}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              'Resend Verification Email'
            )}
          </Button>

          <Button
            onClick={checkVerificationStatus}
            variant="ghost"
            size="sm"
          >
            I've verified my email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
