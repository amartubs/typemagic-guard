
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface SecurityOverviewSectionProps {
  securityLevel: 'low' | 'medium' | 'high' | 'very-high';
}

const SecurityOverviewSection: React.FC<SecurityOverviewSectionProps> = ({
  securityLevel,
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

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5" />
        <div>
          <p className="font-medium">Current Security Level</p>
          <p className="text-sm text-muted-foreground">Overall system security configuration</p>
        </div>
      </div>
      <Badge className={getSecurityLevelColor(securityLevel)}>
        {securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)}
      </Badge>
    </div>
  );
};

export default SecurityOverviewSection;
