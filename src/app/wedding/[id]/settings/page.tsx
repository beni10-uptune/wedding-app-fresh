'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { 
  ArrowLeft, Settings, Users, Mail, Copy, Check, X, 
  UserPlus, Shield, AlertCircle 
} from 'lucide-react'

interface Wedding {
  id: string
  coupleNames: string[]
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
        router.push('/dashboard')
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as Wedding
      
      // Check if user has access
      if (!weddingData.owners.includes(user?.uid || '')) {
        router.push('/dashboard')
        return
      }
      
      setWedding(weddingData)
      setCoOwners(weddingData.owners.filter(id => id !== user?.uid))
    } catch (error) {
      console.error('Error loading wedding:', error)
      router.push('/dashboard')
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
    if (!coOwnerEmail || !wedding) return

    setSaving(true)
    try {
      // For now, we'll just copy the invite link
      // In production, this would send an email
      const inviteLink = generateInviteLink()
      navigator.clipboard.writeText(inviteLink)
      setCopiedId('co-owner-link')
      
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
                href="/dashboard"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Wedding Settings</h1>
                <p className="text-sm text-purple-400">{wedding.coupleNames.join(' & ')}'s Wedding</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Co-owner Management */}
        <div className="glass-darker rounded-xl border border-white/10 mb-8">
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Co-owners</h2>
              </div>
              <button
                onClick={() => setShowAddCoOwner(true)}
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
    </div>
  )
}