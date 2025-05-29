
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Calendar, Users, BarChart3, Settings, Shield } from 'lucide-react';
import PricingCards from './PricingCards';

const SubscriptionManager: React.FC = () => {
  const { user, updateSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleUpgrade = async (plan: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId: plan.id,
          userType: user.subscription?.type || 'individual'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlanLimits = () => {
    const tier = user?.subscription?.tier || 'free';
    
    switch (tier) {
      case 'basic':
        return { users: 1, devices: 3, analytics: false, support: 'Email' };
      case 'professional':
        return { users: 25, devices: 'Unlimited', analytics: true, support: '24/7 Priority' };
      case 'enterprise':
        return { users: 'Unlimited', devices: 'Unlimited', analytics: true, support: 'Dedicated Manager' };
      default:
        return { users: 1, devices: 1, analytics: false, support: 'Community' };
    }
  };

  const limits = getCurrentPlanLimits();
  const subscription = user?.subscription;

  if (showPricing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground">Upgrade to unlock more features</p>
          </div>
          <Button variant="outline" onClick={() => setShowPricing(false)}>
            Back to Current Plan
          </Button>
        </div>
        
        <PricingCards
          userType={user?.subscription?.type || 'individual'}
          currentPlanId={subscription?.tier}
          onSelectPlan={handleUpgrade}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <p className="text-muted-foreground">Manage your plan and billing</p>
      </div>

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your current subscription details
              </CardDescription>
            </div>
            <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
              {subscription?.tier?.charAt(0).toUpperCase() + subscription?.tier?.slice(1) || 'Free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {subscription?.endDate 
                  ? `Expires: ${new Date(subscription.endDate).toLocaleDateString()}`
                  : 'No expiration'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {subscription?.status || 'trial'}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            {subscription?.tier !== 'enterprise' && (
              <Button onClick={() => setShowPricing(true)}>
                Upgrade Plan
              </Button>
            )}
            {subscription?.tier !== 'free' && (
              <Button 
                variant="outline" 
                onClick={handleManageSubscription}
                disabled={loading}
              >
                Manage Billing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features & Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Plan Features & Limits
          </CardTitle>
          <CardDescription>
            What's included in your current plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{limits.users}</p>
                <p className="text-sm text-muted-foreground">Users</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{limits.devices}</p>
                <p className="text-sm text-muted-foreground">Devices</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{limits.analytics ? 'Yes' : 'No'}</p>
                <p className="text-sm text-muted-foreground">Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{limits.support}</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;
