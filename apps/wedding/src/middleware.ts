import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
  
  // Create Supabase client for auth checks
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes that require authentication
  const protectedPaths = ['/builder', '/wedding', '/settings', '/profile']
  const authPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password']
  
  const path = request.nextUrl.pathname
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))
  const isAuthPath = authPaths.some(p => path.startsWith(p))

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to builder if accessing auth routes while logged in
  if (isAuthPath && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/builder'
    return NextResponse.redirect(redirectUrl)
  }
  
  return supabaseResponse
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