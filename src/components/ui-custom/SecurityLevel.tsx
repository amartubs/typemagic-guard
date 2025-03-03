
import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { SecurityLevel } from '@/lib/types';

interface SecurityLevelIndicatorProps {
  level: SecurityLevel;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SecurityLevelIndicator: React.FC<SecurityLevelIndicatorProps> = ({
  level,
  showText = true,
  size = 'md',
  className = '',
}) => {
  const getLevelDetails = () => {
    switch (level) {
      case 'low':
        return {
          icon: ShieldAlert,
          color: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-950/30',
          borderColor: 'border-red-200 dark:border-red-900/30',
          label: 'Low Security',
          description: 'Basic protection with minimal verification'
        };
      case 'medium':
        return {
          icon: Shield,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-950/30',
          borderColor: 'border-yellow-200 dark:border-yellow-900/30',
          label: 'Medium Security',
          description: 'Standard protection with biometric validation'
        };
      case 'high':
        return {
          icon: ShieldCheck,
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-950/30',
          borderColor: 'border-green-200 dark:border-green-900/30',
          label: 'High Security',
          description: 'Advanced protection with strict biometric requirements'
        };
      case 'very-high':
        return {
          icon: ShieldCheck,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-950/30',
          borderColor: 'border-blue-200 dark:border-blue-900/30',
          label: 'Very High Security',
          description: 'Maximum protection with multi-factor authentication'
        };
      default:
        return {
          icon: ShieldX,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          borderColor: 'border-gray-200 dark:border-gray-800/30',
          label: 'Unknown',
          description: 'Security level not determined'
        };
    }
  };
  
  const details = getLevelDetails();
  const IconComponent = details.icon;
  
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div 
      className={`flex items-center gap-2 rounded-lg ${sizeClasses[size]} ${details.bgColor} ${details.borderColor} border ${className}`}
    >
      <IconComponent className={`${details.color} ${iconSizes[size]}`} />
      {showText && (
        <span className={`font-medium ${details.color}`}>
          {details.label}
        </span>
      )}
    </div>
  );
};

interface SecurityLevelSliderProps {
  value: number; // 0-100
  showLabels?: boolean;
  className?: string;
}

const SecurityLevelSlider: React.FC<SecurityLevelSliderProps> = ({
  value,
  showLabels = true,
  className = '',
}) => {
  // Map value to security level
  const getSecurityLevel = (val: number): SecurityLevel => {
    if (val < 30) return 'low';
    if (val < 60) return 'medium';
    if (val < 85) return 'high';
    return 'very-high';
  };
  
  const securityLevel = getSecurityLevel(value);
  
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Very High</span>
        </div>
      )}
      
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full security-gradient rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      
      {showLabels && (
        <div className="pt-1 flex justify-end">
          <SecurityLevelIndicator level={securityLevel} size="sm" />
        </div>
      )}
    </div>
  );
};

export { SecurityLevelIndicator, SecurityLevelSlider };
