/**
 * Centralized logging utility for production-safe logging
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  private log(level: LogLevel, message: string, context?: LogContext) {
    // In production, we would send to a logging service
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString()
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
      
      switch (level) {
        case 'error':
          console.error(logMessage, context || '')
          break
        case 'warn':
          console.warn(logMessage, context || '')
          break
        case 'info':
          console.info(logMessage, context || '')
          break
        case 'debug':
          console.log(logMessage, context || '')
          break
      }
    } else {
      // In production, send to logging service
      // TODO: Integrate with logging service like Sentry, LogRocket, etc.
      // Example:
      // if (level === 'error' && window.Sentry) {
      //   window.Sentry.captureException(new Error(message), { extra: context })
      // }
    }
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for server-side error logging in API routes
export function logError(error: unknown, context?: LogContext) {
  if (error instanceof Error) {
    logger.error(error.message, {
      ...context,
      stack: error.stack,
      name: error.name
    })
  } else {
    logger.error('Unknown error', {
      ...context,
      error: String(error)
    })
  }
}