
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserType } from '@/lib/types';
import { User as UserIcon, Mail, Lock, Building, Heart, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SimpleRegistrationFormProps {
  onSubmit: (
    name: string,
    email: string,
    password: string,
    userType: UserType,
    organizationName?: string,
    organizationSize?: number
  ) => Promise<void>;
  loading: boolean;
}

const SimpleRegistrationForm: React.FC<SimpleRegistrationFormProps> = ({
  onSubmit,
  loading
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('individual');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationSize, setOrganizationSize] = useState<number | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    if (userType !== 'individual' && !organizationName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your organization name",
        variant: "destructive"
      });
      return;
    }
    
    if (userType === 'company' && !organizationSize) {
      toast({
        title: "Missing Information",
        description: "Please enter your organization size",
        variant: "destructive"
      });
      return;
    }

    await onSubmit(
      name.trim(),
      email.trim(),
      password,
      userType,
      userType !== 'individual' ? organizationName.trim() : undefined,
      userType === 'company' ? organizationSize : undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Full Name</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="register-name"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Account Type</Label>
        <RadioGroup 
          value={userType} 
          onValueChange={(value) => setUserType(value as UserType)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-muted">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer text-sm">
              <UserIcon className="h-4 w-4 text-primary" />
              Individual
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-muted">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer text-sm">
              <Building className="h-4 w-4 text-primary" />
              Company
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-muted">
            <RadioGroupItem value="charity" id="charity" />
            <Label htmlFor="charity" className="flex items-center gap-2 cursor-pointer text-sm">
              <Heart className="h-4 w-4 text-primary" />
              Charity / Non-profit
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {userType !== 'individual' && (
        <div className="space-y-2">
          <Label htmlFor="organization-name">Organization Name</Label>
          <Input
            id="organization-name"
            placeholder="Organization Name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
          />
        </div>
      )}
      
      {userType === 'company' && (
        <div className="space-y-2">
          <Label htmlFor="organization-size">Organization Size</Label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="organization-size"
              placeholder="Number of employees"
              type="number"
              min={1}
              value={organizationSize || ''}
              onChange={(e) => setOrganizationSize(Number(e.target.value) || undefined)}
              className="pl-10"
              required
            />
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SimpleRegistrationForm;
