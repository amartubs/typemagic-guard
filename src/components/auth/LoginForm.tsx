
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onBackToOptions: () => void;
  onForgotPassword: () => void;
  loading: boolean;
  enableBiometrics: boolean;
  onBiometricsChange: (enabled: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onBackToOptions,
  onForgotPassword,
  loading,
  enableBiometrics,
  onBiometricsChange
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button
        type="button"
        variant="ghost"
        className="flex items-center gap-2 -mt-2 -ml-2 mb-2"
        onClick={onBackToOptions}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login options
      </Button>
    
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="biometrics"
            className="rounded border-gray-300 text-primary focus:ring-primary"
            checked={enableBiometrics}
            onChange={(e) => onBiometricsChange(e.target.checked)}
          />
          <Label htmlFor="biometrics" className="text-sm cursor-pointer">
            Enable biometrics
          </Label>
        </div>
        
        <Button
          type="button"
          variant="link"
          className="text-sm p-0 h-auto"
          onClick={onForgotPassword}
        >
          Forgot password?
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
