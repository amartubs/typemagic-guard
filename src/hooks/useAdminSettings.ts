
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminSettings {
  [key: string]: any;
}

export const useAdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AdminSettings>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert array to object
      const settingsObj = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as AdminSettings) || {};

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error loading admin settings:', error);
      toast({
        title: "Error",
        description: "Failed to load admin settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          user_id: user.id,
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,setting_key' });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      return true;
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: "Error",
        description: `Failed to save ${key}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const saveAllSettings = async (newSettings: AdminSettings) => {
    if (!user) return false;

    setSaving(true);
    try {
      const settingsArray = Object.entries(newSettings).map(([key, value]) => ({
        user_id: user.id,
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('admin_settings')
        .upsert(settingsArray, { onConflict: 'user_id,setting_key' });

      if (error) throw error;

      setSettings(newSettings);
      toast({
        title: "Success",
        description: "All admin settings saved successfully",
      });
      return true;
    } catch (error) {
      console.error('Error saving all settings:', error);
      toast({
        title: "Error",
        description: "Failed to save admin settings",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] ?? defaultValue;
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  return {
    settings,
    loading,
    saving,
    loadSettings,
    saveSetting,
    saveAllSettings,
    getSetting,
    updateSetting
  };
};
