
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: Array<{
    error: Error;
    context: string;
    timestamp: number;
    userId?: string;
  }> = [];

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  handleError(error: Error, context: string, userId?: string) {
    const errorInfo = {
      error,
      context,
      timestamp: Date.now(),
      userId
    };

    this.errorQueue.push(errorInfo);
    this.logError(errorInfo);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(errorInfo);
    }
  }

  private logError(errorInfo: any) {
    console.error(`[${new Date(errorInfo.timestamp).toISOString()}] ${errorInfo.context}:`, {
      message: errorInfo.error.message,
      stack: errorInfo.error.stack,
      userId: errorInfo.userId
    });
  }

  private async sendToMonitoring(errorInfo: any) {
    try {
      // This would integrate with a service like Sentry in production
      console.log('Would send to monitoring service:', errorInfo);
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }

  getErrorHistory(): Array<any> {
    return [...this.errorQueue];
  }

  clearErrors() {
    this.errorQueue = [];
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
