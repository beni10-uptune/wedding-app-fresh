'use client'

import { ArrowRight, Heart, Music, Users, CheckCircle, Play, Sparkles, Download, Zap, Shield, Star, Gift, Calendar, PartyPopper, ChevronRight, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP')
  
  // Live activity feed data
  const liveActivities = [
    { name: "Emma & Ryan", action: "found their perfect first dance song", emoji: "💕" },
    { name: "Sarah's grandmother", action: "suggested 'At Last' - 3 generations love this choice", emoji: "❤️" },
    { name: "The Johnson wedding", action: "dance floor was magical last night", emoji: "✨" },
    { name: "James & Lisa's guests", action: "voted 'September' as the ultimate crowd-pleaser", emoji: "🎉" },
    { name: "Michael & Anna", action: "completed their ceremony playlist", emoji: "🎵" },
    { name: "The Williams family", action: "added 15 songs to the reception mix", emoji: "🎶" }
  ]

  // Rotate through activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % liveActivities.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

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
                Start Your Journey
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
                Start Your Journey
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
              Create the Perfect Soundtrack<br />
              <span className="gradient-text">to Your Love Story</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Transform your wedding into an unforgettable celebration with music that moves hearts, fills dance floors, and creates memories that last forever.
            </p>

            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">No Awkward Silences</h3>
                <p className="text-white/70 text-sm">500+ songs proven to create wedding magic</p>
              </div>
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Heart className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Your Unique Story</h3>
                <p className="text-white/70 text-sm">Let loved ones help curate your special day</p>
              </div>
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Music className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Every Moment Perfect</h3>
                <p className="text-white/70 text-sm">Professional results, personal touch</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 group">
                Create Your Dream Soundtrack - {currencySymbols[selectedCurrency]}{currencyAmount}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="btn-glass text-lg px-8 py-4">
                <Play className="w-5 h-5" />
                See How Magic Happens
              </Link>
            </div>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/60 pt-8">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Proven at 1000+ weddings
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                30-day guarantee
              </span>
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                DJ approved
              </span>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Instant access
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Wedding Magic Section */}
      <section className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Live Wedding Magic Happening Now
            </h2>
            <p className="text-xl text-white/70">
              Real couples creating their perfect soundtracks right now
            </p>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">347</div>
              <div className="text-sm text-white/60">Active Weddings</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">2,143</div>
              <div className="text-sm text-white/60">Songs Added Today</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">456</div>
              <div className="text-sm text-white/60">Guest Contributions</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">89</div>
              <div className="text-sm text-white/60">Playlists Exported</div>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/60">Live Activity</span>
              </div>
              <div className="space-y-3">
                {[0, 1, 2].map((offset) => {
                  const activity = liveActivities[(currentActivityIndex + offset) % liveActivities.length]
                  return (
                    <div 
                      key={offset} 
                      className={`flex items-center gap-3 transition-opacity duration-1000 ${
                        offset === 0 ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <span className="text-2xl">{activity.emoji}</span>
                      <p className="text-white/80">
                        <span className="font-semibold text-white">{activity.name}</span> {activity.action}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Emotional Journey */}
      <section id="how-it-works" className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Your Journey to the Perfect Wedding Soundtrack
            </h2>
            <p className="text-xl text-white/70">
              Four beautiful steps to musical perfection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1: Dream */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Start with Your Vision</h3>
              <p className="text-white/70">
                Begin with expertly curated collections designed for every magical moment - from the anticipation of your processional to the joy of your last dance.
              </p>
            </div>

            {/* Step 2: Connect */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Invite Your Community</h3>
              <p className="text-white/70">
                Share the joy of creation. Let the people you love most contribute songs that matter, vote on favorites, and become part of your musical love story.
              </p>
            </div>

            {/* Step 3: Perfect */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Craft the Perfect Flow</h3>
              <p className="text-white/70">
                Our intelligent assistant helps you create seamless transitions and perfect energy throughout your celebration. Every moment orchestrated to perfection.
              </p>
            </div>

            {/* Step 4: Celebrate */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PartyPopper className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dance the Night Away</h3>
              <p className="text-white/70">
                Walk down the aisle to your perfect processional, share your first dance, and watch your loved ones celebrate to a soundtrack made with love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              What Makes Your Wedding Soundtrack Perfect
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Perfection Guaranteed */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Star className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">No Awkward Silences, No Empty Dance Floors</h3>
              <p className="text-white/70">
                Sleep peacefully knowing every song has been tested at real weddings. No guesswork, no regrets, just perfect moments guaranteed.
              </p>
            </div>

            {/* Community Magic */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Let Loved Ones Shape Your Celebration</h3>
              <p className="text-white/70">
                Turn music planning into a celebration itself. Watch as aunts, college friends, and grandparents all contribute to your special day.
              </p>
            </div>

            {/* Your Love Story */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Gift className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Music That Tells YOUR Story</h3>
              <p className="text-white/70">
                From the song that was playing when you first met to the anthem that gets your crowd moving, create a soundtrack that's uniquely yours.
              </p>
            </div>

            {/* Every Moment */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Calendar className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">11 Perfect Wedding Moments</h3>
              <p className="text-white/70">
                From the quiet anticipation of guests arriving to the explosive joy of your grand finale, every moment of your day deserves the perfect song.
              </p>
            </div>

            {/* Seamless Magic */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Zap className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Intelligent Flow, No Awkward Pauses</h3>
              <p className="text-white/70">
                Intelligent suggestions ensure your celebration flows naturally from intimate ceremony to explosive dance party. No awkward pauses, just pure magic.
              </p>
            </div>

            {/* Professional Results */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform">
              <Download className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Professional Results, Personal Touch</h3>
              <p className="text-white/70">
                Hand your DJ a perfectly organized masterpiece. Every song, every timing note, every special request exactly where it needs to be.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Real Love Stories, Perfect Soundtracks
            </h2>
            <p className="text-xl text-white/70">
              Couples who created their dream wedding with UpTune
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {/* Sarah & Mike */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-6 italic">
                "Our guests are STILL talking about the music six months later. Having everyone contribute made it feel like our whole community was part of creating something beautiful together."
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Sarah & Mike</p>
                  <p className="text-sm text-white/60">Brighton</p>
                </div>
                <div className="text-sm text-purple-400">200+ guests participated</div>
              </div>
            </div>

            {/* Emma & David */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-6 italic">
                "I actually cried during our processional - not just because I was getting married, but because the music was so perfectly us. Every song told our story."
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Emma & David</p>
                  <p className="text-sm text-white/60">London</p>
                </div>
                <div className="text-sm text-pink-400">Perfect first dance</div>
              </div>
            </div>

            {/* Jessica & Tom */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-6 italic">
                "The dance floor was packed from the first song to the last. Our 85-year-old grandmother was dancing next to our college friends. That's the magic we wanted."
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Jessica & Tom</p>
                  <p className="text-sm text-white/60">Manchester</p>
                </div>
                <div className="text-sm text-blue-400">3 generations dancing</div>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="glass-gradient rounded-2xl p-8 max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
              <span className="text-2xl font-bold ml-2">4.9/5</span>
            </div>
            <p className="text-lg text-white/90 mb-4">
              "UpTune transformed wedding music from our biggest stress into our favorite part of planning. The collaboration features brought our families together before the big day!"
            </p>
            <p className="text-white/60">Based on 500+ wedding reviews</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              A Small Investment in Perfect Memories
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              For less than the cost of your wedding flowers, create a soundtrack that will bring back every magical moment for the rest of your lives.
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

            {/* Pricing Card */}
            <div className="glass-gradient rounded-3xl p-12 text-center">
              <div className="text-6xl font-bold gradient-text mb-2">
                {currencySymbols[selectedCurrency]}{currencyAmount}
              </div>
              <p className="text-white/60 mb-8">One-time payment • Lifetime access</p>

              {/* What's Included */}
              <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>500+ songs proven to create wedding magic</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Unlimited guest collaboration & voting</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Intelligent assistant for perfect energy flow</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>11 wedding moments timeline</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Professional DJ export packages</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Spotify playlist creation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Lifetime access to your playlists</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </div>

              {/* Value Comparison */}
              <div className="glass-darker rounded-xl p-6 mb-8">
                <p className="text-sm text-white/60 mb-4">What others charge:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Wedding DJ consultation</span>
                    <span className="text-white line-through">{currencySymbols[selectedCurrency]}200+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Music coordinator</span>
                    <span className="text-white line-through">{currencySymbols[selectedCurrency]}150+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Months of playlist anxiety</span>
                    <span className="text-white">Priceless</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span className="font-bold">UpTune perfect soundtrack</span>
                    <span className="font-bold gradient-text">{currencySymbols[selectedCurrency]}{currencyAmount}</span>
                  </div>
                </div>
              </div>

              {/* Forever Value */}
              <p className="text-white/80 mb-8 italic">
                "This isn't just for your wedding day. Your playlists become the soundtrack to your marriage - anniversary dinners, dance parties in your kitchen, memories that last forever."
              </p>

              {/* CTA */}
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 inline-flex group">
                Create Your Dream Soundtrack - {currencySymbols[selectedCurrency]}{currencyAmount}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Guarantee */}
              <div className="flex items-center justify-center gap-3 mt-8 text-sm text-white/60">
                <Shield className="w-5 h-5 text-green-400" />
                <span>30-Day Money-Back Guarantee • Not happy? Get a full refund, no questions asked.</span>
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
              Ready to Create Your Perfect Soundtrack?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of couples who've made their wedding day everything they dreamed. Your soundtrack to forever starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 group">
                Create Your Dream Soundtrack - {currencySymbols[selectedCurrency]}{currencyAmount}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-glass text-lg px-8 py-4">
                Questions? Let's Chat
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
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