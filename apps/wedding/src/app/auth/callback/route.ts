import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/builder'

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user data to check if this is a new user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Track wedding app usage for multi-app platform
        await supabase.rpc('track_app_usage', { p_app_name: 'wedding' })
        
        // If logged in with Spotify, store the provider token
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.provider_token && session.provider_token.startsWith('spotify')) {
          // Store Spotify access token for playlist creation
          await supabase.from('profiles').update({
            spotify_connected: true,
            spotify_refresh_token: session.provider_refresh_token
          }).eq('id', user.id)
        }
      }
      
      // Redirect to the intended page
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Return to login with error
  return NextResponse.redirect(new URL('/auth/login?error=auth_failed', requestUrl.origin))
}