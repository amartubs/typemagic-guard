
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Mail, Lock } from 'lucide-react';

interface UserInfoStepProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onContinue: () => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onContinue
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Full Name</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="register-name"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="register-email"
            placeholder="john@example.com"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="register-password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="confirm-password"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button onClick={onContinue} className="w-full">
        Continue
      </Button>
    </div>
  );
};

export default UserInfoStep;
