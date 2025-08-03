'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { UPGRADE_TRIGGERS } from '@/lib/subscription-tiers'
import { getClientPricing, type PricingInfo } from '@/lib/pricing-utils-client'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  trigger: keyof typeof UPGRADE_TRIGGERS
  weddingId?: string
}

export default function UpgradeModal({ isOpen, onClose, trigger, weddingId }: UpgradeModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [pricing, setPricing] = useState<PricingInfo>({ 
    amount: 25, 
    currency: 'USD', 
    symbol: '$', 
    displayPrice: '$25' 
  })
  
  const triggerData = UPGRADE_TRIGGERS[trigger]
  
  useEffect(() => {
    setPricing(getClientPricing())
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative max-w-md w-full glass-gradient rounded-3xl p-8 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
        
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        {/* Content */}
        <h2 className="text-2xl font-serif font-bold text-white text-center mb-4">
          {triggerData.title}
        </h2>
        <p className="text-white/80 text-center mb-8">
          {triggerData.message}
        </p>
        
        {/* Benefits */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span className="text-white/90">Unlimited songs & playlists</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span className="text-white/90">Export to Spotify & PDF</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span className="text-white/90">Unlimited guest collaboration</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span className="text-white/90">Lifetime access - {pricing.displayPrice} one time</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href={weddingId ? `/wedding/${weddingId}/payment` : '/pricing'}
            className="btn-primary w-full text-center"
          >
            {triggerData.cta}
          </Link>
          <button
            onClick={handleClose}
            className="w-full text-white/60 hover:text-white transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}