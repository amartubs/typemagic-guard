
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe, Smartphone, Server, Users, Webhook } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: string;
  duration: string;
  category: string;
}

interface TutorialListProps {
  selectedTutorial: string;
  onTutorialSelect: (id: string) => void;
}

const TutorialList: React.FC<TutorialListProps> = ({ selectedTutorial, onTutorialSelect }) => {
  const tutorials: Tutorial[] = [
    {
      id: 'web-app',
      title: 'Web Application Integration',
      description: 'Complete guide for React, Vue, Angular applications',
      icon: Globe,
      difficulty: 'Beginner',
      duration: '15 min',
      category: 'Frontend'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Integration',
      description: 'React Native and mobile web implementation',
      icon: Smartphone,
      difficulty: 'Intermediate',
      duration: '25 min',
      category: 'Mobile'
    },
    {
      id: 'backend-api',
      title: 'Backend API Integration',
      description: 'Server-side validation and user management',
      icon: Server,
      difficulty: 'Intermediate',
      duration: '20 min',
      category: 'Backend'
    },
    {
      id: 'enterprise',
      title: 'Enterprise SSO Integration',
      description: 'SAML and OAuth integration patterns',
      icon: Users,
      difficulty: 'Advanced',
      duration: '35 min',
      category: 'Enterprise'
    },
    {
      id: 'webhooks',
      title: 'Webhook Configuration',
      description: 'Real-time event notifications and callbacks',
      icon: Webhook,
      difficulty: 'Intermediate',
      duration: '20 min',
      category: 'Integration'
    }
  ];

  return (
    <div className="space-y-2">
      {tutorials.map((tutorial) => {
        const Icon = tutorial.icon;
        return (
          <Card 
            key={tutorial.id}
            className={`cursor-pointer transition-colors ${
              selectedTutorial === tutorial.id ? 'bg-primary/5 border-primary' : ''
            }`}
            onClick={() => onTutorialSelect(tutorial.id)}
          >
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">{tutorial.category}</Badge>
                  <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : 
                               tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {tutorial.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {tutorial.duration}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TutorialList;
