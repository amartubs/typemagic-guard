
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';
import { 
  User as UserIcon, 
  Save, 
  Key,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSecurityValidation } from '@/hooks/useSecurityValidation';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address.")
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters."),
  newPassword: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters.")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfileManagement: React.FC = () => {
  const { user, updateUserProfile, updatePassword, loading } = useAuth();
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const { validateField, checkRateLimit, sanitizeInput, validationErrors } = useSecurityValidation();

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || ""
    }
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email
      });
    }
  }, [user, profileForm]);

  // Handle profile update with security validation
  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    // Check rate limiting
    if (!checkRateLimit('api')) {
      return;
    }

    // Validate inputs
    const sanitizedName = sanitizeInput(data.name);
    const sanitizedEmail = data.email.toLowerCase().trim();

    if (!validateField('name', sanitizedName) || !validateField('email', sanitizedEmail)) {
      return;
    }

    const success = await updateUserProfile(sanitizedName, sanitizedEmail);
    
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved successfully."
      });
    }
  };

  // Handle password update with security validation
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user) return;

    // Check rate limiting
    if (!checkRateLimit('api')) {
      return;
    }

    // Validate passwords
    if (!validateField('password', data.newPassword)) {
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Password Update Failed",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }

    const success = await updatePassword(data.currentPassword, data.newPassword);
    
    if (success) {
      // Reset password form
      passwordForm.reset();
      setPasswordChangeMode(false);
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully."
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form 
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value);
                          field.onChange(sanitized);
                        }}
                      />
                    </FormControl>
                    {validationErrors.name && (
                      <div className="text-sm text-destructive">{validationErrors.name}</div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Changing your email will require verification of the new address.
                    </FormDescription>
                    {validationErrors.email && (
                      <div className="text-sm text-destructive">{validationErrors.email}</div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="gap-2 mt-2"
                disabled={loading || !profileForm.formState.isDirty}
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Update your password and configure security options
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordChangeMode ? (
            <Form {...passwordForm}>
              <form 
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      {validationErrors.password && (
                        <div className="text-sm text-destructive">{validationErrors.password}</div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 mt-2">
                  <Button 
                    type="submit" 
                    className="gap-2"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setPasswordChangeMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-5 w-5" />
                <p>Your password is hidden for security</p>
              </div>
              
              <Button 
                onClick={() => setPasswordChangeMode(true)}
                variant="outline"
                className="gap-2"
              >
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="mt-4">
            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Advanced Security Options</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 mb-2"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "This feature will be available in a future update."
                });
              }}
            >
              <Lock className="h-4 w-4" />
              Configure Two-Factor Authentication
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;
