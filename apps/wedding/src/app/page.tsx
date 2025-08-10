'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Music, 
  Sparkles, 
  Check,
  ArrowRight,
  Play,
  Users,
  Clock,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { label: 'Couples Served', value: '2,500+' },
    { label: 'Songs Curated', value: '50,000+' },
    { label: 'Hours Saved', value: '10,000+' }
  ];

  const features = [
    'Drag & drop timeline builder',
    'AI-powered song recommendations',
    'Spotify integration',
    'Guest song requests',
    'Professional DJ handoff'
  ];

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48 opacity-30"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48 opacity-30"></div>
        <div className="orb orb-pink w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
      </div>

      {/* Simple Header */}
      <header className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Uptune</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/v3"
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">AI-Powered Wedding Music</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Create Your Perfect
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Wedding Playlist
            </span>
            in Minutes
          </h1>
          
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Build a complete wedding timeline with 50+ perfectly curated songs. 
            Drag, drop, and customize every moment of your special day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/v3"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
            >
              Start Building - It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-white/10 backdrop-blur text-white text-lg rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass-darker rounded-2xl p-2 shadow-2xl">
            <div className="bg-black/40 rounded-xl overflow-hidden">
              {/* Mini Preview of Builder */}
              <div className="flex h-[500px]">
                {/* Left Pane Preview */}
                <div className="w-80 bg-black/20 border-r border-white/10 p-4">
                  <div className="space-y-3">
                    <div className="h-20 bg-white/5 rounded-lg animate-pulse"></div>
                    <div className="h-32 bg-white/5 rounded-lg animate-pulse"></div>
                    <div className="h-24 bg-white/5 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                
                {/* Center Timeline Preview */}
                <div className="flex-1 bg-black/10 p-6">
                  <h3 className="text-white font-bold text-lg mb-4">YOUR WEDDING TIMELINE</h3>
                  <div className="space-y-3">
                    <div className="glass-card rounded-lg p-4 flex items-center gap-3">
                      <span className="text-2xl">💒</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">Ceremony</p>
                        <p className="text-xs text-white/60">2:00 PM • 4 songs</p>
                      </div>
                    </div>
                    <div className="glass-card rounded-lg p-4 flex items-center gap-3">
                      <span className="text-2xl">🥂</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">Cocktails</p>
                        <p className="text-xs text-white/60">3:30 PM • 10 songs</p>
                      </div>
                    </div>
                    <div className="glass-card rounded-lg p-4 flex items-center gap-3">
                      <span className="text-2xl">💕</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">First Dance</p>
                        <p className="text-xs text-white/60">7:00 PM • 1 song</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Pane Preview */}
                <div className="w-80 bg-black/20 border-l border-white/10 p-4">
                  <div className="space-y-3">
                    <div className="h-32 bg-white/5 rounded-lg animate-pulse"></div>
                    <div className="h-24 bg-white/5 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 glass-card rounded-lg p-4">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white text-left">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-white/60 mb-6">Perfect to get started</p>
              <p className="text-4xl font-bold text-white mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Build complete timeline</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">50+ curated songs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Basic customization</span>
                </li>
              </ul>
              <Link 
                href="/v3"
                className="block w-full text-center px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Start Free
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="glass-card rounded-2xl p-8 relative border-2 border-purple-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-white/60 mb-6">Everything you need</p>
              <p className="text-4xl font-bold text-white mb-6">
                $25
                <span className="text-lg text-white/60 font-normal"> one-time</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Everything in Free</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">AI Assistant & Chat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Spotify taste analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Export to Spotify</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Guest requests</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Unlimited customization</span>
                </li>
              </ul>
              <Link 
                href="/v3"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Start with Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Your Perfect Wedding Soundtrack?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of couples who've already built their dream playlists
          </p>
          <Link 
            href="/v3"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl"
          >
            Start Building Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold">Uptune</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-white/60 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white">
              Contact
            </Link>
          </div>
          
          <p className="text-sm text-white/60">
            © 2024 Uptune. Made with ❤️ for couples everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}