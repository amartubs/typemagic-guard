
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { toast } from '@/hooks/use-toast';

const InstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      toast({
        title: "App Installed!",
        description: "Shoale has been added to your home screen",
      });
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Store dismissal in localStorage
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if dismissed or not installable
  if (!isInstallable || dismissed) return null;

  // Check if previously dismissed
  if (localStorage.getItem('pwa-install-dismissed')) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 shadow-lg border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Install Shoale</CardTitle>
              <CardDescription className="text-xs">
                Add to home screen for quick access
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            <Smartphone className="h-3 w-3 mr-1" />
            Mobile App
          </Badge>
          <Badge variant="outline" className="text-xs">
            Offline Ready
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInstall} size="sm" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Install
          </Button>
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallPrompt;
