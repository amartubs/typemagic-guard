
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  BarChart3,
  Key,
  Settings,
  Building2,
  Crown,
  Activity,
  Database,
  Monitor,
  Globe,
  Lock,
  Zap,
  CheckCircle,
  Star
} from 'lucide-react';

const FeatureShowcase = () => {
  const features = [
    {
      category: "Authentication & Security",
      items: [
        { name: "Keystroke Biometrics", icon: Shield, description: "Advanced typing pattern recognition", tier: "All Plans", route: "/dashboard" },
        { name: "Two-Factor Authentication", icon: Lock, description: "Enhanced security with 2FA", tier: "Basic+", route: "/profile?tab=security" },
        { name: "Real-time Threat Detection", icon: Activity, description: "Immediate anomaly detection", tier: "Professional+", route: "/dashboard" },
        { name: "Security Dashboard", icon: Monitor, description: "Comprehensive security overview", tier: "Professional+", route: "/dashboard" }
      ]
    },
    {
      category: "Analytics & Insights",
      items: [
        { name: "Basic Analytics", icon: BarChart3, description: "Standard usage metrics", tier: "Basic+", route: "/dashboard" },
        { name: "Advanced Analytics", icon: Star, description: "Deep behavioral insights", tier: "Professional+", route: "/dashboard" },
        { name: "Custom Reports", icon: Database, description: "Tailored reporting tools", tier: "Enterprise", route: "/enterprise" },
        { name: "Performance Monitoring", icon: Monitor, description: "System performance metrics", tier: "Enterprise", route: "/enterprise" }
      ]
    },
    {
      category: "Enterprise Features",
      items: [
        { name: "API Management", icon: Key, description: "Full API access and management", tier: "Enterprise", route: "/enterprise" },
        { name: "White-label Branding", icon: Globe, description: "Custom branding options", tier: "Enterprise", route: "/enterprise" },
        { name: "SSO Integration", icon: Users, description: "Single sign-on capabilities", tier: "Enterprise", route: "/enterprise" },
        { name: "Dedicated Support", icon: Users, description: "Priority customer support", tier: "Enterprise", route: "/support" }
      ]
    },
    {
      category: "Administration",
      items: [
        { name: "User Management", icon: Users, description: "Manage all system users", tier: "Admin", route: "/admin" },
        { name: "System Monitoring", icon: Monitor, description: "Full system oversight", tier: "Admin", route: "/admin" },
        { name: "Audit Logs", icon: Database, description: "Comprehensive audit trails", tier: "Admin", route: "/admin" },
        { name: "Global Settings", icon: Settings, description: "System-wide configuration", tier: "Admin", route: "/admin" }
      ]
    }
  ];

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'All Plans': return 'bg-green-100 text-green-800';
      case 'Basic+': return 'bg-blue-100 text-blue-800';
      case 'Professional+': return 'bg-purple-100 text-purple-800';
      case 'Enterprise': return 'bg-orange-100 text-orange-800';
      case 'Admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feature Showcase</h1>
        <p className="text-muted-foreground">
          Explore all available features and capabilities of the Shoale platform.
        </p>
      </div>

      {features.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            {category.category}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.items.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.name} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <Badge className={getTierBadgeColor(feature.tier)}>
                        {feature.tier}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{feature.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild size="sm" className="w-full">
                      <Link to={feature.route}>
                        Access Feature
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quick Navigation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Navigation
          </CardTitle>
          <CardDescription>
            Jump directly to key areas of the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-2">
              <Link to="/dashboard">
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-2">
              <Link to="/profile">
                <Users className="h-5 w-5" />
                Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-2">
              <Link to="/enterprise">
                <Building2 className="h-5 w-5" />
                Enterprise
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-2">
              <Link to="/admin">
                <Crown className="h-5 w-5" />
                Admin
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureShowcase;
