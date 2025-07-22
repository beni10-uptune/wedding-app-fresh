'use client'

import { ArrowRight, Heart, Music, Users, CheckCircle, Play, Sparkles, Download, Zap, Shield, Star, Gift, Calendar, PartyPopper, ChevronRight, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP')

  // Auto-detect currency
  useEffect(() => {
    const locale = navigator.language || 'en-GB'
    if (locale.includes('US')) setSelectedCurrency('USD')
    else if (locale.includes('DE') || locale.includes('FR') || locale.includes('IT') || locale.includes('ES')) setSelectedCurrency('EUR')
    else setSelectedCurrency('GBP')
  }, [])

  const currencySymbols = {
    GBP: '£',
    USD: '$',
    EUR: '€'
  }

  const currencyAmount = 25 // Same price for all currencies for simplicity
  
  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-purple-600/10 animate-spin-slow"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-50 glass-darker border-b border-white/10">
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">UpTune</h1>
                  <p className="text-xs text-purple-400">for Weddings</p>
                </div>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
              <Link href="#testimonials" className="text-white/70 hover:text-white transition-colors">Love Stories</Link>
              <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
            </nav>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors">Log In</Link>
              <Link href="/auth/signup" className="btn-primary">
                Try It Free
                <Heart className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 glass-darker p-6">
            <nav className="flex flex-col gap-4 mt-16">
              <Link href="#features" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#testimonials" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Love Stories</Link>
              <Link href="#pricing" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <hr className="border-white/10" />
              <Link href="/auth/login" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link href="/auth/signup" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                Try It Free
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="section relative z-10 pt-20 pb-16">
        <div className="container-max text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              The Wedding Music App<br />
              <span className="gradient-text">Your Guests Will Love</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Finally, a simple way to build your perfect wedding soundtrack. <br className="hidden md:block" />
              Collaborate with guests, organize by moment, and hand your DJ exactly what they need.
            </p>

            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Users className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Guest Collaboration</h3>
                <p className="text-white/70 text-sm">Share a link. Guests suggest songs. You curate the perfect mix.</p>
              </div>
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Calendar className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Organized by Moment</h3>
                <p className="text-white/70 text-sm">From processional to last dance - every moment gets its perfect song.</p>
              </div>
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Download className="w-10 h-10 text-green-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">DJ-Ready Export</h3>
                <p className="text-white/70 text-sm">One click creates everything your DJ needs. No spreadsheets required.</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 group">
                Try It Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="btn-glass text-lg px-8 py-4">
                <Play className="w-5 h-5" />
                See How It Works
              </Link>
            </div>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/60 pt-8">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Setup in 5 minutes
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Your data is private
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Made for real weddings
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              The Wedding Music Struggle is Real
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              You know the music matters. But where do you even start?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">😩</div>
              <h3 className="text-xl font-bold mb-3">The Spreadsheet Nightmare</h3>
              <p className="text-white/70">
                Managing song suggestions in emails, texts, and random conversations. 
                Trying to organize everything in a spreadsheet that your DJ can actually use. 
                It's overwhelming.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">😓</div>
              <h3 className="text-xl font-bold mb-3">The Pressure is Real</h3>
              <p className="text-white/70">
                Will grandma hate the music? Will the dance floor be empty? 
                How do you balance what you love with what works for everyone? 
                The stress is keeping you up at night.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-3">Time You Don't Have</h3>
              <p className="text-white/70">
                Hours researching songs for each moment. Endless Spotify scrolling. 
                And you still don't know if the flow will work. 
                You have a wedding to plan!
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">💔</div>
              <h3 className="text-xl font-bold mb-3">FOMO on Guest Input</h3>
              <p className="text-white/70">
                Your guests have amazing song ideas, but how do you collect them? 
                You want everyone to feel included, but managing it all feels impossible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              How UpTune Works
            </h2>
            <p className="text-xl text-white/70">
              Four simple steps to wedding music success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Create Your Timeline</h3>
              <p className="text-white/70">
                Set up your wedding moments in minutes. From guest arrival to last dance, 
                we've mapped out every moment that needs music.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Share with Guests</h3>
              <p className="text-white/70">
                Send one link. Guests suggest songs they'd love to hear. 
                You stay in control while everyone feels included.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Build & Organize</h3>
              <p className="text-white/70">
                Drag, drop, and perfect your playlists. See the flow, 
                check the timing, and make sure every transition works.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Export & Celebrate</h3>
              <p className="text-white/70">
                One click creates Spotify playlists and a detailed PDF for your DJ. 
                Then relax and enjoy your perfect soundtrack.
              </p>
            </div>
          </div>

          {/* Demo CTA */}
          <div className="text-center mt-12">
            <p className="text-white/60 mb-4">No credit card required</p>
            <Link href="/auth/signup" className="btn-primary inline-flex">
              Start Building - It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Everything You Need, Nothing You Don't
            </h2>
            <p className="text-xl text-white/70">
              Built by people who understand weddings
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Smart Timeline */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Calendar className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Timeline That Makes Sense</h3>
              <p className="text-white/70">
                11 pre-defined moments from guest arrival to send-off. 
                Add custom moments if you need them. See exactly how long each section runs.
              </p>
            </div>

            {/* Guest Portal */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Guest Portal That Works</h3>
              <p className="text-white/70">
                One link to share. Guests add songs without creating accounts. 
                You see who suggested what and can approve or skip anything.
              </p>
            </div>

            {/* Visual Builder */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Music className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Visual Music Builder</h3>
              <p className="text-white/70">
                Drag and drop songs between moments. See the flow visually. 
                Check timing at a glance. No more spreadsheet guessing.
              </p>
            </div>

            {/* Smart Suggestions */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Sparkles className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Curated Song Library</h3>
              <p className="text-white/70">
                Start with proven songs for each moment. Filter by vibe, era, or genre. 
                Add your own favorites. Skip the hours of research.
              </p>
            </div>

            {/* Export Options */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Download className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Export How You Need</h3>
              <p className="text-white/70">
                Create Spotify playlists instantly. Download a detailed PDF for your DJ. 
                Export to CSV if needed. Everything formatted perfectly.
              </p>
            </div>

            {/* Co-planning */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Heart className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Plan Together</h3>
              <p className="text-white/70">
                Invite your partner as a co-owner. Both can edit and organize. 
                See who added what. Make decisions together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why UpTune Section */}
      <section className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Why UpTune?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Because your wedding deserves better than a rushed Spotify playlist
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🎵</span>
                  Built for Real Weddings
                </h3>
                <p className="text-white/70 mb-4">
                  We've been to the weddings. We've seen the empty dance floors. 
                  We've watched DJs scramble with messy playlists.
                </p>
                <p className="text-white/70">
                  UpTune solves the real problems couples face when planning wedding music.
                </p>
              </div>
              
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">💻</span>
                  Modern Tools, Simple Design
                </h3>
                <p className="text-white/70 mb-4">
                  Drag and drop. Visual timelines. One-click exports. 
                  The tools you expect in 2024, designed for people who aren't tech experts.
                </p>
                <p className="text-white/70">
                  If you can use Spotify, you can use UpTune.
                </p>
              </div>
            </div>

            <div className="glass-gradient rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">The Result?</h3>
              <p className="text-lg text-white/80 mb-6">
                You walk into your wedding knowing every song is perfect. 
                Your DJ has everything they need. Your guests feel included. 
                And you actually enjoy the music planning process.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  No more spreadsheet stress
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  No more music anxiety
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Just great music
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Start free. Upgrade when you're ready to unlock everything.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Currency Selector */}
            <div className="flex justify-center gap-2 mb-8">
              {(['GBP', 'USD', 'EUR'] as const).map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCurrency === currency
                      ? 'bg-purple-600 text-white'
                      : 'glass text-white/60 hover:text-white'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>

            {/* Free vs Paid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Free Plan */}
              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <div className="text-4xl font-bold mb-4">£0</div>
                <p className="text-white/60 mb-6">Perfect for getting started</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Create your wedding timeline</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Add up to 25 songs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Share with 5 guests</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Basic music builder</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/40">
                    <X className="w-5 h-5 mt-0.5" />
                    <span>Export features locked</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/40">
                    <X className="w-5 h-5 mt-0.5" />
                    <span>Co-owner access locked</span>
                  </div>
                </div>
                <Link href="/auth/signup" className="btn-glass w-full">
                  Start Free
                </Link>
              </div>

              {/* Paid Plan */}
              <div className="glass-gradient rounded-3xl p-8 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                  RECOMMENDED
                </div>
                <h3 className="text-2xl font-bold mb-2">Full Access</h3>
                <div className="text-4xl font-bold gradient-text mb-4">
                  {currencySymbols[selectedCurrency]}{currencyAmount}
                </div>
                <p className="text-white/60 mb-6">One-time payment • Lifetime access</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span><strong>Everything in Free, plus:</strong></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Unlimited songs & playlists</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Unlimited guest access</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Export to Spotify & PDF</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Co-owner collaboration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Curated song library (500+ songs)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Priority support</span>
                  </div>
                </div>
                <Link href="/auth/signup" className="btn-primary w-full">
                  Start Free, Upgrade Anytime
                </Link>
              </div>
            </div>

            {/* Why Upgrade */}
            <div className="glass rounded-2xl p-8 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Why Do I Need Full Access?</h3>
              <p className="text-white/70 mb-6">
                The average wedding has 150-200 songs across all moments. 
                With 50+ guests contributing ideas, you need the full toolkit to organize, 
                export, and share everything seamlessly.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="glass-darker rounded-lg p-4">
                  <div className="text-2xl mb-2">🎵</div>
                  <p className="font-semibold">Free gets you started</p>
                  <p className="text-white/60">Test the waters, see if you like it</p>
                </div>
                <div className="glass-darker rounded-lg p-4">
                  <div className="text-2xl mb-2">🚀</div>
                  <p className="font-semibold">Full access gets you finished</p>
                  <p className="text-white/60">Everything you need to complete your soundtrack</p>
                </div>
                <div className="glass-darker rounded-lg p-4">
                  <div className="text-2xl mb-2">💕</div>
                  <p className="font-semibold">One small payment</p>
                  <p className="text-white/60">Less than 1% of your flower budget</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section relative z-10 py-20">
        <div className="container-max">
          <div className="glass-gradient rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Your Perfect Wedding Soundtrack Awaits
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of couples creating their dream wedding music. 
              Start free, upgrade when you're ready.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 group">
                Start Building - It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-glass text-lg px-8 py-4">
                Questions? Let's Chat
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            
            <p className="text-sm text-white/50 mt-6">
              No credit card required • Free plan includes 25 songs
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass-darker border-t border-white/10 py-12">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-purple-400" />
              <span className="text-white/60">Made with love for music • Trusted by couples worldwide • DJ approved</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/help" className="hover:text-white transition-colors">Help</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}