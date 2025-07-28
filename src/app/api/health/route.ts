import { NextResponse } from 'next/server'
import { validateEnv } from '@/lib/env-validation'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const envValidation = validateEnv()
    
    // Log warnings but don't fail health check
    envValidation.warnings.forEach(warning => {
      logger.warn('Environment warning:', { warning })
    })

    if (!envValidation.isValid) {
      logger.error('Missing environment variables:', { 
        missingVars: envValidation.missingVars 
      })
      
      return NextResponse.json({
        status: 'unhealthy',
        errors: {
          missingEnvVars: envValidation.missingVars,
          warnings: envValidation.warnings
        }
      }, { status: 503 })
    }

    return NextResponse.json({
      status: 'healthy',
      warnings: envValidation.warnings,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Health check failed:', { error })
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed'
    }, { status: 500 })
  }
}