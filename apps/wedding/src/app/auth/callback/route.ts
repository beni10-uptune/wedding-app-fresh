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
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        // If no profile, this is a new user - create profile
        if (!profile) {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url
          })
        }
        
        // If logged in with Spotify, store the provider token
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.provider_token) {
          // Store Spotify access token for playlist creation
          await supabase.from('profiles').update({
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