'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { SongSuggestion } from '@/types/wedding'
import { Music, ThumbsUp, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react'
import SongCard from '@/components/SongCard'

interface Activity {
  id: string
  type: 'suggestion' | 'vote' | 'approval' | 'join'
  timestamp: Timestamp
  data: SongSuggestion
}

interface ActivityFeedProps {
  weddingId: string
  limit?: number
}

export default function ActivityFeed({ weddingId, limit: feedLimit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to suggestions
    const suggestionsQuery = query(
      collection(db, 'weddings', weddingId, 'suggestions'),
      orderBy('createdAt', 'desc'),
      limit(feedLimit)
    )

    const unsubscribeSuggestions = onSnapshot(suggestionsQuery, (snapshot) => {
      const suggestionActivities: Activity[] = []
      snapshot.forEach((doc) => {
        const suggestion = { id: doc.id, ...doc.data() } as SongSuggestion
        suggestionActivities.push({
          id: `suggestion-${doc.id}`,
          type: 'suggestion',
          timestamp: suggestion.createdAt,
          data: suggestion
        })

        // Add approval/rejection activities
        if (suggestion.status !== 'pending') {
          suggestionActivities.push({
            id: `approval-${doc.id}`,
            type: 'approval',
            timestamp: suggestion.updatedAt,
            data: suggestion
          })
        }
      })

      // Combine all activities and sort by timestamp
      const allActivities = [...suggestionActivities]
        .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
        .slice(0, feedLimit)

      setActivities(allActivities)
      setLoading(false)
    })

    return () => {
      unsubscribeSuggestions()
    }
  }, [weddingId, feedLimit])

  const formatTime = (timestamp: Timestamp) => {
    const now = new Date()
    const activityTime = timestamp.toDate()
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'suggestion':
        return <Music className="w-5 h-5 text-purple-400" />
      case 'vote':
        return <ThumbsUp className="w-5 h-5 text-blue-400" />
      case 'approval':
        return activity.data.status === 'approved' 
          ? <CheckCircle className="w-5 h-5 text-green-400" />
          : <XCircle className="w-5 h-5 text-red-400" />
      case 'join':
        return <UserPlus className="w-5 h-5 text-pink-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'suggestion':
        return (
          <div className="space-y-2">
            <p className="text-white/90">Guest suggested</p>
            <SongCard
              title={activity.data.customSong?.title || ''}
              artist={activity.data.customSong?.artist || ''}
              spotifyId={activity.data.spotifyId}
              variant="minimal"
              showPreview={false}
              showSpotifyLink={true}
            />
          </div>
        )
      case 'approval':
        return (
          <div className="space-y-2">
            <p className="text-white/90">
              {activity.data.status === 'approved' ? (
                <span className="font-semibold text-green-400">Approved</span>
              ) : (
                <span className="font-semibold text-red-400">Declined</span>
              )}
            </p>
            <SongCard
              title={activity.data.customSong?.title || ''}
              artist={activity.data.customSong?.artist || ''}
              spotifyId={activity.data.spotifyId}
              variant="minimal"
              showPreview={false}
              showSpotifyLink={true}
            />
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="glass-darker rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="glass-darker rounded-xl p-8 text-center">
        <Clock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
        <p className="text-white/60">Activities will appear here as guests interact</p>
      </div>
    )
  }

  return (
    <div className="glass-darker rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 gradient-text">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
              {getActivityIcon(activity)}
            </div>
            <div className="flex-1 min-w-0">
              {getActivityMessage(activity)}
              <p className="text-sm text-white/50 mt-1">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}