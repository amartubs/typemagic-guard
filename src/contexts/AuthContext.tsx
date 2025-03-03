
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserType, SubscriptionTier, SubscriptionDetails } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    userType: UserType,
    subscriptionTier: SubscriptionTier,
    organizationName?: string,
    organizationSize?: number
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
  updateSubscription: (subscriptionData: Partial<SubscriptionDetails>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Mock user database
  const mockUsers: User[] = [
    {
      id: 'user-1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user',
      biometricProfile: {
        userId: 'user-1',
        keystrokePatterns: [],
        confidenceScore: 0,
        lastUpdated: Date.now(),
        status: 'learning'
      },
      securitySettings: {
        minConfidenceThreshold: 65,
        learningPeriod: 5,
        anomalyDetectionSensitivity: 70,
        securityLevel: 'medium',
        enforceTwoFactor: false,
        maxFailedAttempts: 5
      },
      lastLogin: null,
      status: 'active',
      subscription: {
        type: 'individual',
        tier: 'basic',
        startDate: Date.now(),
        endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        autoRenew: true,
        status: 'active'
      }
    }
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === 'demo') {
        // Update last login
        const updatedUser = {
          ...foundUser,
          lastLogin: Date.now()
        };
        
        // Save to local storage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${updatedUser.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    userType: UserType = 'individual',
    subscriptionTier: SubscriptionTier = 'free',
    organizationName?: string,
    organizationSize?: number
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        toast({
          title: "Registration Failed",
          description: "An account with this email already exists",
          variant: "destructive",
        });
        return false;
      }
      
      // Create subscription details
      const subscription: SubscriptionDetails = {
        type: userType,
        tier: subscriptionTier,
        startDate: Date.now(),
        endDate: subscriptionTier === 'free' ? null : Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days for paid plans
        autoRenew: subscriptionTier !== 'free',
        status: 'active'
      };
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'user',
        securitySettings: {
          minConfidenceThreshold: 65,
          learningPeriod: 5,
          anomalyDetectionSensitivity: 70,
          securityLevel: 'medium',
          enforceTwoFactor: false,
          maxFailedAttempts: 5
        },
        lastLogin: Date.now(),
        status: 'active',
        subscription,
        organizationName: userType !== 'individual' ? organizationName : undefined,
        organizationSize: userType === 'company' ? organizationSize : undefined
      };
      
      // Save to local storage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateSubscription = (subscriptionData: Partial<SubscriptionDetails>) => {
    if (!user || !user.subscription) return;
    
    const updatedSubscription = { ...user.subscription, ...subscriptionData };
    const updatedUser = { ...user, subscription: updatedSubscription };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Subscription Updated",
      description: "Your subscription details have been updated",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      updateUser,
      updateSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
