'use client'

import Link from 'next/link'
import { 
  Music, Plus, ChevronRight, CheckCircle2, Clock, 
  Sparkles, ListMusic, Search, TrendingUp, Heart
} from 'lucide-react'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import { Timeline } from '@/types/wedding-v2'

interface TimelineSectionProps {
  weddingId: string
  timeline: Timeline | null
  paymentStatus: string
}

export function TimelineSection({ weddingId, timeline, paymentStatus }: TimelineSectionProps) {
  const momentIcons: { [key: string]: any } = {
    'processional': Heart,
    'first-dance': Heart,
    'cocktail': Sparkles,
    'dinner': Music,
    'party': Sparkles,
    'ceremony': Heart,
    'reception': Sparkles
  }

  const momentColors: { [key: string]: string } = {
    'processional': 'from-pink-500 to-rose-500',
    'first-dance': 'from-red-500 to-pink-500',
    'cocktail': 'from-purple-500 to-pink-500',
    'dinner': 'from-indigo-500 to-purple-500',
    'party': 'from-purple-500 to-indigo-500',
    'ceremony': 'from-rose-500 to-pink-500',
    'reception': 'from-purple-600 to-pink-600'
  }

  // Calculate progress for a moment
  const getMomentProgress = (moment: any) => {
    if (!moment || !moment.songs) return 0
    const targetDuration = moment.duration * 60 // Convert minutes to seconds
    const currentDuration = moment.songs.reduce((sum: number, song: any) => sum + (song.duration || 0), 0) || 0
    return Math.min((currentDuration / targetDuration) * 100, 100)
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} min`
  }

  // Get moments that need attention
  const incompleteMoments = WEDDING_MOMENTS.filter(moment => {
    const momentData = timeline?.[moment.id]
    return !momentData || !momentData.songs || momentData.songs.length === 0
  })

  const hasAnyMusic = timeline && Object.values(timeline).some(m => m?.songs?.length > 0)

  if (!hasAnyMusic) {
    // Empty state with helpful actions
    return (
      <section className="px-4 py-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
            <ListMusic className="w-8 h-8 text-purple-400" />
            Your Wedding Timeline
          </h3>
          
          <div className="glass-darker rounded-2xl p-12 text-center">
            <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Let's Build Your Musical Timeline!</h4>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Every great wedding has a perfect soundtrack. Start building yours with our easy-to-use music builder.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/builder"
                className="btn-primary inline-flex"
              >
                <Plus className="w-5 h-5" />
                Start Building
              </Link>
              <Link
                href="/builder?tab=collections"
                className="btn-secondary inline-flex"
              >
                <Search className="w-5 h-5" />
                Browse Collections
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="glass rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Quick Start</p>
                <p className="text-xs text-white/60">Add 10 songs in 5 minutes</p>
              </div>
              <div className="glass rounded-lg p-4">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Curated Lists</p>
                <p className="text-xs text-white/60">20+ collections to explore</p>
              </div>
              <div className="glass rounded-lg p-4">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Perfect Timing</p>
                <p className="text-xs text-white/60">Organized by moment</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
            <ListMusic className="w-8 h-8 text-purple-400" />
            Your Wedding Timeline
          </h3>
          <Link
            href="/builder?view=timeline"
            className="text-sm text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
          >
            View Full Timeline <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick actions for incomplete moments */}
        {incompleteMoments.length > 0 && (
          <div className="mb-6 glass-darker rounded-xl p-4">
            <p className="text-sm text-white/70 mb-3">
              <span className="text-yellow-400">💡 Tip:</span> You still need music for {incompleteMoments.length} moment{incompleteMoments.length > 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-2">
              {incompleteMoments.slice(0, 3).map((moment) => (
                <Link
                  key={moment.id}
                  href={`/builder?moment=${moment.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add {moment.name} Music
                </Link>
              ))}
              {incompleteMoments.length > 3 && (
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  +{incompleteMoments.length - 3} more
                </Link>
              )}
            </div>
          </div>
        )}
        
        <div className="grid gap-4">
          {WEDDING_MOMENTS.filter(moment => timeline?.[moment.id]?.songs?.length > 0).map((moment) => {
            const momentData = timeline![moment.id]
            const progress = getMomentProgress(momentData)
            const Icon = momentIcons[moment.id] || Music
            const gradient = momentColors[moment.id] || 'from-purple-500 to-pink-500'
            const songCount = momentData.songs?.length || 0
            const duration = momentData.songs?.reduce((sum: number, song: any) => sum + (song.duration || 0), 0) || 0
            
            return (
              <div key={moment.id} className="glass-darker rounded-2xl p-6 hover:scale-[1.01] transform transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-2xl">{moment.icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-white">{moment.name}</h4>
                      <span className="text-sm text-white/60">
                        {songCount} songs • {formatDuration(duration)}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      {moment.description || `Music for ${moment.name.toLowerCase()}`}
                    </p>
                    
                    <div className="relative mb-4">
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${gradient} h-3 rounded-full transition-all relative overflow-hidden`}
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                        </div>
                      </div>
                      {progress >= 90 && progress <= 110 && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Perfect!
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/builder?moment=${moment.id}`}
                        className="text-sm glass rounded-lg px-4 py-2 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                      >
                        <Music className="w-4 h-4" />
                        View Songs
                      </Link>
                      <Link
                        href={`/builder?moment=${moment.id}&action=add`}
                        className="text-sm glass rounded-lg px-4 py-2 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add More
                      </Link>
                      {progress < 80 && (
                        <Link
                          href={`/builder?moment=${moment.id}&tab=collections`}
                          className="text-sm glass rounded-lg px-4 py-2 hover:bg-white/10 transition-colors inline-flex items-center gap-2 text-purple-400"
                        >
                          <Sparkles className="w-4 h-4" />
                          Get Suggestions
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add missing moments */}
        {incompleteMoments.length > 0 && hasAnyMusic && (
          <div className="mt-6 text-center">
            <Link
              href="/builder"
              className="btn-secondary inline-flex"
            >
              <Plus className="w-5 h-5" />
              Complete Your Timeline
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}