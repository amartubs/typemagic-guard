
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Upload, Eye, Save, RefreshCw } from 'lucide-react';

interface WhiteLabelConfig {
  id?: string;
  user_id?: string;
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

const EnhancedWhiteLabelManager = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<WhiteLabelConfig>({
    primary_color: '#9b87f5',
    secondary_color: '#7E69AB',
    accent_color: '#9b87f5',
    hide_typemagic_branding: false
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (user) {
      loadConfig();
    }
  }, [user]);

  const loadConfig = async () => {
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
        applyWhiteLabelStyling(data);
      }
    } catch (error) {
      console.error('Error loading white label config:', error);
      toast({
        title: "Error",
        description: "Failed to load white label configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const configData = {
        user_id: user.id,
        ...config,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('white_label_configs')
        .upsert(configData, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "White label configuration saved successfully",
      });

      applyWhiteLabelStyling(config);
    } catch (error) {
      console.error('Error saving white label config:', error);
      toast({
        title: "Error",
        description: "Failed to save white label configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const applyWhiteLabelStyling = (config: WhiteLabelConfig) => {
    if (!previewMode) return;

    const root = document.documentElement;
    root.style.setProperty('--primary', config.primary_color);
    root.style.setProperty('--secondary', config.secondary_color);
    root.style.setProperty('--accent', config.accent_color);

    if (config.company_name) {
      document.title = `${config.company_name} - Biometric Authentication`;
    }

    if (config.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = config.favicon_url;
      }
    }

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

  const resetToDefaults = () => {
    setConfig({
      primary_color: '#9b87f5',
      secondary_color: '#7E69AB',
      accent_color: '#9b87f5',
      hide_typemagic_branding: false,
      company_name: '',
      logo_url: '',
      favicon_url: '',
      custom_domain: '',
      custom_css: '',
      footer_text: ''
    });
  };

  const handleColorChange = (colorType: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">White Label Configuration</h2>
          <p className="text-muted-foreground">
            Customize the appearance and branding of your application
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={saveConfig} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {previewMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Preview Mode Active</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Changes are being applied live. Save your configuration to make them permanent.
          </p>
        </div>
      )}

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={config.company_name || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  value={config.logo_url || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <Label htmlFor="favicon-url">Favicon URL</Label>
                <Input
                  id="favicon-url"
                  value={config.favicon_url || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, favicon_url: e.target.value }))}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>

              <div>
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input
                  id="footer-text"
                  value={config.footer_text || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, footer_text: e.target.value }))}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hide-branding">Hide TypeMagic Branding</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove "Powered by TypeMagic" branding
                  </p>
                </div>
                <Switch
                  id="hide-branding"
                  checked={config.hide_typemagic_branding}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, hide_typemagic_branding: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      placeholder="#9b87f5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={config.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      placeholder="#7E69AB"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={config.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      placeholder="#9b87f5"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Color Preview</h4>
                <div className="flex gap-4">
                  <div 
                    className="w-16 h-16 rounded border-2 border-gray-200"
                    style={{ backgroundColor: config.primary_color }}
                    title="Primary"
                  />
                  <div 
                    className="w-16 h-16 rounded border-2 border-gray-200"
                    style={{ backgroundColor: config.secondary_color }}
                    title="Secondary"
                  />
                  <div 
                    className="w-16 h-16 rounded border-2 border-gray-200"
                    style={{ backgroundColor: config.accent_color }}
                    title="Accent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input
                  id="custom-domain"
                  value={config.custom_domain || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, custom_domain: e.target.value }))}
                  placeholder="auth.yourcompany.com"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your own domain for a fully branded experience
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">DNS Configuration Required</h4>
                <p className="text-yellow-800 text-sm">
                  After entering your custom domain, you'll need to configure your DNS settings. 
                  Contact support for detailed instructions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  value={config.custom_css || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, custom_css: e.target.value }))}
                  placeholder="/* Add your custom CSS here */"
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Add custom CSS to further customize the appearance
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Warning</h4>
                <p className="text-red-800 text-sm">
                  Custom CSS can break the application if not properly tested. 
                  Use the preview mode to test changes before saving.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={resetToDefaults}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadConfig}>
            Reload
          </Button>
          <Button onClick={saveConfig} disabled={saving}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWhiteLabelManager;
