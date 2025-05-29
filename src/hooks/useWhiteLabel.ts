
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface WhiteLabelConfig {
  id?: string;
  company_name?: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  custom_domain?: string;
  hide_typemagic_branding: boolean;
  custom_css?: string;
  footer_text?: string;
}

export const useWhiteLabel = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, [user]);

  const loadConfig = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('white_label_configs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setConfig(data);
      
      // Apply the configuration if it exists
      if (data) {
        applyWhiteLabelStyling(data);
      }
    } catch (error) {
      console.error('Error loading white label config:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyWhiteLabelStyling = (config: WhiteLabelConfig) => {
    // Update CSS custom properties for theming
    const root = document.documentElement;
    root.style.setProperty('--primary', config.primary_color);
    root.style.setProperty('--primary-foreground', '#ffffff');
    
    // Update document title if company name is provided
    if (config.company_name) {
      document.title = `${config.company_name} - Biometric Authentication`;
    }
    
    // Update favicon if provided
    if (config.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = config.favicon_url;
      }
    }

    // Apply custom CSS if provided
    if (config.custom_css) {
      let customStyleElement = document.getElementById('white-label-custom-css');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'white-label-custom-css';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = config.custom_css;
    }
  };

  return {
    config,
    loading,
    applyWhiteLabelStyling,
    refreshConfig: loadConfig,
  };
};
