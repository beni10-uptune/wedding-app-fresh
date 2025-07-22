'use client'

import { useState, useEffect } from 'react'
import { 
  collection, query, where, onSnapshot, 
  doc, updateDoc, Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { GuestSubmission } from '@/types/wedding-v2'
import { 
  Users, Check, X, 
  TrendingUp, Music, AlertCircle,
  Share2, ExternalLink
} from 'lucide-react'

interface GuestSubmissionsProps {
  weddingId: string
  onAddSong: (song: any, momentId: string) => void
}

export default function GuestSubmissions({ weddingId, onAddSong }: GuestSubmissionsProps) {
  const [submissions, setSubmissions] = useState<GuestSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    // Subscribe to guest submissions
    const q = query(
      collection(db, 'weddings', weddingId, 'guestSubmissions'),
      where('status', '==', filter === 'all' ? undefined : filter)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestSubmission[]
      
      // Sort by submission date
      submissionsData.sort((a, b) => 
        b.submittedAt.toMillis() - a.submittedAt.toMillis()
      )
      
      setSubmissions(submissionsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [weddingId, filter])

  const handleApprove = async (submission: GuestSubmission) => {
    try {
      await updateDoc(
        doc(db, 'weddings', weddingId, 'guestSubmissions', submission.id),
        { status: 'approved' }
      )
      
      // Add to timeline (you can choose which moment)
      onAddSong({
        id: submission.songSpotifyId || `guest-${submission.id}`,
        title: submission.songTitle,
        artist: submission.songArtist,
        duration: 210, // Default duration
        addedBy: 'guest',
        addedAt: Timestamp.now()
      }, 'danceFloor') // Default to dance floor, but you could show a selector
    } catch (error) {
      console.error('Error approving submission:', error)
    }
  }

  const handleReject = async (submissionId: string) => {
    try {
      await updateDoc(
        doc(db, 'weddings', weddingId, 'guestSubmissions', submissionId),
        { status: 'rejected' }
      )
    } catch (error) {
      console.error('Error rejecting submission:', error)
    }
  }

  // Group submissions by song
  const groupedSubmissions = submissions.reduce((acc, submission) => {
    const key = `${submission.songTitle}-${submission.songArtist}`.toLowerCase()
    if (!acc[key]) {
      acc[key] = {
        songTitle: submission.songTitle,
        songArtist: submission.songArtist,
        submissions: []
      }
    }
    acc[key].submissions.push(submission)
    return acc
  }, {} as Record<string, { songTitle: string; songArtist: string; submissions: GuestSubmission[] }>)

  // Sort by number of requests
  const sortedGroups = Object.values(groupedSubmissions).sort(
    (a, b) => b.submissions.length - a.submissions.length
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (submissions.length === 0 && filter === 'pending') {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-white mb-2">No pending requests</h4>
        <p className="text-white/60">Guest song suggestions will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Share Link */}
      <div className="glass-darker rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-purple-400" />
            <div>
              <h4 className="font-medium text-white">Share with Guests</h4>
              <p className="text-sm text-white/60">Let guests suggest their favorite songs</p>
            </div>
          </div>
          <a
            href={`/join/${weddingId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Guest Form
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-purple-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {sortedGroups.map((group, index) => {
          const pendingSubmissions = group.submissions.filter(s => s.status === 'pending')
          const isApproved = group.submissions.some(s => s.status === 'approved')
          const isRejected = group.submissions.every(s => s.status === 'rejected')
          
          if (filter !== 'all' && pendingSubmissions.length === 0) return null

          return (
            <div key={index} className="glass-darker rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-medium text-white">{group.songTitle}</h4>
                      <p className="text-sm text-white/60">{group.songArtist}</p>
                    </div>
                  </div>
                  
                  {/* Request count */}
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/80">
                      Requested by {group.submissions.length} guest{group.submissions.length > 1 ? 's' : ''}
                    </span>
                    {isApproved && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Rejected
                      </span>
                    )}
                  </div>

                  {/* Guest messages */}
                  {group.submissions.some(s => s.message) && (
                    <div className="space-y-2 mb-3">
                      {group.submissions.filter(s => s.message).map((submission) => (
                        <div key={submission.id} className="text-sm">
                          <p className="text-white/40">
                            {submission.guestName || submission.guestEmail}:
                          </p>
                          <p className="text-white/70 pl-4 italic">"{submission.message}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {filter === 'pending' && pendingSubmissions.length > 0 && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(pendingSubmissions[0])}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                      title="Approve and add to playlist"
                    >
                      <Check className="w-5 h-5 text-green-400" />
                    </button>
                    <button
                      onClick={() => handleReject(pendingSubmissions[0].id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Reject suggestion"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Explicit content warning */}
              {group.submissions.some(s => s.songTitle.toLowerCase().includes('explicit')) && (
                <div className="mt-3 flex items-center gap-2 text-sm text-yellow-400">
                  <AlertCircle className="w-4 h-4" />
                  May contain explicit content
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stats Summary */}
      {submissions.length > 0 && (
        <div className="glass-darker rounded-xl p-6">
          <h4 className="font-medium text-white mb-3">Guest Insights</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold gradient-text">{submissions.length}</p>
              <p className="text-sm text-white/60">Total Suggestions</p>
            </div>
            <div>
              <p className="text-2xl font-bold gradient-text">
                {new Set(submissions.map(s => s.guestEmail)).size}
              </p>
              <p className="text-sm text-white/60">Guests Participated</p>
            </div>
            <div>
              <p className="text-2xl font-bold gradient-text">
                {Object.keys(groupedSubmissions).length}
              </p>
              <p className="text-sm text-white/60">Unique Songs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}