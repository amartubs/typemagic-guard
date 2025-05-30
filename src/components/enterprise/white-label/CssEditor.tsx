
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, RotateCcw, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CssEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CssEditor: React.FC<CssEditorProps> = ({ value, onChange }) => {
  const { toast } = useToast();
  const [showTemplates, setShowTemplates] = useState(false);

  const cssTemplates = [
    {
      name: 'Rounded Buttons',
      css: `.btn-custom {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
    },
    {
      name: 'Gradient Background',
      css: `.gradient-bg {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}`,
    },
    {
      name: 'Custom Cards',
      css: `.custom-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}`,
    },
    {
      name: 'Animated Hover',
      css: `.hover-effect {
  transition: all 0.3s ease;
}

.hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}`,
    },
  ];

  const handleCopyTemplate = (css: string) => {
    navigator.clipboard.writeText(css);
    toast({
      title: "Copied!",
      description: "CSS template copied to clipboard.",
    });
  };

  const handleReset = () => {
    onChange('');
    toast({
      title: "Reset",
      description: "CSS editor has been cleared.",
    });
  };

  const insertTemplate = (css: string) => {
    const newValue = value ? `${value}\n\n${css}` : css;
    onChange(newValue);
    setShowTemplates(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom CSS Editor
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <Palette className="h-4 w-4" />
              Templates
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showTemplates && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium col-span-full mb-2">CSS Templates</h4>
            {cssTemplates.map((template, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {template.name}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyTemplate(template.css)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertTemplate(template.css)}
                      className="h-6 w-6 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                  <code>{template.css}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">CSS Rules</label>
            <div className="text-xs text-muted-foreground">
              Use CSS variables: --primary, --secondary, --accent
            </div>
          </div>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/* Add your custom CSS here */
.custom-button {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.custom-button:hover {
  transform: scale(1.05);
}"
            rows={12}
            className="font-mono text-sm resize-none"
          />
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Available CSS Variables:</strong></p>
          <p>• --primary: Primary brand color</p>
          <p>• --secondary: Secondary brand color</p>
          <p>• --accent: Accent color</p>
          <p>• --background: Background color</p>
          <p>• --foreground: Text color</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CssEditor;
