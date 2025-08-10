'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Heart, Compass, Lightbulb, Users, Clock, ChevronRight, 
  Music, Plus, Sparkles, PlayCircle, MessageSquare, Share2,
  Download, Star, Zap, ListMusic
} from 'lucide-react'

interface Guide {
  id: string
  title: string
  description: string
  icon: any
  iconBg: string
  readTime: string
  href?: string
  action?: {
    label: string
    href: string
    icon: any
  }
  tips?: string[]
  category: 'getting-started' | 'planning' | 'collaboration' | 'advanced'
}

interface GuidesSectionProps {
  weddingId: string
  hasMusic: boolean
  songCount: number
  guestCount: number
}

export function GuidesSection({ weddingId, hasMusic, songCount, guestCount }: GuidesSectionProps) {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)

  const guides: Guide[] = [
    {
      id: 'first-dance',
      title: 'Choose Your First Dance',
      description: 'Find the perfect song that tells your love story',
      icon: Heart,
      iconBg: 'from-pink-500 to-rose-500',
      readTime: '5 min guide',
      category: 'getting-started',
      action: {
        label: 'Browse First Dance Songs',
        href: '/builder?collection=first-dance',
        icon: Music
      },
      tips: [
        'Consider songs from your early dating days',
        'Think about lyrics that resonate with your story',
        'Test dancing to it - 3-4 minutes is ideal',
        'Check out our "First Dance Classics" collection'
      ]
    },
    {
      id: 'timeline',
      title: 'Build Your Timeline',
      description: 'Create the perfect musical flow for your big day',
      icon: Compass,
      iconBg: 'from-purple-500 to-indigo-500',
      readTime: '8 min guide',
      category: 'planning',
      action: {
        label: 'Start Timeline Builder',
        href: '/builder?view=timeline',
        icon: ListMusic
      },
      tips: [
        'Start with ceremony music (30-45 min)',
        'Plan 60-90 min for cocktail hour',
        'Dinner needs 90-120 min of background music',
        'Save high-energy songs for after dinner'
      ]
    },
    {
      id: 'discovery',
      title: 'Discover New Songs',
      description: 'Find hidden gems and crowd favorites',
      icon: Lightbulb,
      iconBg: 'from-indigo-500 to-purple-500',
      readTime: '6 min guide',
      category: 'planning',
      action: {
        label: 'Explore Curated Collections',
        href: '/builder?tab=collections',
        icon: Sparkles
      },
      tips: [
        'Browse our 20+ curated collections by vibe',
        'Check "Hidden Gems" for unique choices',
        'Use the preview player before adding',
        'Mix familiar hits with new discoveries'
      ]
    },
    {
      id: 'guests',
      title: 'Get Guest Input',
      description: 'Let loved ones help build your playlist',
      icon: Users,
      iconBg: 'from-green-500 to-teal-500',
      readTime: '4 min guide',
      category: 'collaboration',
      action: {
        label: guestCount > 0 ? 'View Guest Suggestions' : 'Invite Guests',
        href: '/builder?tab=guests',
        icon: guestCount > 0 ? MessageSquare : Share2
      },
      tips: [
        'Share your unique wedding link with guests',
        'Set expectations (3-5 songs per guest)',
        'Review suggestions together as a couple',
        'Use voting to identify crowd favorites'
      ]
    }
  ]

  // Add contextual guides based on current state
  if (!hasMusic || songCount < 10) {
    guides.unshift({
      id: 'quick-start',
      title: '🎉 Quick Start Guide',
      description: 'Get your wedding music started in 5 minutes',
      icon: Zap,
      iconBg: 'from-yellow-500 to-orange-500',
      readTime: '5 min',
      category: 'getting-started',
      action: {
        label: 'Start Adding Songs',
        href: '/builder',
        icon: Plus
      },
      tips: [
        'Start with your must-have songs',
        'Browse "Wedding Essentials" collection',
        'Add 10-15 songs to get momentum',
        'You can always reorganize later'
      ]
    })
  }

  if (songCount > 50) {
    guides.push({
      id: 'export',
      title: 'Share with Vendors',
      description: 'Export your playlists for DJ or band',
      icon: Download,
      iconBg: 'from-blue-500 to-cyan-500',
      readTime: '3 min guide',
      category: 'advanced',
      action: {
        label: 'Export Options',
        href: '/builder?tab=export',
        icon: Share2
      },
      tips: [
        'Export to Spotify for easy sharing',
        'Create PDF for DJs without Spotify',
        'Include timing notes for each moment',
        'Share do-not-play list too'
      ]
    })
  }

  const toggleGuide = (guideId: string) => {
    setExpandedGuide(expandedGuide === guideId ? null : guideId)
  }

  return (
    <section className="px-4 py-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            Your Wedding Music Journey
          </h3>
          {songCount > 0 && (
            <div className="text-sm text-white/60">
              {songCount} songs added • {Math.round(songCount / 150 * 100)}% complete
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {songCount > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span>Getting Started</span>
              <span>Ready to Party! 🎉</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all relative overflow-hidden"
                style={{ width: `${Math.min(songCount / 150 * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/60 mt-2">
              <span>10 songs</span>
              <span>150 songs (recommended)</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="relative">
              <div className="glass-gradient rounded-xl overflow-hidden hover:scale-[1.02] transform transition-all">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${guide.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <guide.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-1">{guide.title}</h4>
                      <p className="text-white/70 text-sm">{guide.description}</p>
                      <div className="flex items-center gap-2 text-xs text-white/60 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{guide.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick action button */}
                  {guide.action && (
                    <Link 
                      href={guide.action.href}
                      className="flex items-center justify-between w-full glass-darker rounded-lg p-3 hover:bg-white/10 transition-colors group"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <guide.action.icon className="w-4 h-4 text-purple-400" />
                        {guide.action.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </Link>
                  )}

                  {/* Expandable tips */}
                  {guide.tips && (
                    <button
                      onClick={() => toggleGuide(guide.id)}
                      className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      {expandedGuide === guide.id ? 'Hide' : 'Show'} Quick Tips
                      <ChevronRight className={`w-4 h-4 transition-transform ${expandedGuide === guide.id ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Expanded tips */}
                {expandedGuide === guide.id && guide.tips && (
                  <div className="px-6 pb-6">
                    <div className="glass-darker rounded-lg p-4 space-y-2">
                      {guide.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-white/80">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* New badge for getting started guides */}
              {guide.category === 'getting-started' && songCount < 20 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                  Start Here!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contextual tip based on progress */}
        <div className="mt-8 glass-darker rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-2">
                {songCount === 0 ? "Ready to Start?" :
                 songCount < 20 ? "Great Start! Keep Going" :
                 songCount < 50 ? "You're Making Great Progress!" :
                 songCount < 100 ? "Looking Good! Almost There" :
                 "Wow! Your Playlist is Coming Together Beautifully"}
              </h4>
              <p className="text-white/70 text-sm mb-3">
                {songCount === 0 ? 
                  "Begin with songs that are special to you both - your song, first date memories, or current favorites. The rest will follow naturally!" :
                 songCount < 20 ? 
                  "You've got the basics! Now explore our curated collections to discover songs perfect for each moment of your day." :
                 songCount < 50 ? 
                  "Time to think about your timeline. Make sure you have enough music for ceremony, cocktails, dinner, and dancing." :
                 songCount < 100 ? 
                  "Don't forget to invite your guests to contribute! They'll love being part of your special day." :
                  "You're all set! Now's a great time to review your selections and export playlists for your DJ or band."}
              </p>
              {songCount === 0 ? (
                <Link 
                  href="/builder"
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Open Music Builder <ChevronRight className="w-4 h-4" />
                </Link>
              ) : songCount < 50 ? (
                <Link 
                  href="/builder?tab=collections"
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Browse Collections <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link 
                  href="/builder?tab=export"
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Export Options <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}