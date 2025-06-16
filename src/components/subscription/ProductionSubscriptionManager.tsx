
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubscriptionData } from '@/hooks/useSubscriptionData';
import { useAuth } from '@/contexts/auth';
import { 
  CreditCard, 
  Check, 
  X, 
  Calendar, 
  AlertTriangle,
  Crown,
  Zap,
  Users,
  Shield,
  BarChart3
} from 'lucide-react';

const ProductionSubscriptionManager: React.FC = () => {
  const { user } = useAuth();
  const { 
    subscription, 
    plans, 
    loading, 
    error, 
    createOrUpdateSubscription, 
    cancelSubscription 
  } = useSubscriptionData();

  const getCurrentPlan = () => {
    const currentTier = subscription?.subscription_tier || 'free';
    return plans.find(plan => plan.tier === currentTier) || plans.find(plan => plan.tier === 'free');
  };

  const formatPrice = (price: number, userType: 'individual' | 'company' | 'charity' = 'individual') => {
    const priceMap = {
      individual: 'price_individual',
      company: 'price_company',
      charity: 'price_charity'
    };
    return price === 0 ? 'Free' : `$${price}/month`;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'free': return <Shield className="h-5 w-5" />;
      case 'basic': return <Zap className="h-5 w-5" />;
      case 'professional': return <BarChart3 className="h-5 w-5" />;
      case 'enterprise': return <Crown className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpgrade = async (planId: string) => {
    const success = await createOrUpdateSubscription(planId);
    if (success) {
      // In production, you would redirect to Stripe checkout here
      console.log('Redirect to payment processor...');
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      await cancelSubscription();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading subscription data...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load subscription data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  const currentPlan = getCurrentPlan();
  const userType = user?.subscription?.type || 'individual';

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTierIcon(subscription.subscription_tier || 'free')}
                  <div>
                    <h3 className="font-medium">{currentPlan?.name || 'Unknown Plan'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(currentPlan?.price_individual || 0, userType)}
                    </p>
                  </div>
                </div>
                <Badge className={getTierColor(subscription.subscription_tier || 'free')}>
                  {subscription.subscription_tier?.charAt(0).toUpperCase() + 
                   subscription.subscription_tier?.slice(1) || 'Free'}
                </Badge>
              </div>

              {subscription.subscription_end && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {subscription.subscribed ? 'Renews' : 'Expires'} on{' '}
                  {new Date(subscription.subscription_end).toLocaleDateString()}
                </div>
              )}

              <div className="flex gap-2">
                {subscription.subscribed && subscription.subscription_tier !== 'free' && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No subscription found. You're currently on the free plan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const priceKey = `price_${userType}` as keyof typeof plan;
            const price = plan[priceKey] as number;

            return (
              <Card key={plan.id} className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getTierIcon(plan.tier)}
                      {plan.name}
                    </CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">
                    {formatPrice(price, userType)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {plan.max_users === -1 ? <Check className="h-4 w-4 text-green-500" /> : <Users className="h-4 w-4" />}
                      {plan.max_users === -1 ? 'Unlimited users' : `${plan.max_users} user${plan.max_users > 1 ? 's' : ''}`}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {plan.max_biometric_profiles === -1 ? <Check className="h-4 w-4 text-green-500" /> : <Shield className="h-4 w-4" />}
                      {plan.max_biometric_profiles === -1 ? 'Unlimited devices' : `${plan.max_biometric_profiles} device${plan.max_biometric_profiles > 1 ? 's' : ''}`}
                    </div>

                    <div className="flex items-center gap-2">
                      {plan.advanced_analytics ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      Advanced Analytics
                    </div>

                    <div className="flex items-center gap-2">
                      {plan.custom_security_settings ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      Custom Security Settings
                    </div>

                    <div className="flex items-center gap-2">
                      {plan.priority_support ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      Priority Support
                    </div>
                  </div>

                  {!isCurrentPlan && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={loading}
                      variant={plan.tier === 'enterprise' ? 'default' : 'outline'}
                    >
                      {plan.tier === 'free' ? 'Downgrade' : 'Upgrade'} to {plan.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductionSubscriptionManager;
