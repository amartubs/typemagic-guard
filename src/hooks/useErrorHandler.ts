
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { globalErrorHandler } from '@/lib/errorHandling/globalErrorHandler';

export const useErrorHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleError = useCallback((error: Error, context: string, showToast: boolean = true) => {
    globalErrorHandler.handleError(error, context, user?.id);

    if (showToast) {
      toast({
        title: "An error occurred",
        description: process.env.NODE_ENV === 'development' 
          ? error.message 
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [user?.id, toast]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context: string,
    showToast: boolean = true
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context, showToast);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};
