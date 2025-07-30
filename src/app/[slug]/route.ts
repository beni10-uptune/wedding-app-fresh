import { NextRequest, NextResponse } from 'next/server'
import { getWeddingBySlug } from '@/lib/slug-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  
  try {
    // Look up wedding by slug
    const wedding = await getWeddingBySlug(slug)
    
    if (!wedding) {
      // Redirect to 404 or home page if wedding not found
      return NextResponse.redirect(new URL('/404', request.url))
    }
    
    // Redirect to the guest join page with the wedding ID
    return NextResponse.redirect(new URL(`/join/${wedding.id}`, request.url))
  } catch (error) {
    console.error('Error resolving wedding slug:', error)
    return NextResponse.redirect(new URL('/404', request.url))
  }
}