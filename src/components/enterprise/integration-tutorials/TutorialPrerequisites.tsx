
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface TutorialPrerequisitesProps {
  prerequisites: string[];
}

const TutorialPrerequisites: React.FC<TutorialPrerequisitesProps> = ({ prerequisites }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Before You Begin</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {prerequisites.map((prereq, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{prereq}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TutorialPrerequisites;
