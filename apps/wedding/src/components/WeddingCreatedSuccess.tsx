'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Music, Users, Download, Sparkles, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { getClientPricing, type PricingInfo } from '@/lib/pricing-utils-client'

interface WeddingCreatedSuccessProps {
  weddingId: string
  weddingSlug?: string
  coupleName1?: string
  coupleName2?: string
  selectedMoments?: number
  onClose: () => void
}

export function WeddingCreatedSuccess({ 
  weddingId, 
  weddingSlug,
  coupleName1 = 'Partner 1',
  coupleName2 = 'Partner 2',
  selectedMoments = 4,
  onClose 
}: WeddingCreatedSuccessProps) {
  const [showUpsell, setShowUpsell] = useState(false)
  const [pricing, setPricing] = useState<PricingInfo>({ 
    amount: 25, 
    currency: 'USD', 
    symbol: '$', 
    displayPrice: '$25' 
  })

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#8b5cf6']
    })

    // Show upsell after delay
    const timer = setTimeout(() => {
      setShowUpsell(true)
    }, 2000)
    
    // Get client pricing
    setPricing(getClientPricing())

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        {/* Success Message */}
        <h2 className="text-3xl font-serif font-bold text-white mb-2">
          Wedding Created! 🎉
        </h2>
        <p className="text-white/80 mb-8">
          {coupleName1} & {coupleName2}, your musical journey begins now!
        </p>

        {/* What You've Unlocked */}
        <div className="space-y-3 mb-8">
          <h3 className="font-semibold text-white mb-3">Here's what's ready for you:</h3>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 text-left glass-darker rounded-lg p-3"
          >
            <Music className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">{selectedMoments} Wedding Moments</p>
              <p className="text-xs text-white/60">Ready for your perfect songs</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 text-left glass-darker rounded-lg p-3"
          >
            <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Guest Collaboration</p>
              <p className="text-xs text-white/60">Invite up to 3 guests to suggest songs</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 text-left glass-darker rounded-lg p-3"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">AI Suggestions</p>
              <p className="text-xs text-white/60">Smart recommendations based on your style</p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/wedding/${weddingId}/builder`}>
            <button className="btn-primary w-full text-lg py-3 group">
              Start Adding Songs
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          {/* Upsell Section */}
          {showUpsell && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 p-4 glass-darker rounded-xl border border-purple-500/30"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-1">
                    Want Unlimited Songs?
                  </h4>
                  <p className="text-sm text-white/70 mb-3">
                    Your free plan includes 10 songs. Most couples need 50-100 songs for their full wedding.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">{pricing.displayPrice}</span>
                    <span className="text-sm text-white/60 line-through">{pricing.symbol}{pricing.amount * 2}</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                      50% OFF
                    </span>
                  </div>
                  <Link href={`/wedding/${weddingId}/payment`}>
                    <button className="mt-3 w-full btn-glass text-sm py-2">
                      Upgrade Now - Unlimited Everything
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-sm"
          >
            I'll start with the free plan
          </button>
        </div>

        {/* Video Tutorial Prompt */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-white/60 mb-2">New to UpTune?</p>
          <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 mx-auto">
            <Play className="w-4 h-4" />
            Watch 2-min tutorial
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}