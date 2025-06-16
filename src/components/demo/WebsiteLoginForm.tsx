
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe } from 'lucide-react';
import ConfidenceScoreAnimation from './ConfidenceScoreAnimation';
import KeystrokeVisualizer from './KeystrokeVisualizer';
import { KeyTiming } from '@/lib/types';

interface WebsiteLoginFormProps {
  typingInput: string;
  onTypingChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  confidenceScore: number;
  keystrokes: KeyTiming[];
}

const WebsiteLoginForm: React.FC<WebsiteLoginFormProps> = ({
  typingInput,
  onTypingChange,
  onKeyDown,
  isTyping,
  confidenceScore,
  keystrokes
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-2 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">MyBank - Secure Login</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <Input
              type="email"
              placeholder="user@example.com"
              className="w-full"
              defaultValue="john.doe@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              placeholder="Type your password here..."
              value={typingInput}
              onChange={(e) => onTypingChange(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full"
            />
            {isTyping && (
              <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Biometric verification active (invisible to user)</span>
              </div>
            )}
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Sign In Securely
          </Button>
        </div>
      </div>
      
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">What Users See</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Users see a completely normal login form. They type their password as usual. 
            There are no extra steps, downloads, or changes to their experience.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConfidenceScoreAnimation 
          score={confidenceScore}
          isUpdating={isTyping}
          label="Developer Dashboard View"
        />
        <KeystrokeVisualizer 
          keystrokes={keystrokes}
          isActive={isTyping}
        />
      </div>
    </div>
  );
};

export default WebsiteLoginForm;
