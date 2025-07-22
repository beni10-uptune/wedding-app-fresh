'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createInvitation, getWeddingInvitations } from '@/lib/invitations'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Wedding, Invitation } from '@/types/wedding'
import Link from 'next/link'
import { ArrowLeft, Mail, Copy, Users, Check, X, Clock, HeartHandshake, Share2, QrCode } from 'lucide-react'

export default function GuestsManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [weddingId, setWeddingId] = useState<string>('')
  const [inviting, setInviting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Invite form state
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Invitation['role']>('guest')
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const [personalizedPrompt, setPersonalizedPrompt] = useState('')
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState('')

  useEffect(() => {
    params.then(({ id }) => {
      setWeddingId(id)
    })
  }, [params])

  useEffect(() => {
    if (!user || !weddingId) {
      if (!user) router.push('/auth/login')
      return
    }

    loadWedding()
    loadInvitations()
  }, [user, weddingId])

  const loadWedding = async () => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (weddingDoc.exists()) {
        const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as Wedding
        
        // Check if user has access
        if (!weddingData.owners.includes(user?.uid || '')) {
          router.push('/')
          return
        }
        
        setWedding(weddingData)
      }
    } catch (err) {
      console.error('Error loading wedding:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadInvitations = async () => {
    try {
      const invites = await getWeddingInvitations(weddingId)
      setInvitations(invites)
    } catch (err) {
      console.error('Error loading invitations:', err)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !email || !wedding) return

    setInviting(true)
    try {
      const inviteData = {
        weddingId,
        email,
        role,
        userId: user.uid,
        personalizedPrompt: useCustomPrompt ? personalizedPrompt : getPromptByTemplate(selectedPromptTemplate)
      }
      
      const invitation = await createInvitation(inviteData)
      
      // Send email
      try {
        const inviteLink = `${window.location.origin}/auth/guest-join/${weddingId}?code=${invitation.inviteCode}`
        
        await fetch('/api/send-invitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            coupleNames: wedding.coupleNames || [wedding.coupleName1, wedding.coupleName2].filter(Boolean),
            weddingDate: wedding.weddingDate.toDate().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            venue: wedding.venue,
            inviteLink,
            personalizedPrompt: inviteData.personalizedPrompt,
            role
          })
        })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Continue even if email fails
      }
      
      await loadInvitations()
      
      // Reset form
      setEmail('')
      setRole('guest')
      setUseCustomPrompt(false)
      setPersonalizedPrompt('')
      setSelectedPromptTemplate('')
      setShowInviteForm(false)
    } catch (err) {
      console.error('Error creating invitation:', err)
    } finally {
      setInviting(false)
    }
  }

  const getPromptByTemplate = (template: string) => {
    const prompts: { [key: string]: string } = {
      'dance': 'What songs always get you on the dance floor? Share 3-5 party favorites!',
      'romantic': 'What are the most romantic songs you know? Help us set the mood!',
      'dinner': 'What songs create the perfect dinner ambiance? Share your favorites!',
      'ceremony': 'What songs would make our ceremony even more special?',
      '80s': "We love your taste in 80's music! Give us your top 3 throwback hits!",
      '90s': "You're our 90's music expert! What are your must-play classics?",
      'rock': 'We need some rock energy! What are your favorite rock anthems?',
      'country': 'Help us add some country charm! What are your favorite country songs?'
    }
    return prompts[template] || ''
  }

  const copyInviteLink = (invitation: Invitation) => {
    const link = `${window.location.origin}/auth/guest-join/${weddingId}?code=${invitation.inviteCode}`
    navigator.clipboard.writeText(link)
    setCopiedId(invitation.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-500/20'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20'
      case 'declined': return 'text-red-400 bg-red-500/20'
      case 'expired': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <Check className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'declined': return <X className="w-4 h-4" />
      default: return null
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

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 glass-darker border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Guest Management</h1>
                <p className="text-sm text-purple-400">{wedding?.coupleNames?.join(' & ')}&apos;s Wedding</p>
              </div>
            </div>

            <button
              onClick={() => setShowInviteForm(true)}
              className="btn-primary"
            >
              <Mail className="w-5 h-5" />
              Invite Guest
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Share Link Section */}
        <div className="glass-gradient rounded-xl p-6 mb-8 border border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Share with your guests
              </h3>
              <p className="text-white/80 mb-4">
                Share this link with your guests so they can suggest songs for your special day.
              </p>
              <div className="flex gap-3 items-center">
                <div className="flex-1 glass-darker rounded-lg px-4 py-3">
                  <code className="text-sm text-purple-300 break-all">
                    {`${window.location.origin}/join/${weddingId}`}
                  </code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/join/${weddingId}`)
                    setCopiedId('share-link')
                    setTimeout(() => setCopiedId(null), 2000)
                  }}
                  className="btn-primary"
                >
                  {copiedId === 'share-link' ? (
                    <><Check className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy</>  
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Invites</p>
                <p className="text-2xl font-bold text-white">{invitations.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Accepted</p>
                <p className="text-2xl font-bold text-green-400">
                  {invitations.filter(i => i.status === 'accepted').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {invitations.filter(i => i.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Declined</p>
                <p className="text-2xl font-bold text-red-400">
                  {invitations.filter(i => i.status === 'declined').length}
                </p>
              </div>
              <X className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Invitations list */}
        <div className="glass-darker rounded-xl border border-white/10">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold gradient-text">Invitations</h2>
          </div>
          
          {invitations.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No invitations yet</h3>
              <p className="text-white/60">Start inviting guests to collaborate on your wedding playlist!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="px-6 py-4 hover:bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-white">{invitation.email}</p>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400 capitalize">
                          {invitation.role}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(invitation.status)}`}>
                          {getStatusIcon(invitation.status)}
                          {invitation.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mt-1">
                        Invited {new Date(invitation.invitedAt.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => copyInviteLink(invitation)}
                      className="flex items-center gap-2 px-4 py-2 text-sm glass rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {copiedId === invitation.id ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Invite form modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-darker rounded-xl max-w-md w-full p-6 border border-white/20">
            <h2 className="text-2xl font-bold gradient-text mb-4">Invite Guest</h2>
            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="guest@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Invitation['role'])}
                  className="input"
                >
                  <option value="guest">Guest</option>
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="wedding-party">Wedding Party</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Song Request Prompt
                </label>
                
                {!useCustomPrompt ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPromptTemplate('dance')}
                        className={`p-3 rounded-lg border text-sm text-left transition-all ${
                          selectedPromptTemplate === 'dance' 
                            ? 'border-purple-500 bg-purple-500/20 text-white' 
                            : 'border-white/20 text-white/70 hover:border-purple-400'
                        }`}
                      >
                        💃 Dance Floor Hits
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPromptTemplate('romantic')}
                        className={`p-3 rounded-lg border text-sm text-left transition-all ${
                          selectedPromptTemplate === 'romantic' 
                            ? 'border-purple-500 bg-purple-500/20 text-white' 
                            : 'border-white/20 text-white/70 hover:border-purple-400'
                        }`}
                      >
                        💕 Romantic Vibes
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPromptTemplate('80s')}
                        className={`p-3 rounded-lg border text-sm text-left transition-all ${
                          selectedPromptTemplate === '80s' 
                            ? 'border-purple-500 bg-purple-500/20 text-white' 
                            : 'border-white/20 text-white/70 hover:border-purple-400'
                        }`}
                      >
                        🎸 80's Classics
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPromptTemplate('ceremony')}
                        className={`p-3 rounded-lg border text-sm text-left transition-all ${
                          selectedPromptTemplate === 'ceremony' 
                            ? 'border-purple-500 bg-purple-500/20 text-white' 
                            : 'border-white/20 text-white/70 hover:border-purple-400'
                        }`}
                      >
                        💒 Ceremony Songs
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setUseCustomPrompt(true)}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Write custom prompt →
                    </button>
                  </>
                ) : (
                  <>
                    <textarea
                      value={personalizedPrompt}
                      onChange={(e) => setPersonalizedPrompt(e.target.value)}
                      className="input min-h-[80px]"
                      placeholder="E.g., 'We love your taste in jazz! Please suggest 3-5 smooth jazz songs for our cocktail hour.'"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomPrompt(false)
                        setPersonalizedPrompt('')
                      }}
                      className="text-sm text-purple-400 hover:text-purple-300 mt-2"
                    >
                      ← Use template instead
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="px-4 py-2 text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="btn-primary"
                >
                  {inviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}