
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator = () => {
  const { isOffline } = usePWA();
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (!isOffline && showReconnected === false) {
      setShowReconnected(true);
      // Hide the reconnected message after 3 seconds
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, showReconnected]);

  if (!isOffline && !showReconnected) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      {isOffline ? (
        <Alert className="w-auto shadow-lg border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center gap-2">
            <span className="text-orange-800">You're offline</span>
            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300">
              Limited functionality
            </Badge>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="w-auto shadow-lg border-green-200 bg-green-50 animate-fade-in">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Back online!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default OfflineIndicator;
