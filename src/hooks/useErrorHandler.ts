
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { globalErrorHandler } from '@/lib/errorHandling/globalErrorHandler';

export const useErrorHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleError = useCallback((error: Error, context: string, showToast: boolean = true) => {
    console.error(`Error in ${context}:`, error);
    
    globalErrorHandler.handleError(error, context, user?.id);

    if (showToast) {
      // Don't show RLS or policy errors to users, these are internal
      const isInternalError = error.message.includes('policy') || 
                             error.message.includes('RLS') ||
                             error.message.includes('row-level security');
      
      toast({
        title: "An error occurred",
        description: process.env.NODE_ENV === 'development' && !isInternalError
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

  const handleSupabaseError = useCallback((error: any, context: string) => {
    console.error(`Supabase error in ${context}:`, error);
    
    // Handle specific Supabase errors
    if (error?.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    
    if (error?.code === '42501') {
      // Insufficient privilege (RLS)
      console.warn('RLS policy violation:', error);
      return null;
    }
    
    // For other errors, use standard error handling
    handleError(new Error(error.message || 'Database error'), context, true);
    return null;
  }, [handleError]);

  return { handleError, handleAsyncError, handleSupabaseError };
};
