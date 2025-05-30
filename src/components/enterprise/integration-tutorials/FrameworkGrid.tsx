
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Smartphone, Server, Settings } from 'lucide-react';

const FrameworkGrid: React.FC = () => {
  const frameworks = [
    {
      name: 'React',
      icon: Globe,
      description: 'Hook-based integration with React components',
      guide: 'View React Guide'
    },
    {
      name: 'Vue.js',
      icon: Globe,
      description: 'Composition API and directive support',
      guide: 'View Vue Guide'
    },
    {
      name: 'Angular',
      icon: Globe,
      description: 'Service and directive integration',
      guide: 'View Angular Guide'
    },
    {
      name: 'React Native',
      icon: Smartphone,
      description: 'Native mobile biometric capture',
      guide: 'View RN Guide'
    },
    {
      name: 'Node.js',
      icon: Server,
      description: 'Express middleware and validation',
      guide: 'View Node Guide'
    },
    {
      name: 'Custom',
      icon: Settings,
      description: 'REST API integration for any platform',
      guide: 'View API Docs'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {frameworks.map((framework) => {
        const Icon = framework.icon;
        return (
          <Card key={framework.name}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {framework.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{framework.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {framework.guide}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FrameworkGrid;
