'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/blog/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-purple-50 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Mail className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="font-semibold">Weekly Wedding Music Tips</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Get expert advice and trending playlists delivered to your inbox every week.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={loading}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-3">
        No spam, unsubscribe anytime. By subscribing, you agree to our privacy policy.
      </p>
    </div>
  )
}