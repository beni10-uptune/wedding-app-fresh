'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import { FaSpotify, FaApple } from 'react-icons/fa'
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/builder'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to intended page
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'spotify' | 'apple') => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
          ...(provider === 'spotify' && {
            scopes: 'user-read-email playlist-modify-public playlist-modify-private user-read-private'
          })
        }
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        }
      })

      if (error) throw error

      alert('Check your email for the magic link!')
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/60">Sign in to continue building your perfect wedding playlist</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* OAuth Login Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthLogin('spotify')}
              disabled={loading}
              className="w-full btn-spotify flex items-center justify-center gap-3 py-3"
            >
              <FaSpotify className="w-5 h-5" />
              <span>Continue with Spotify</span>
            </button>

            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full btn-google flex items-center justify-center gap-3 py-3"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleOAuthLogin('apple')}
              disabled={loading}
              className="w-full btn-apple flex items-center justify-center gap-3 py-3"
            >
              <FaApple className="w-5 h-5" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-purple-900/50 px-2 text-white/60">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="/auth/forgot-password" className="text-purple-300 hover:text-purple-200">
                Forgot password?
              </Link>
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="text-purple-300 hover:text-purple-200"
              >
                Send magic link
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-purple-300 hover:text-purple-200 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .btn-spotify {
          background: #1DB954;
          color: white;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-spotify:hover {
          background: #1ed760;
          transform: translateY(-1px);
        }
        .btn-google {
          background: white;
          color: #3c4043;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-google:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
        }
        .btn-apple {
          background: black;
          color: white;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-apple:hover {
          background: #1a1a1a;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}