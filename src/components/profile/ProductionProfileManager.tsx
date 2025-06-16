
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { 
  User, 
  Mail, 
  Building2, 
  Users, 
  Shield, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ProductionProfileManager: React.FC = () => {
  const { user } = useAuth();
  const { validateField, validationErrors, clearErrors } = useSecurityValidation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organizationName: user?.organizationName || '',
    organizationSize: user?.organizationSize || 1,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    // Validate all fields
    const isValid = Object.entries(formData).every(([field, value]) => 
      validateField(field, value)
    );

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before saving",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          organization_name: formData.organizationName || null,
          organization_size: formData.organizationSize || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      console.error('Error in handleUpdateProfile:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeInfo = () => {
    const userType = user?.subscription?.type || 'individual';
    const typeConfig = {
      individual: { label: 'Individual', icon: User, color: 'bg-blue-100 text-blue-800' },
      company: { label: 'Company', icon: Building2, color: 'bg-green-100 text-green-800' },
      charity: { label: 'Charity', icon: Users, color: 'bg-purple-100 text-purple-800' },
    };
    return typeConfig[userType] || typeConfig.individual;
  };

  const getStatusInfo = () => {
    const status = user?.status || 'pending';
    const statusConfig = {
      active: { label: 'Active', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800' },
      locked: { label: 'Locked', icon: Shield, color: 'bg-red-100 text-red-800' },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const userTypeInfo = getUserTypeInfo();
  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your basic account information and organization details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <statusInfo.icon className="h-5 w-5" />
              <div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm text-muted-foreground">Current status of your account</p>
              </div>
            </div>
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* User Type */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <userTypeInfo.icon className="h-5 w-5" />
              <div>
                <p className="font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground">Your subscription type</p>
              </div>
            </div>
            <Badge className={userTypeInfo.color}>
              {userTypeInfo.label}
            </Badge>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed from this interface
              </p>
            </div>

            {user?.subscription?.type === 'company' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Enter organization name"
                  />
                  {validationErrors.organizationName && (
                    <p className="text-sm text-destructive">{validationErrors.organizationName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationSize">Organization Size</Label>
                  <Input
                    id="organizationSize"
                    type="number"
                    min="1"
                    value={formData.organizationSize}
                    onChange={(e) => handleInputChange('organizationSize', parseInt(e.target.value) || 1)}
                    placeholder="Number of employees"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={clearErrors}>
              Reset Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View your account details and registration information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
              <p className="font-mono text-sm bg-muted p-2 rounded">{user?.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Role</Label>
              <Badge variant="outline" className="mt-1">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
              </Badge>
            </div>
            {user?.lastLogin && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                <p className="text-sm">{new Date(user.lastLogin).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionProfileManager;
