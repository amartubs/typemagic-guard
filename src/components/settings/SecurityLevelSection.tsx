
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface SecurityLevelSectionProps {
  formData: {
    security_level: 'low' | 'medium' | 'high' | 'very-high';
  };
  setFormData: (updater: (prev: any) => any) => void;
}

const SecurityLevelSection: React.FC<SecurityLevelSectionProps> = ({
  formData,
  setFormData,
}) => {
  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very-high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityLevelDescription = (level: string) => {
    switch (level) {
      case 'low': return 'Balanced security and usability';
      case 'medium': return 'Standard security recommended for most users';
      case 'high': return 'Enhanced security with stricter authentication';
      case 'very-high': return 'Maximum security with strict authentication';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Security Level
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['low', 'medium', 'high', 'very-high'] as const).map((level) => (
          <Card 
            key={level}
            className={`cursor-pointer transition-colors ${
              formData.security_level === level ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setFormData(prev => ({ ...prev, security_level: level }))}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={getSecurityLevelColor(level)}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Badge>
                {formData.security_level === level && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getSecurityLevelDescription(level)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecurityLevelSection;
