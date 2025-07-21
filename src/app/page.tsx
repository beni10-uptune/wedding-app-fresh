'use client'

import { ArrowRight, Heart, Music, Users, CheckCircle, Play, Sparkles, Download } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
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
              <a 
                href="https://uptune.xyz" 
                className="hidden sm:flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to UpTune
              </a>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
              <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How It Works</Link>
            </nav>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors">Log In</Link>
              <Link href="/auth/signup" className="btn-primary">Get Started</Link>
            </div>
            
            {/* Mobile Menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              <div className="w-6 h-0.5 bg-white mb-1.5"></div>
              <div className="w-6 h-0.5 bg-white mb-1.5"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section relative z-10">
        <div className="container-max text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Badge */}
            <div className="badge-live inline-flex">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Made with Love for Music
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-serif">
              Where Music<br />
              <span className="gradient-text">Brings Weddings Together</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Create playlists that tell your love story, collaborate with guests, and craft the perfect soundtrack for your special day.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth/signup" className="btn-primary">
                Start Your Journey - £25
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#how-it-works" className="btn-glass">
                <Play className="w-5 h-5" />
                See How It Works
              </Link>
            </div>
            
            {/* Features */}
            <div className="flex justify-center items-center gap-6 text-sm text-white/60 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                One-time payment
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                500+ songs
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                Guest voting
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="section relative z-10">
        <div className="container-max">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif mb-2">Live Wedding Activity</h2>
            <p className="text-white/60">Real couples creating their soundtracks now</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="card text-center">
              <div className="text-2xl font-bold gradient-text">127</div>
              <div className="text-sm text-white/60">Active Weddings</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold gradient-text">1,247</div>
              <div className="text-sm text-white/60">Songs Today</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold gradient-text">89</div>
              <div className="text-sm text-white/60">Guest Votes</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold gradient-text">342</div>
              <div className="text-sm text-white/60">Playlists</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section relative z-10">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Musical Adventures for Your <span className="gradient-text">Perfect Day</span>
            </h2>
            <p className="text-lg text-white/60">Every song has a story</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card group">
              <Heart className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collaborative Playlists</h3>
              <p className="text-white/60 text-sm">Build your soundtrack together. Every song becomes part of your love story.</p>
            </div>
            
            <div className="card group">
              <Users className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Guest Suggestions</h3>
              <p className="text-white/60 text-sm">Let loved ones contribute. Discover what music moves your community.</p>
            </div>
            
            <div className="card group">
              <Download className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">DJ Export</h3>
              <p className="text-white/60 text-sm">Professional formats with timing notes. Ready for your perfect day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section relative z-10">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">How It Works</h2>
            <p className="text-lg text-white/60">Four simple steps to your perfect soundtrack</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Sign Up", desc: "Create your wedding in minutes" },
              { num: "2", title: "Build", desc: "Create playlists for each moment" },
              { num: "3", title: "Collaborate", desc: "Invite guests to contribute" },
              { num: "4", title: "Export", desc: "Download for your DJ" }
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section relative z-10">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Simple Pricing</h2>
            <p className="text-lg text-white/60 mb-8">One payment, lifetime access</p>
            
            <div className="card">
              <div className="mb-6">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <div className="text-5xl font-bold gradient-text">£25</div>
                <p className="text-white/60">one-time payment</p>
              </div>
              
              <div className="space-y-3 mb-8">
                {[
                  "500+ curated wedding songs",
                  "Unlimited guest collaboration", 
                  "Multiple playlist exports",
                  "Lifetime access"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/auth/signup" className="btn-primary w-full">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="text-xs text-white/40 mt-4">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-darker border-t border-white/10 py-12 relative z-10">
        <div className="container-max">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">UpTune</span>
              </div>
              <p className="text-sm text-white/60">Where music brings weddings together</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm text-white/60">
                <Link href="#features" className="block hover:text-white">Features</Link>
                <Link href="#pricing" className="block hover:text-white">Pricing</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm text-white/60">
                <Link href="/help" className="block hover:text-white">Help Center</Link>
                <Link href="/contact" className="block hover:text-white">Contact</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-white/60">
                <Link href="/privacy" className="block hover:text-white">Privacy</Link>
                <Link href="/terms" className="block hover:text-white">Terms</Link>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-white/40 pt-8 border-t border-white/10">
            © 2024 UpTune for Weddings. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}