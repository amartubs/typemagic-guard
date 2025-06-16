
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar } from 'lucide-react';
import { User } from '@/lib/types';

interface CurrentPlanCardProps {
  user: User | null;
  loading: boolean;
  onUpgrade: () => void;
  onManageSubscription: () => void;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  user,
  loading,
  onUpgrade,
  onManageSubscription
}) => {
  const subscription = user?.subscription;

  return (
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
            <Button onClick={onUpgrade}>
              Upgrade Plan
            </Button>
          )}
          {subscription?.tier !== 'free' && (
            <Button 
              variant="outline" 
              onClick={onManageSubscription}
              disabled={loading}
            >
              Manage Billing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlanCard;
