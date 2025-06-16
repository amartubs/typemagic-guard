
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Shield, BarChart3, CreditCard } from 'lucide-react';

interface PlanLimits {
  users: string | number;
  devices: string | number;
  analytics: boolean;
  support: string;
}

interface PlanFeaturesCardProps {
  limits: PlanLimits;
}

const PlanFeaturesCard: React.FC<PlanFeaturesCardProps> = ({ limits }) => {
  return (
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
  );
};

export default PlanFeaturesCard;
