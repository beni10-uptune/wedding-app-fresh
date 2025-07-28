'use client'

import { useState } from 'react'
import { X, Mail, Send, Copy, Check } from 'lucide-react'
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { generateInviteToken } from '@/lib/utils'

interface GuestInviteModalProps {
  weddingId: string
  coupleNames: string[]
  onClose: () => void
  onSuccess: () => void
}

export default function GuestInviteModal({ 
  weddingId, 
  coupleNames,
  onClose, 
  onSuccess 
}: GuestInviteModalProps) {
  const [emails, setEmails] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)

    try {
      // Parse emails (comma or newline separated)
      const emailList = emails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0)

      // Validate emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalidEmails = emailList.filter(email => !emailRegex.test(email))
      
      if (invalidEmails.length > 0) {
        setError(`Invalid emails: ${invalidEmails.join(', ')}`)
        setSending(false)
        return
      }

      if (emailList.length === 0) {
        setError('Please enter at least one email address')
        setSending(false)
        return
      }

      // Create invitations in Firestore and send emails
      const invitationsRef = collection(db, 'weddings', weddingId, 'invitations')
      
      // Get wedding details for email
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      const weddingData = weddingDoc.data()
      
      const promises = emailList.map(async (email) => {
        const token = generateInviteToken()
        
        // Save invitation to Firestore
        await addDoc(invitationsRef, {
          email,
          token,
          sentAt: Timestamp.now(),
          customMessage: customMessage || null,
          firstViewedAt: null,
          submittedAt: null
        })

        // Send email invitation
        const inviteLink = `${window.location.origin}/guest/${weddingId}?token=${token}`
        
        try {
          await fetch('/api/send-invitation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'guest',
              email,
              coupleNames,
              weddingDate: weddingData?.weddingDate || null,
              venue: weddingData?.venue || '',
              inviteLink,
              personalizedPrompt: customMessage || "We'd love your song suggestions for our special day!",
              role: 'guest'
            })
          })
        } catch (emailError) {
          console.error('Failed to send email to', email, emailError)
          // Continue with other emails even if one fails
        }
      })

      await Promise.all(promises)
      
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error sending invitations:', err)
      setError('Failed to send invitations. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleCopyLink = () => {
    // In production, this would be the actual guest submission URL
    const link = `${window.location.origin}/guest/${weddingId}`
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-gradient rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Invite Guests to Suggest Songs</h3>
            <p className="text-white/60 mt-1">Let your guests help create the perfect playlist</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Guest Email Addresses
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-white/40" />
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Enter emails separated by commas or new lines&#10;john@example.com, jane@example.com&#10;or&#10;john@example.com&#10;jane@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400 h-32 resize-none"
                required
              />
            </div>
            <p className="text-xs text-white/40 mt-1">
              Add multiple emails separated by commas or new lines
            </p>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message to your guests..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400 h-24 resize-none"
            />
          </div>

          {/* Preview */}
          <div className="glass-darker rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Email Preview</h4>
            <div className="text-sm text-white/70 space-y-2">
              <p><strong>Subject:</strong> Help {coupleNames.join(' & ')} pick their wedding songs! 🎵</p>
              <p><strong>Message:</strong></p>
              <p className="pl-4">
                {customMessage || `We'd love your help creating the perfect playlist for our special day! Please suggest up to 3 songs you'd love to hear at our wedding.`}
              </p>
              <p className="pl-4 text-purple-400">
                [Click here to submit your song suggestions]
              </p>
            </div>
          </div>

          {/* Share Link Option */}
          <div className="glass-darker rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">Or share a direct link</h4>
                <p className="text-xs text-white/60 mt-1">Share this link on social media or messaging apps</p>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-secondary text-sm"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="btn-primary"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Invitations
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}