'use client'

import { ArrowRight, Heart, Music, Users, CheckCircle, Play, Sparkles, Download, Shield, Star, Calendar, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { InteractiveDemo } from '@/components/InteractiveDemo'
import { SPOTIFY_WEDDING_SONGS } from '@/data/spotify-wedding-songs'
import { getClientPricing, type PricingInfo } from '@/lib/pricing-utils-client'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pricing, setPricing] = useState<PricingInfo>({ 
    amount: 25, 
    currency: 'USD', 
    symbol: '$', 
    displayPrice: '$25' 
  })

  useEffect(() => {
    setPricing(getClientPricing())
  }, [])
  
  // Calculate total songs dynamically
  const totalSongs = Object.values(SPOTIFY_WEDDING_SONGS).reduce((total, songs) => total + songs.length, 0)
  
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
              <Link href="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link>
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
              <Link href="/blog" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
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
              Create the Soundtrack to<br />
              <span className="gradient-text">Your Perfect Day</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Plan your wedding music in one afternoon. Get your guests involved. <br className="hidden md:block" />
              Dance all night to songs that actually matter to you both.
            </p>

            {/* Value Props - Enhanced with specifics */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Heart className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Build Together in Real-Time</h3>
                <p className="text-white/70 text-sm">See each other's song choices instantly. From processional to last dance, create your timeline as a team.</p>
              </div>
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Users className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">One Link for Guests</h3>
                <p className="text-white/70 text-sm">Send one link. Guests add their must-play songs. You keep full control over what makes the cut.</p>
              </div>
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Export to Any DJ</h3>
                <p className="text-white/70 text-sm">Drag songs into each moment. Time your processional. Download PDFs ready for any DJ or band.</p>
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
              Music Sets the Mood for Everything
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              The right songs turn moments into memories. But getting there shouldn't be stressful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">💕</div>
              <h3 className="text-xl font-bold mb-3">Those Magical Moments</h3>
              <p className="text-white/70">
                When your song plays for the first dance. When grandma tears up during the processional. 
                When everyone rushes to the dance floor. These moments matter, and the music makes them.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-3">A Packed Dance Floor</h3>
              <p className="text-white/70">
                Picture it: Every generation dancing together. Your college friends going wild. 
                Even uncle Bob busting moves. This is what you want - and it starts with the right playlist.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Everyone Feels Included</h3>
              <p className="text-white/70">
                Your mom's favorite song. Your partner's guilty pleasure. That inside joke with your bridesmaids. 
                When everyone hears "their" song, they feel part of your love story.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="text-2xl mb-4">😌</div>
              <h3 className="text-xl font-bold mb-3">Peace of Mind</h3>
              <p className="text-white/70">
                No last-minute panic about playlists. No worrying if you forgot something important. 
                Just confidence that every moment will sound exactly how you imagined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <InteractiveDemo />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Your Music, Made Simple
            </h2>
            <p className="text-xl text-white/70">
              Go from stressed to sorted in four easy steps
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
                Start with our 11 pre-set moments. From guest arrival to send-off, 
                we've thought of everything. Add custom moments if you need them.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Share with Guests</h3>
              <p className="text-white/70">
                Send one link. Guests add songs without creating accounts. 
                Uncle Jim gets his one song. You keep the vibe.
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
                Export to Spotify, create PDFs for DJs, or use with any music service. 
                Works with or without Spotify - your choice!
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
                Browse {totalSongs.toLocaleString()} hand-picked wedding songs tested at real weddings. Filter by vibe, era, or genre. 
                Never run out of ideas. Never get stuck.
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

      {/* One Afternoon Promise Section */}
      <section className="section relative z-10 py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Plan Your Music in One Joyful Afternoon
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Yes, really. Here's how couples do it:
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="text-2xl font-bold text-purple-400 w-20">2:00</div>
                <div>
                  <h4 className="font-bold mb-1">Start Together with Coffee</h4>
                  <p className="text-white/70">Create your wedding, invite your partner, set up the timeline</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="text-2xl font-bold text-pink-400 w-20">2:30</div>
                <div>
                  <h4 className="font-bold mb-1">Add Your Must-Plays</h4>
                  <p className="text-white/70">First dance, parents' songs, those non-negotiables</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="text-2xl font-bold text-blue-400 w-20">3:00</div>
                <div>
                  <h4 className="font-bold mb-1">Browse Our {totalSongs.toLocaleString()} Tested Songs</h4>
                  <p className="text-white/70">Filter by moment, vibe, era - find gems you forgot about</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="text-2xl font-bold text-purple-400 w-20">3:30</div>
                <div>
                  <h4 className="font-bold mb-1">Perfect Your Timeline</h4>
                  <p className="text-white/70">Drag, drop, check the flow - see it all come together</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="text-2xl font-bold text-pink-400 w-20">4:00</div>
                <div>
                  <h4 className="font-bold mb-1">Send to Guests</h4>
                  <p className="text-white/70">One link, done - they'll add songs over the coming weeks</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="text-2xl font-bold text-green-400 w-20">4:30</div>
                <div>
                  <h4 className="font-bold mb-1">Done! Time for Cake</h4>
                  <p className="text-white/70">Seriously, that's it - come back later to review guest suggestions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Works With Everything Section */}
      <section className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Yes, It Works With...
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Whatever your setup, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🎧</div>
              <h4 className="font-bold mb-2">Spotify</h4>
              <p className="text-white/70 text-sm">Export playlists with one click. Works with free or premium accounts.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🎤</div>
              <h4 className="font-bold mb-2">Any DJ or Band</h4>
              <p className="text-white/70 text-sm">Download professional PDFs with all song details and timing notes.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🎻</div>
              <h4 className="font-bold mb-2">Live Musicians</h4>
              <p className="text-white/70 text-sm">Share your timeline so they know exactly when to play.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🏛️</div>
              <h4 className="font-bold mb-2">Venue Sound Systems</h4>
              <p className="text-white/70 text-sm">Standard formats that work everywhere. No technical headaches.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-6 glass rounded-2xl">
              <Shield className="w-8 h-8 text-blue-400" />
              <div className="text-left">
                <h4 className="font-bold">Your Music Stays Yours</h4>
                <p className="text-white/70">Export anytime. Works offline at your venue. We're here to help, not lock you in.</p>
              </div>
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

      {/* Testimonials Section */}
      <section id="testimonials" className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Real Couples, Real Joy
            </h2>
            <p className="text-xl text-white/70">
              Here's what happens when the music is just right
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/80 mb-6">
                "Our dance floor was PACKED all night! Even my 85-year-old grandma was dancing. 
                The flow from dinner to party was perfect. Worth every penny."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold">Sarah & Tom</p>
                  <p className="text-sm text-white/60">Married June 2024</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/80 mb-6">
                "Game changer! Our guests LOVED being part of the playlist. 
                My mom cried when her song came on. The timeline feature saved us hours of planning."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-semibold">Maria & James</p>
                  <p className="text-sm text-white/60">Married August 2024</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/80 mb-6">
                "Our DJ said it was the most organized playlist he'd ever received. 
                No awkward moments, perfect energy all night. Still getting compliments!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="font-semibold">Alex & Jordan</p>
                  <p className="text-sm text-white/60">Married October 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60">
              Join hundreds of couples who've created their perfect wedding soundtrack
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section relative z-10 py-20 glass-darker">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Invest in Your Perfect Day
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Start free to explore. Upgrade once to keep forever. Less than your wedding favors.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
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
                    <span>Add up to 10 songs</span>
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
                  {pricing.displayPrice}
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
                    <span>Curated song library ({totalSongs.toLocaleString()} songs)</span>
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

      {/* Blog Section */}
      <section className="section relative z-10 py-20">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Wedding Music <span className="gradient-text">Inspiration & Guides</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Expert tips, real wedding stories, and curated playlists to help you create your perfect soundtrack
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Blog Cards */}
            <Link href="/blog/complete-guide-wedding-music-planning" className="card group">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                Complete Wedding Music Planning Guide
              </h3>
              <p className="text-white/60 mb-4">
                Everything you need to know about planning music for every moment of your big day
              </p>
              <span className="text-purple-400 flex items-center gap-2">
                Read more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/blog/10-ways-guest-music-selection" className="card group">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                Get Your Guests Involved
              </h3>
              <p className="text-white/60 mb-4">
                Creative ways to include your guests in choosing your wedding music
              </p>
              <span className="text-purple-400 flex items-center gap-2">
                Read more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/blog/wedding-reception-music-guide" className="card group">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                Reception Music Mastery
              </h3>
              <p className="text-white/60 mb-4">
                From cocktail hour to last dance - create the perfect flow
              </p>
              <span className="text-purple-400 flex items-center gap-2">
                Read more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          
          <div className="text-center">
            <Link href="/blog" className="btn-glass">
              Explore All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section relative z-10 py-20">
        <div className="container-max">
          <div className="glass-gradient rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Ready for a Dance Floor<br />
              <span className="gradient-text">Everyone Remembers?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Stop stressing about the music. Start imagining the memories. 
              Your perfect wedding soundtrack is just a few clicks away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 group">
                Create Your Soundtrack Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="btn-glass text-lg px-8 py-4">
                See How It Works
                <Play className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                Start with 10 free songs
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Upgrade when you're ready
              </span>
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
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
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