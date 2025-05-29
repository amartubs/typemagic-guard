
import React from 'react';
import { Shield } from 'lucide-react';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';

interface WhiteLabelBrandingProps {
  className?: string;
  showIcon?: boolean;
}

const WhiteLabelBranding = ({ className = "", showIcon = true }: WhiteLabelBrandingProps) => {
  const { config } = useWhiteLabel();

  // If white label config exists and branding is hidden, return null
  if (config?.hide_typemagic_branding) {
    return config.company_name ? (
      <div className={`flex items-center gap-2 ${className}`}>
        {config.logo_url ? (
          <img src={config.logo_url} alt={config.company_name} className="h-6 w-auto" />
        ) : (
          showIcon && <Shield className="h-6 w-6 text-primary" />
        )}
        <span className="font-bold text-lg">{config.company_name}</span>
      </div>
    ) : null;
  }

  // Show TypeMagic Guard branding or custom company name
  const displayName = config?.company_name || 'TypeMagic Guard';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {config?.logo_url ? (
        <img src={config.logo_url} alt={displayName} className="h-6 w-auto" />
      ) : (
        showIcon && <Shield className="h-6 w-6 text-primary" />
      )}
      <span className="font-bold text-lg">{displayName}</span>
    </div>
  );
};

export default WhiteLabelBranding;
