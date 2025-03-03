
import React, { useEffect, useState, useRef } from 'react';
import { KeystrokeCapture as KeystrokeService } from '@/lib/biometricAuth';
import { KeyTiming } from '@/lib/types';

interface KeystrokeVisualProps {
  keystroke: KeyTiming;
}

const KeystrokeVisual: React.FC<KeystrokeVisualProps> = ({ keystroke }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={`absolute h-2 w-2 rounded-full bg-primary/70 animate-keystroke-ripple ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      } transition-opacity duration-500`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );
};

interface KeystrokeCaptureProps {
  onCapture?: (timings: KeyTiming[]) => void;
  captureContext?: string;
  autoStart?: boolean;
  hideVisuals?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}

const KeystrokeCapture: React.FC<KeystrokeCaptureProps> = ({
  onCapture,
  captureContext = 'default',
  autoStart = true,
  hideVisuals = false,
  inputProps = {},
  className = '',
}) => {
  const [isActive, setIsActive] = useState(autoStart);
  const [keystrokes, setKeystrokes] = useState<KeyTiming[]>([]);
  const keystrokeServiceRef = useRef<KeystrokeService | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const keystrokeService = new KeystrokeService(captureContext);
    keystrokeServiceRef.current = keystrokeService;
    
    if (autoStart) {
      keystrokeService.startCapture();
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      keystrokeService.handleKeyDown(e);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isActive) return;
      keystrokeService.handleKeyUp(e);
      
      // Add keystroke for visualization
      const key = e.key;
      const newKeystroke: KeyTiming = {
        key,
        pressTime: Date.now() - 100, // Approximate
        releaseTime: Date.now(),
        duration: 100 // Approximate
      };
      
      setKeystrokes(prev => [...prev, newKeystroke]);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      
      if (keystrokeService && isActive) {
        const capturedData = keystrokeService.stopCapture();
        if (onCapture) {
          onCapture(capturedData);
        }
      }
    };
  }, [captureContext, autoStart, isActive, onCapture]);
  
  // Cleanup visualizations
  useEffect(() => {
    if (keystrokes.length > 15) {
      const timer = setTimeout(() => {
        setKeystrokes(prev => prev.slice(Math.max(prev.length - 15, 0)));
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [keystrokes]);
  
  const startCapture = () => {
    if (keystrokeServiceRef.current) {
      keystrokeServiceRef.current.startCapture();
      setIsActive(true);
    }
  };
  
  const stopCapture = () => {
    if (keystrokeServiceRef.current && isActive) {
      const capturedData = keystrokeServiceRef.current.stopCapture();
      setIsActive(false);
      if (onCapture) {
        onCapture(capturedData);
      }
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        className="w-full px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        placeholder="Type here to analyze your keystroke pattern..."
        {...inputProps}
        onFocus={() => !isActive && startCapture()}
        onBlur={() => isActive && stopCapture()}
      />
      
      {!hideVisuals && (
        <div 
          ref={visualizerRef}
          className="absolute inset-0 overflow-hidden pointer-events-none rounded-md"
        >
          {keystrokes.map((keystroke, index) => (
            <KeystrokeVisual key={`${index}-${keystroke.key}`} keystroke={keystroke} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KeystrokeCapture;
