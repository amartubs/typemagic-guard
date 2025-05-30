
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import WhiteLabelBranding from '@/components/layout/WhiteLabelBranding';

interface LivePreviewProps {
  config: any;
  onApplyPreview: () => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({ config, onApplyPreview }) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getPreviewStyles = () => ({
    '--primary': config.primary_color,
    '--secondary': config.secondary_color,
    '--accent': config.accent_color,
  } as React.CSSProperties);

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'w-80 h-96';
      case 'tablet': return 'w-96 h-80';
      default: return 'w-full h-96';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className={`border rounded-lg overflow-hidden bg-background ${getViewportClass()}`}>
            <div 
              className="h-full p-6 space-y-4"
              style={getPreviewStyles()}
            >
              {/* Mock header */}
              <div className="flex items-center justify-between border-b pb-4">
                <WhiteLabelBranding />
                <div className="flex gap-2">
                  <div className="w-16 h-8 bg-primary rounded"></div>
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                </div>
              </div>
              
              {/* Mock content */}
              <div className="space-y-3">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-primary rounded w-32"></div>
              </div>
              
              {/* Mock cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-card border rounded p-3">
                  <div className="h-3 bg-accent rounded w-full mb-2"></div>
                  <div className="h-2 bg-muted rounded w-2/3"></div>
                </div>
                <div className="h-20 bg-card border rounded p-3">
                  <div className="h-3 bg-secondary rounded w-full mb-2"></div>
                  <div className="h-2 bg-muted rounded w-2/3"></div>
                </div>
              </div>

              {/* Custom footer */}
              {config.footer_text && (
                <div className="border-t pt-4 mt-auto">
                  <p className="text-xs text-muted-foreground text-center">
                    {config.footer_text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button onClick={onApplyPreview} variant="outline" size="sm">
            Apply Preview to Current Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;
