
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DemoStepCardProps {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
}

const DemoStepCard: React.FC<DemoStepCardProps> = ({
  title,
  description,
  step,
  totalSteps,
  children
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline">Step {step} of {totalSteps}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default DemoStepCard;
