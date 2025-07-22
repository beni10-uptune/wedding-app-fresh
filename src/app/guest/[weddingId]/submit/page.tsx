'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Heart, Send, Check, 
  AlertCircle 
} from 'lucide-react'
import { 
  doc, getDoc, collection, addDoc, 
  query, where, getDocs, Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

interface Wedding {
  id: string
  coupleNames: string[]
  weddingDate: Timestamp
}

interface SongSubmission {
  title: string
  artist: string
  spotifyId?: string
  reason?: string
}

export default function GuestSubmitPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = use(params)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [submissions, setSubmissions] = useState<SongSubmission[]>([
    { title: '', artist: '', reason: '' },
    { title: '', artist: '', reason: '' },
    { title: '', artist: '', reason: '' }
  ])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    loadWedding()
  }, [weddingId, token])

  const loadWedding = async () => {
    try {
      // Verify token if provided
      if (token) {
        const invitationsRef = collection(db, 'weddings', weddingId, 'invitations')
        const q = query(invitationsRef, where('token', '==', token))
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          const invitation = snapshot.docs[0].data()
          setGuestEmail(invitation.email)
        }
      }

      // Load wedding details
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (weddingDoc.exists()) {
        setWedding({ id: weddingDoc.id, ...weddingDoc.data() } as Wedding)
      } else {
        setError('Wedding not found')
      }
    } catch (err) {
      console.error('Error loading wedding:', err)
      setError('Failed to load wedding details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmissionChange = (index: number, field: keyof SongSubmission, value: string) => {
    const newSubmissions = [...submissions]
    newSubmissions[index] = { ...newSubmissions[index], [field]: value }
    setSubmissions(newSubmissions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Filter out empty submissions
      const validSubmissions = submissions.filter(s => s.title && s.artist)
      
      if (validSubmissions.length === 0) {
        setError('Please suggest at least one song')
        setSubmitting(false)
        return
      }

      // Save submissions to Firestore
      const submissionsRef = collection(db, 'weddings', weddingId, 'guestSubmissions')
      const promises = validSubmissions.map(submission => 
        addDoc(submissionsRef, {
          guestEmail: guestEmail,
          guestName: guestName,
          songTitle: submission.title,
          songArtist: submission.artist,
          message: submission.reason,
          submittedAt: Timestamp.now(),
          status: 'pending',
          votes: 0
        })
      )

      await Promise.all(promises)
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting songs:', err)
      setError('Failed to submit songs. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !wedding) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center p-4">
        <div className="glass-gradient rounded-3xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Thank You!
          </h2>
          <p className="text-lg text-white/80 mb-6">
            Your song suggestions have been submitted to {wedding?.coupleNames.join(' & ')}.
          </p>
          <p className="text-white/60">
            They'll review your suggestions and add their favorites to the wedding playlist!
          </p>
          <Link href="/" className="btn-primary mt-8">
            Done
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-pink w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <h1 className="text-3xl font-serif font-bold text-white">
              {wedding?.coupleNames.join(' & ')}'s Wedding
            </h1>
          </div>
          <p className="text-lg text-white/80">
            Help us create the perfect wedding playlist!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-gradient rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Suggest Your Favorite Songs
          </h2>
          <p className="text-white/60 mb-6">
            What songs would get you on the dance floor? Share up to 3 songs you'd love to hear!
          </p>

          {/* Guest Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
                placeholder="john@example.com"
                required
                readOnly={!!token}
              />
            </div>
          </div>

          {/* Song Submissions */}
          <div className="space-y-6">
            {submissions.map((submission, index) => (
              <div key={index} className="glass-darker rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Song {index + 1} {index === 0 && <span className="text-sm text-white/60 font-normal">(Required)</span>}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Song Title
                    </label>
                    <input
                      type="text"
                      value={submission.title}
                      onChange={(e) => handleSubmissionChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Perfect"
                      required={index === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Artist
                    </label>
                    <input
                      type="text"
                      value={submission.artist}
                      onChange={(e) => handleSubmissionChange(index, 'artist', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Ed Sheeran"
                      required={index === 0}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Why this song? (Optional)
                  </label>
                  <textarea
                    value={submission.reason}
                    onChange={(e) => handleSubmissionChange(index, 'reason', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400 h-20 resize-none"
                    placeholder="This song always gets everyone dancing..."
                  />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-8"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Songs
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-white/40">
            Powered by{' '}
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              UpTune Weddings
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}