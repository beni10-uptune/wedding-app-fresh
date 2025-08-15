'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import { FaSpotify, FaApple } from 'react-icons/fa'
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/builder`
        }
      })

      if (error) throw error

      // Show success message
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async (provider: 'google' | 'spotify' | 'apple') => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/create-wedding`,
          ...(provider === 'spotify' && {
            scopes: 'user-read-email playlist-modify-public playlist-modify-private user-read-private'
          })
        }
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || `Failed to sign up with ${provider}`)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="glass-card rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email!</h2>
            <p className="text-white/80 mb-6">
              We've sent you a confirmation email to <strong>{email}</strong>.
              Click the link in the email to verify your account.
            </p>
            <Link href="/auth/login" className="btn-primary inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-white/60">Start building your perfect wedding playlist</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* OAuth Signup Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthSignup('spotify')}
              disabled={loading}
              className="w-full btn-spotify flex items-center justify-center gap-3 py-3"
            >
              <FaSpotify className="w-5 h-5" />
              <span>Sign up with Spotify</span>
            </button>

            <button
              onClick={() => handleOAuthSignup('google')}
              disabled={loading}
              className="w-full btn-google flex items-center justify-center gap-3 py-3"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>

            <button
              onClick={() => handleOAuthSignup('apple')}
              disabled={loading}
              className="w-full btn-apple flex items-center justify-center gap-3 py-3"
            >
              <FaApple className="w-5 h-5" />
              <span>Sign up with Apple</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-purple-900/50 px-2 text-white/60">Or sign up with email</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  className="input-field pl-10"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-white/40 mt-1 ml-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-purple-300 hover:text-purple-200 font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-center text-white/40 text-xs mt-4">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
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