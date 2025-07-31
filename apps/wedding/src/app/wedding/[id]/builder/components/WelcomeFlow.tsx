'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Music, ChevronRight, ChevronLeft, Check, 
  Sparkles, Heart, Users, Calendar,
  Headphones, Zap, Gift
} from 'lucide-react'
import { WeddingV2 } from '@/types/wedding-v2'

interface WelcomeFlowProps {
  wedding: WeddingV2
  onComplete: (preferences: {
    musicStyle: string[]
    mustHaveSongs: string[]
    avoidGenres: string[]
    vibe: string
  }) => void
  onSkip: () => void
}

const steps = [
  {
    id: 'welcome',
    title: "Let's Build Your Perfect Wedding Soundtrack! 🎵",
    icon: Music,
    description: "We'll help you create an unforgettable musical journey for your special day"
  },
  {
    id: 'style',
    title: "What's Your Wedding Style?",
    icon: Heart,
    description: "This helps us suggest the perfect songs for your vibe"
  },
  {
    id: 'must-haves',
    title: "Any Must-Have Songs?",
    icon: Sparkles,
    description: "Songs that are special to you as a couple"
  },
  {
    id: 'avoid',
    title: "Anything to Avoid?",
    icon: Zap,
    description: "Genres or songs you'd prefer not to hear"
  },
  {
    id: 'complete',
    title: "You're All Set!",
    icon: Gift,
    description: "Let's start building your timeline"
  }
]

const weddingStyles = [
  { id: 'classic', label: 'Classic & Elegant', icon: '🥂', description: 'Timeless and sophisticated' },
  { id: 'modern', label: 'Modern & Chic', icon: '✨', description: 'Contemporary and stylish' },
  { id: 'rustic', label: 'Rustic & Relaxed', icon: '🌿', description: 'Natural and laid-back' },
  { id: 'party', label: 'Party & Celebration', icon: '🎉', description: 'High energy and fun' },
  { id: 'romantic', label: 'Romantic & Intimate', icon: '💕', description: 'Soft and emotional' },
  { id: 'cultural', label: 'Cultural & Traditional', icon: '🌍', description: 'Heritage-focused' }
]

const avoidableGenres = [
  'Country', 'Heavy Metal', 'Rap/Hip-Hop', 'Electronic/EDM', 
  'Classical', 'Jazz', 'R&B', 'Rock', 'Pop', 'Indie'
]

export default function WelcomeFlow({ wedding, onComplete, onSkip }: WelcomeFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [mustHaveSongs, setMustHaveSongs] = useState<string[]>(['', '', ''])
  const [avoidGenres, setAvoidGenres] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      // Complete the flow
      const vibe = selectedStyles.includes('party') ? 'high-energy' : 
                   selectedStyles.includes('romantic') ? 'romantic' :
                   selectedStyles.includes('classic') ? 'elegant' : 'balanced'
      
      onComplete({
        musicStyle: selectedStyles,
        mustHaveSongs: mustHaveSongs.filter(s => s.trim()),
        avoidGenres,
        vibe
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return true
      case 'style':
        return selectedStyles.length > 0
      case 'must-haves':
        return true // Optional step
      case 'avoid':
        return true // Optional step
      case 'complete':
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
              <Music className="w-12 h-12 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-white/60">{step.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Headphones className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-sm text-white/60">Curated Songs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-sm text-white/60">Guest Requests</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-sm text-white/60">Perfect Timeline</p>
              </div>
            </div>
          </div>
        )
      
      case 'style':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-white/60">{step.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
              {weddingStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setSelectedStyles(prev => 
                      prev.includes(style.id) 
                        ? prev.filter(s => s !== style.id)
                        : [...prev, style.id]
                    )
                  }}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${selectedStyles.includes(style.id)
                      ? 'border-purple-400 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{style.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-white">{style.label}</p>
                      <p className="text-sm text-white/60">{style.description}</p>
                    </div>
                    {selectedStyles.includes(style.id) && (
                      <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/40 text-center">
              Select all that apply - you can choose multiple styles
            </p>
          </div>
        )
      
      case 'must-haves':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-white/60">{step.description}</p>
            </div>
            <div className="space-y-4 max-w-lg mx-auto">
              <p className="text-sm text-white/60 text-center">
                Add up to 3 songs you absolutely must have at your wedding
              </p>
              {mustHaveSongs.map((song, index) => (
                <input
                  key={index}
                  type="text"
                  value={song}
                  onChange={(e) => {
                    const newSongs = [...mustHaveSongs]
                    newSongs[index] = e.target.value
                    setMustHaveSongs(newSongs)
                  }}
                  placeholder={
                    index === 0 ? "e.g., Your first dance song" :
                    index === 1 ? "e.g., A family tradition" :
                    "e.g., Your favorite party song"
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
                />
              ))}
              <p className="text-xs text-white/40 text-center mt-4">
                Don't worry, you can add more songs later!
              </p>
            </div>
          </div>
        )
      
      case 'avoid':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-white/60">{step.description}</p>
            </div>
            <div className="max-w-lg mx-auto space-y-4">
              <p className="text-sm text-white/60 text-center">
                Select any genres you'd prefer to avoid
              </p>
              <div className="grid grid-cols-2 gap-2">
                {avoidableGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      setAvoidGenres(prev => 
                        prev.includes(genre) 
                          ? prev.filter(g => g !== genre)
                          : [...prev, genre]
                      )
                    }}
                    className={`
                      px-4 py-2 rounded-lg border transition-all text-sm
                      ${avoidGenres.includes(genre)
                        ? 'border-red-400 bg-red-500/20 text-red-300'
                        : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                      }
                    `}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 text-center mt-4">
                We'll avoid these in our suggestions
              </p>
            </div>
          </div>
        )
      
      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-12 h-12 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-white/60">{step.description}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-medium text-white mb-3">Your Preferences:</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p>• {selectedStyles.length} wedding style{selectedStyles.length !== 1 ? 's' : ''} selected</p>
                <p>• {mustHaveSongs.filter(s => s.trim()).length} must-have song{mustHaveSongs.filter(s => s.trim()).length !== 1 ? 's' : ''}</p>
                <p>• {avoidGenres.length} genre{avoidGenres.length !== 1 ? 's' : ''} to avoid</p>
              </div>
            </div>
            <p className="text-sm text-white/60">
              Ready to build your perfect wedding timeline! 🎉
            </p>
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-white/10 relative">
          <motion.div
            className="h-full bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={currentStep === 0 ? onSkip : handleBack}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            {currentStep === 0 ? (
              'Skip for now'
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Back
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-purple-400'
                    : index < currentStep
                    ? 'bg-purple-400/60'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isAnimating}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2
              ${canProceed() && !isAnimating
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
              }
            `}
          >
            {currentStep === steps.length - 1 ? (
              <>
                Start Building
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}