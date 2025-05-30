
import React, { useCallback, useRef, useState } from 'react';
import { KeyTiming } from '@/lib/types';
import { BiometricProcessor } from '@/lib/biometric/biometricProcessor';
import { useAuth } from '@/contexts/auth';
import { RateLimiter } from '@/lib/security/rateLimiter';
import { AuditLogger } from '@/lib/security/auditLogger';

interface Props {
  onResult?: (result: { success: boolean; confidence: number }) => void;
  enabled?: boolean;
  context?: string;
  children: React.ReactNode;
}

export const RealTimeKeystrokeCapture: React.FC<Props> = ({
  onResult,
  enabled = true,
  context = 'authentication',
  children
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const keystrokeBuffer = useRef<KeyTiming[]>([]);
  const pressedKeys = useRef<Map<string, number>>(new Map());

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !user || isProcessing) return;

    const key = event.key;
    const pressTime = Date.now();
    
    // Ignore modifier keys and function keys
    if (key.length > 1 && !['Backspace', 'Enter', 'Space', 'Tab'].includes(key)) {
      return;
    }

    pressedKeys.current.set(key, pressTime);
  }, [enabled, user, isProcessing]);

  const handleKeyUp = useCallback(async (event: KeyboardEvent) => {
    if (!enabled || !user || isProcessing) return;

    const key = event.key;
    const releaseTime = Date.now();
    const pressTime = pressedKeys.current.get(key);

    if (!pressTime) return;

    pressedKeys.current.delete(key);

    const duration = releaseTime - pressTime;
    const keyTiming: KeyTiming = {
      key,
      pressTime,
      releaseTime,
      duration
    };

    keystrokeBuffer.current.push(keyTiming);

    // Process when we have enough keystrokes (minimum 5 for analysis)
    if (keystrokeBuffer.current.length >= 5) {
      await processKeystrokeData();
    }
  }, [enabled, user, isProcessing]);

  const processKeystrokeData = useCallback(async () => {
    if (!user || keystrokeBuffer.current.length === 0) return;

    // Check rate limiting
    if (!RateLimiter.isAllowed(user.id, 'biometric')) {
      console.warn('Biometric processing rate limit exceeded');
      return;
    }

    setIsProcessing(true);

    try {
      const timings = [...keystrokeBuffer.current];
      keystrokeBuffer.current = []; // Clear buffer

      const result = await BiometricProcessor.processKeystrokeData(
        timings,
        user.id,
        context
      );

      // Log the biometric analysis
      await AuditLogger.logUserAction('biometric_analysis', user.id, {
        context,
        confidence: result.confidenceScore,
        success: result.success
      });

      onResult?.({
        success: result.success,
        confidence: result.confidenceScore
      });

    } catch (error) {
      console.error('Error processing keystroke data:', error);
      await AuditLogger.logSecurityEvent('biometric_processing_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: user.id
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, context, onResult]);

  React.useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, enabled]);

  return <>{children}</>;
};
