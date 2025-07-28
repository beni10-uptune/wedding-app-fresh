import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getTrendingSongs } from '@/lib/blog/api'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const songs = await getTrendingSongs(category, limit)
    
    return NextResponse.json({ songs })
  } catch (error) {
    logger.error('Error fetching trending songs:', { error })
    return NextResponse.json(
      { error: 'Failed to fetch trending songs' },
      { status: 500 }
    )
  }
}