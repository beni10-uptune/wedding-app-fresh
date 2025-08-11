/**
 * Sentry Error Tracking Configuration
 * 
 * To enable Sentry:
 * 1. Install dependencies: npm install @sentry/nextjs
 * 2. Add environment variables:
 *    - NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
 *    - SENTRY_ORG=your_org
 *    - SENTRY_PROJECT=your_project
 * 3. Run: npx @sentry/wizard@latest -i nextjs
 */

// Error tracking interface to abstract Sentry implementation
export interface ErrorTracker {
  captureException(error: Error, context?: Record<string, any>): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
  setUser(user: { id: string; email?: string; name?: string } | null): void;
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'debug' | 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }): void;
}

// Fallback error tracker for development/when Sentry not configured
class ConsoleErrorTracker implements ErrorTracker {
  captureException(error: Error, context?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', error, context);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (process.env.NODE_ENV === 'development') {
      const logFn = level === 'error' ? console.error : level === 'warning' ? console.warn : console.info;
      logFn('Message captured:', message);
    }
  }

  setUser(user: { id: string; email?: string; name?: string } | null): void {
    // No-op in console tracker
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'debug' | 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Breadcrumb:', breadcrumb);
    }
  }
}

// Export singleton instance
let errorTracker: ErrorTracker;

// Check if Sentry is available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // Sentry will be initialized by Next.js integration
  // This is a placeholder for when Sentry is installed
  errorTracker = new ConsoleErrorTracker();
} else {
  errorTracker = new ConsoleErrorTracker();
}

export { errorTracker };

// Helper functions for common error scenarios
export function trackApiError(endpoint: string, error: any, context?: Record<string, any>) {
  errorTracker.captureException(error instanceof Error ? error : new Error(String(error)), {
    endpoint,
    ...context
  });
}

export function trackUserAction(action: string, data?: Record<string, any>) {
  errorTracker.addBreadcrumb({
    message: action,
    category: 'user-action',
    data
  });
}

export function trackPaymentError(error: any, context?: Record<string, any>) {
  errorTracker.captureException(error instanceof Error ? error : new Error(String(error)), {
    category: 'payment',
    ...context
  });
}

export function trackAuthError(error: any, context?: Record<string, any>) {
  errorTracker.captureException(error instanceof Error ? error : new Error(String(error)), {
    category: 'authentication',
    ...context
  });
}