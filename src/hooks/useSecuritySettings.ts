
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SecuritySettings } from '@/types/securitySettings';

export const useSecuritySettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [formData, setFormData] = useState({
    min_confidence_threshold: 65,
    learning_period: 5,
    anomaly_detection_sensitivity: 70,
    max_failed_attempts: 5,
    security_level: 'medium' as 'low' | 'medium' | 'high' | 'very-high',
    enforce_two_factor: false,
  });

  const fetchSecuritySettings = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching security settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          min_confidence_threshold: data.min_confidence_threshold,
          learning_period: data.learning_period,
          anomaly_detection_sensitivity: data.anomaly_detection_sensitivity,
          max_failed_attempts: data.max_failed_attempts,
          security_level: data.security_level,
          enforce_two_factor: data.enforce_two_factor,
        });
      }
    } catch (err) {
      console.error('Error in fetchSecuritySettings:', err);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving security settings:', error);
        toast({
          title: "Error",
          description: "Failed to save security settings",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Security settings saved successfully",
      });
      
      await fetchSecuritySettings();
    } catch (err) {
      console.error('Error in handleSaveSettings:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setFormData({
      min_confidence_threshold: 65,
      learning_period: 5,
      anomaly_detection_sensitivity: 70,
      max_failed_attempts: 5,
      security_level: 'medium',
      enforce_two_factor: false,
    });
  };

  useEffect(() => {
    fetchSecuritySettings();
  }, [user?.id]);

  return {
    loading,
    settings,
    formData,
    setFormData,
    handleSaveSettings,
    resetToDefaults,
  };
};
