
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserType } from '@/lib/types';
import { User as UserIcon, Building, Heart, Users } from 'lucide-react';

interface UserTypeStepProps {
  userType: UserType;
  organizationName: string;
  organizationSize: number | undefined;
  onUserTypeChange: (type: UserType) => void;
  onOrganizationNameChange: (name: string) => void;
  onOrganizationSizeChange: (size: number | undefined) => void;
  onBack: () => void;
  onContinue: () => void;
}

const UserTypeStep: React.FC<UserTypeStepProps> = ({
  userType,
  organizationName,
  organizationSize,
  onUserTypeChange,
  onOrganizationNameChange,
  onOrganizationSizeChange,
  onBack,
  onContinue
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Select Account Type</h2>
      
      <RadioGroup 
        value={userType} 
        onValueChange={(value) => onUserTypeChange(value as UserType)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
            <UserIcon className="h-5 w-5 text-primary" />
            <div>
              <div>Individual</div>
              <p className="text-sm text-muted-foreground">Personal use account</p>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
          <RadioGroupItem value="company" id="company" />
          <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <div>Company</div>
              <p className="text-sm text-muted-foreground">Business or organization account</p>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
          <RadioGroupItem value="charity" id="charity" />
          <Label htmlFor="charity" className="flex items-center gap-2 cursor-pointer">
            <Heart className="h-5 w-5 text-primary" />
            <div>
              <div>Charity / Non-profit</div>
              <p className="text-sm text-muted-foreground">Special rates for non-profits</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
      
      {userType !== 'individual' && (
        <div className="space-y-2">
          <Label htmlFor="organization-name">Organization Name</Label>
          <Input
            id="organization-name"
            placeholder="Organization Name"
            value={organizationName}
            onChange={(e) => onOrganizationNameChange(e.target.value)}
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
              onChange={(e) => onOrganizationSizeChange(Number(e.target.value))}
              className="pl-10"
              required
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        <Button onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default UserTypeStep;
