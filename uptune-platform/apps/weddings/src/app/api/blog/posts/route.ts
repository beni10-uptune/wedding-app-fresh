import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog/api'
import { logError } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 10

    const posts = await getBlogPosts({
      category,
      tag,
      limit,
      status: 'published',
    })

    return NextResponse.json({ posts })
  } catch (error) {
    logError(error, { context: 'Error fetching blog posts' })
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}