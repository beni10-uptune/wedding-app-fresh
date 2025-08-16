'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/builder'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

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

  const handleOAuthLogin = async (provider: 'google') => {
    setLoadingProvider(provider)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`
        }
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoadingProvider(null)
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

      // Show success state instead of alert
      setError(null)
      alert('Check your email for the magic link!')
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-white/70 text-lg">Continue building your perfect playlist</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-200">{error}</span>
            </div>
          )}

          {/* Google Sign In - Prominent */}
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading || loadingProvider !== null}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === 'google' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/50">or sign in with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/80">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-11 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-11 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-400 focus:ring-offset-0 transition-colors"
                />
                <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                  Remember me
                </span>
              </label>
              
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || loadingProvider !== null}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Magic Link Option */}
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading || loadingProvider !== null}
              className="w-full text-center text-sm text-purple-300 hover:text-purple-200 transition-colors py-2"
            >
              Prefer a magic link? <span className="underline">Send one to your email</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70">
              New to our platform?{' '}
              <Link 
                href={`/auth/signup${redirectTo ? `?redirectTo=${redirectTo}` : ''}`}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Continue as Guest Option */}
        {redirectTo === '/builder' && (
          <div className="mt-6 text-center">
            <Link
              href="/builder"
              className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group"
            >
              <span>Continue as guest</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
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