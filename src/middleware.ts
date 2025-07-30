import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Check if this is a wedding subdomain request
  const isWeddingSubdomain = hostname.startsWith('weddings.') || 
                            hostname === 'weddings.uptune.xyz' ||
                            (process.env.NODE_ENV === 'development' && hostname.includes('localhost'))
  
  // If on wedding subdomain and path is just a slug (not /join/*, /api/*, etc.)
  if (isWeddingSubdomain && url.pathname !== '/' && !url.pathname.includes('/') && !url.pathname.startsWith('/_next')) {
    // This is likely a wedding slug, keep it as is
    // The [slug] route will handle the redirect to /join/[id]
    return NextResponse.next()
  }
  
  // For non-wedding subdomains, continue normally
  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}