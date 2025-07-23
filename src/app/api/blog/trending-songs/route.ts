import { NextResponse } from 'next/server'
import { getTrendingSongs } from '@/lib/blog/api'

export async function GET() {
  try {
    const songs = await getTrendingSongs(10)
    
    return NextResponse.json({ songs })
  } catch (error) {
    console.error('Error fetching trending songs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending songs' },
      { status: 500 }
    )
  }
}