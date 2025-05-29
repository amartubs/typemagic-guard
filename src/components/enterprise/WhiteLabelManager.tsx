
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Palette, Upload, Globe, Eye } from 'lucide-react';

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

const WhiteLabelManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<WhiteLabelConfig>({
    primary_color: '#9b87f5',
    secondary_color: '#7E69AB',
    accent_color: '#9b87f5',
    hide_typemagic_branding: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWhiteLabelConfig();
  }, [user]);

  const loadWhiteLabelConfig = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('white_label_configs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Error loading white label config:', error);
      toast({
        title: "Error",
        description: "Failed to load white label configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveWhiteLabelConfig = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const configData = {
        user_id: user.id,
        ...config,
      };

      const { error } = config.id
        ? await supabase
            .from('white_label_configs')
            .update(configData)
            .eq('id', config.id)
        : await supabase
            .from('white_label_configs')
            .insert(configData);

      if (error) throw error;

      // Apply the configuration immediately
      applyWhiteLabelStyling(config);

      toast({
        title: "Success",
        description: "White label configuration saved successfully.",
      });

      // Reload to get the ID if it was a new config
      if (!config.id) {
        loadWhiteLabelConfig();
      }
    } catch (error) {
      console.error('Error saving white label config:', error);
      toast({
        title: "Error",
        description: "Failed to save white label configuration.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const applyWhiteLabelStyling = (config: WhiteLabelConfig) => {
    // Update CSS custom properties for theming
    const root = document.documentElement;
    root.style.setProperty('--primary', config.primary_color);
    root.style.setProperty('--primary-foreground', '#ffffff');
    
    // Update document title and favicon if provided
    if (config.company_name) {
      document.title = `${config.company_name} - Biometric Authentication`;
    }
    
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

  const previewChanges = () => {
    applyWhiteLabelStyling(config);
    toast({
      title: "Preview Applied",
      description: "Changes have been applied for preview. Save to make them permanent.",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="animate-pulse">Loading white label configuration...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            White-Label Configuration
          </CardTitle>
          <CardDescription>
            Customize the branding and appearance of your TypeMagic Guard implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Branding */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={config.company_name || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom_domain">Custom Domain</Label>
                <Input
                  id="custom_domain"
                  value={config.custom_domain || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, custom_domain: e.target.value }))}
                  placeholder="auth.yourcompany.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Logo and Assets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Logo and Assets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={config.logo_url || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://yourcompany.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon_url">Favicon URL</Label>
                <Input
                  id="favicon_url"
                  value={config.favicon_url || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, favicon_url: e.target.value }))}
                  placeholder="https://yourcompany.com/favicon.ico"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Color Scheme */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Color Scheme</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={config.primary_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.primary_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, primary_color: e.target.value }))}
                    placeholder="#9b87f5"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={config.secondary_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.secondary_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondary_color: e.target.value }))}
                    placeholder="#7E69AB"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent_color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent_color"
                    type="color"
                    value={config.accent_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, accent_color: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={config.accent_color}
                    onChange={(e) => setConfig(prev => ({ ...prev, accent_color: e.target.value }))}
                    placeholder="#9b87f5"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Customization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Customization</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hide TypeMagic Guard Branding</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove all TypeMagic Guard logos and branding from the interface
                  </p>
                </div>
                <Switch
                  checked={config.hide_typemagic_branding}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hide_typemagic_branding: checked }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footer_text">Custom Footer Text</Label>
                <Input
                  id="footer_text"
                  value={config.footer_text || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, footer_text: e.target.value }))}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom_css">Custom CSS</Label>
                <Textarea
                  id="custom_css"
                  value={config.custom_css || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, custom_css: e.target.value }))}
                  placeholder="/* Add your custom CSS here */
.custom-button {
  background: linear-gradient(45deg, #9b87f5, #7E69AB);
  border-radius: 8px;
}"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={previewChanges} variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview Changes
            </Button>
            <Button onClick={saveWhiteLabelConfig} disabled={saving} className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhiteLabelManager;
