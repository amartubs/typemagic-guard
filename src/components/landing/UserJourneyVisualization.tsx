
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Monitor, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const UserJourneyVisualization = () => {
  const steps = [
    {
      id: 1,
      title: "User Visits Website",
      description: "Customer navigates to a website that uses Shoale",
      icon: <Monitor className="h-6 w-6 text-blue-600" />,
      userAction: "Types username/password normally",
      background: "Nothing changes for the user"
    },
    {
      id: 2,
      title: "Invisible Analysis", 
      description: "Shoale analyzes typing patterns in real-time",
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      userAction: "Continues typing naturally",
      background: "Keystroke timing captured & analyzed"
    },
    {
      id: 3,
      title: "Authentication Decision",
      description: "System verifies identity based on typing biometrics",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      userAction: "Gains access if verified",
      background: "Fraud blocked if patterns don't match"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-[#E5DEFF]/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works for End Users</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Shoale works invisibly behind the scenes. Users experience seamless, secure authentication 
            without any extra steps or downloads.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <Badge variant="outline" className="mx-auto mb-2">
                    Step {step.id}
                  </Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">User Experience</h4>
                    <p className="text-sm text-blue-700">{step.userAction}</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-1">Behind the Scenes</h4>
                    <p className="text-sm text-purple-700">{step.background}</p>
                  </div>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-900">The Result</h3>
              </div>
              <p className="text-green-800">
                Users get stronger security with zero extra effort. Businesses get fraud protection 
                without user friction. It's completely invisible to end users.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserJourneyVisualization;
