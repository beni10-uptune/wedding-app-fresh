'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { 
  ArrowLeft, Users, Check, 
  UserPlus, Shield, AlertCircle, Crown,
  Globe, Copy, Edit2
} from 'lucide-react'
import UpgradeModal from '@/components/UpgradeModal'
import { getUserTier } from '@/lib/subscription-tiers'
import { isValidSlug, isSlugAvailable, sanitizeSlug } from '@/lib/slug-utils'
import { config } from '@/lib/config'

interface Wedding {
  id: string
  slug?: string
  coupleNames?: string[]
  coupleName1?: string
  coupleName2?: string
  owners: string[]
  weddingDate: any
  venue?: string
  paymentStatus?: string
}

export default function WeddingSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Co-owner management
  const [coOwnerEmail, setCoOwnerEmail] = useState('')
  const [coOwners, setCoOwners] = useState<string[]>([])
  const [showAddCoOwner, setShowAddCoOwner] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Slug management
  const [isEditingSlug, setIsEditingSlug] = useState(false)
  const [newSlug, setNewSlug] = useState('')
  const [slugError, setSlugError] = useState('')
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    loadWedding()
  }, [user, weddingId])

  const loadWedding = async () => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (!weddingDoc.exists()) {
        router.push('/builder')
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as Wedding
      
      // Check if user has access
      if (!weddingData.owners.includes(user?.uid || '')) {
        router.push('/builder')
        return
      }
      
      setWedding(weddingData)
      setCoOwners(weddingData.owners.filter(id => id !== user?.uid))
    } catch (error) {
      console.error('Error loading wedding:', error)
      router.push('/builder')
    } finally {
      setLoading(false)
    }
  }

  const generateInviteLink = () => {
    // Generate a unique invite code for co-owner
    const inviteCode = Math.random().toString(36).substring(2, 15)
    return `${window.location.origin}/auth/co-owner-join/${weddingId}?code=${inviteCode}`
  }

  const handleAddCoOwner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coOwnerEmail || !wedding || !user) return

    setSaving(true)
    try {
      const inviteLink = generateInviteLink()
      
      // Send email
      try {
        await fetch('/api/send-invitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'co-owner',
            partnerEmail: coOwnerEmail,
            inviterName: user.displayName || user.email?.split('@')[0] || 'Your partner',
            coupleNames: wedding.coupleNames || [],
            weddingDate: wedding.weddingDate.toDate().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            venue: wedding.venue,
            inviteLink
          })
        })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Still copy link as fallback
        navigator.clipboard.writeText(inviteLink)
        setCopiedId('co-owner-link')
      }
      
      // Reset form
      setCoOwnerEmail('')
      setShowAddCoOwner(false)
      
      setTimeout(() => setCopiedId(null), 3000)
    } catch (error) {
      console.error('Error inviting co-owner:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSlugChange = async (value: string) => {
    const sanitized = sanitizeSlug(value)
    setNewSlug(sanitized)
    setSlugError('')
    
    if (sanitized.length < 3) {
      setSlugError('URL must be at least 3 characters')
      return
    }
    
    if (!isValidSlug(sanitized)) {
      setSlugError('URL can only contain lowercase letters, numbers, and hyphens')
      return
    }
    
    setIsCheckingSlug(true)
    try {
      const available = await isSlugAvailable(sanitized, weddingId)
      if (!available) {
        setSlugError('This URL is already taken')
      }
    } catch (error) {
      console.error('Error checking slug:', error)
    } finally {
      setIsCheckingSlug(false)
    }
  }

  const handleSaveSlug = async () => {
    if (!wedding || slugError || !newSlug) return
    
    setSaving(true)
    try {
      await updateDoc(doc(db, 'weddings', weddingId), {
        slug: newSlug,
        updatedAt: new Date()
      })
      
      setWedding({ ...wedding, slug: newSlug })
      setIsEditingSlug(false)
    } catch (error) {
      console.error('Error updating slug:', error)
      setSlugError('Failed to update URL. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!wedding) return null

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
                href="/builder"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Wedding Settings</h1>
                <p className="text-sm text-purple-400">{wedding.coupleNames?.join(' & ') || 'Wedding'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Free tier notice */}
        {wedding?.paymentStatus !== 'paid' && (
          <div className="glass-gradient rounded-xl p-4 mb-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white">Co-owners is a Premium Feature</p>
                  <p className="text-xs text-white/60">
                    Upgrade to collaborate with your partner on wedding planning
                  </p>
                </div>
              </div>
              <Link 
                href={`/wedding/${weddingId}/payment`}
                className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* Co-owner Management */}
        <div className="glass-darker rounded-xl border border-white/10 mb-8">
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Co-owners</h2>
              </div>
              <button
                onClick={() => {
                  const tier = getUserTier(wedding?.paymentStatus)
                  if (!tier.features.coOwner) {
                    setShowUpgradeModal(true)
                  } else {
                    setShowAddCoOwner(true)
                  }
                }}
                className="btn-primary text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Add Co-owner
              </button>
            </div>
          </div>

          <div className="p-6">
            <p className="text-white/60 mb-6">
              Co-owners have full access to manage the wedding, including music, guests, and settings.
            </p>

            {coOwners.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No co-owners yet</h3>
                <p className="text-white/60">
                  Invite your partner to collaborate on your wedding planning!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {coOwners.map((ownerId) => (
                  <div key={ownerId} className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <p className="text-white font-medium">Co-owner</p>
                      <p className="text-sm text-white/60">Full access</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {copiedId === 'co-owner-link' && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-medium">Invite link copied!</p>
                    <p className="text-green-300/80 text-sm mt-1">
                      Share this link with your partner. They'll need to create an account or sign in to join as a co-owner.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wedding URL Management */}
        <div className="glass-darker rounded-xl border border-white/10 mb-8">
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Wedding URL</h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-white/60 mb-6">
              Your custom wedding URL makes it easy for guests to find and join your wedding playlist.
            </p>

            <div className="space-y-4">
              {!isEditingSlug ? (
                <div className="flex items-center justify-between p-4 glass rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-white/60 mb-1">Your wedding URL</p>
                    <p className="text-white font-mono">
                      {config.getWeddingDomain()}/{wedding.slug || weddingId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const url = `${config.getWeddingDomain()}/${wedding.slug || weddingId}`
                        navigator.clipboard.writeText(url)
                        setCopiedId('wedding-url')
                        setTimeout(() => setCopiedId(null), 2000)
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copiedId === 'wedding-url' ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white" />
                      )}
                    </button>
                    {wedding.slug && (
                      <button
                        onClick={() => {
                          setNewSlug(wedding.slug || '')
                          setIsEditingSlug(true)
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Custom URL
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60">{config.getWeddingDomain()}/</span>
                      <input
                        type="text"
                        value={newSlug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="input flex-1"
                        placeholder="your-wedding-name"
                      />
                    </div>
                    {slugError && (
                      <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {slugError}
                      </p>
                    )}
                    {isCheckingSlug && (
                      <p className="text-sm text-white/60 mt-2">Checking availability...</p>
                    )}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setIsEditingSlug(false)
                        setNewSlug('')
                        setSlugError('')
                      }}
                      className="px-4 py-2 text-white/70 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSlug}
                      disabled={saving || !!slugError || !newSlug || isCheckingSlug}
                      className="btn-primary"
                    >
                      {saving ? 'Saving...' : 'Save URL'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!wedding.slug && !isEditingSlug && (
              <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-purple-400 font-medium">No custom URL yet</p>
                    <p className="text-purple-300/80 text-sm mt-1">
                      Create a custom URL to make it easier for guests to find your wedding.
                    </p>
                    <button
                      onClick={() => {
                        // Generate a suggestion based on couple names
                        const names = wedding.coupleNames || []
                        const suggestion = names.length > 0 
                          ? names.map(name => name?.toLowerCase().split(' ')[0] || '').join('-')
                          : ''
                        setNewSlug(suggestion)
                        setIsEditingSlug(true)
                      }}
                      className="text-sm text-purple-400 hover:text-purple-300 mt-2 font-medium"
                    >
                      Create Custom URL →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="glass-darker rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium mb-2">About Co-ownership</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Co-owners can manage all aspects of the wedding</li>
                <li>• They can add/remove songs and manage the timeline</li>
                <li>• They can invite and manage guests</li>
                <li>• Both partners should use their own accounts for better tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Add Co-owner Modal */}
      {showAddCoOwner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-darker rounded-xl max-w-md w-full p-6 border border-white/20">
            <h2 className="text-2xl font-bold gradient-text mb-4">Invite Co-owner</h2>
            <form onSubmit={handleAddCoOwner}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Partner's Email Address
                </label>
                <input
                  type="email"
                  value={coOwnerEmail}
                  onChange={(e) => setCoOwnerEmail(e.target.value)}
                  className="input"
                  placeholder="partner@example.com"
                  required
                />
                <p className="text-sm text-white/60 mt-2">
                  We'll generate an invite link for you to share with your partner.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddCoOwner(false)}
                  className="px-4 py-2 text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Generating...' : 'Generate Invite Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="CO_OWNER_BLOCKED"
        weddingId={weddingId}
      />
    </div>
  )
}