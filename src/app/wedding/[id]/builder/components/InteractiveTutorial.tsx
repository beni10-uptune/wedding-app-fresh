'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ChevronRight, Search, Music, 
  MousePointer, Hand, Sparkles, Check
} from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: string // Optional action to watch for
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Music Builder! 🎵',
    description: 'Let\'s take a quick tour to help you get started',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'timeline',
    title: 'Your Wedding Timeline',
    description: 'Each moment of your wedding has its own music section. You can see the recommended duration and current progress.',
    target: '[data-tutorial="timeline"]',
    position: 'left'
  },
  {
    id: 'search',
    title: 'Search for Songs',
    description: 'Use the search bar to find any song. Try searching for your favorite artist or song title!',
    target: '[data-tutorial="search-input"]',
    position: 'bottom',
    action: 'search'
  },
  {
    id: 'add-song',
    title: 'Adding Songs',
    description: 'Click the "+ Add" button to choose which moment to add the song to, or drag it directly to a timeline moment.',
    target: '[data-tutorial="song-card"]',
    position: 'right'
  },
  {
    id: 'drag-drop',
    title: 'Drag & Drop',
    description: 'You can also drag songs directly from search results to any moment in your timeline. The drop zones will light up!',
    target: '[data-tutorial="timeline-moment"]',
    position: 'left'
  },
  {
    id: 'collections',
    title: 'Curated Collections',
    description: 'Browse our expertly curated song collections for each wedding moment. Perfect if you need inspiration!',
    target: '[data-tutorial="collections-tab"]',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    description: 'Start building your perfect wedding soundtrack. Remember, you can always undo changes with Cmd+Z!',
    target: 'body',
    position: 'bottom'
  }
]

interface InteractiveTutorialProps {
  onComplete: () => void
  onSkip: () => void
}

export default function InteractiveTutorial({ onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(true)

  const currentTutorialStep = tutorialSteps[currentStep]

  useEffect(() => {
    updateHighlightPosition()
    window.addEventListener('resize', updateHighlightPosition)
    window.addEventListener('scroll', updateHighlightPosition)
    
    return () => {
      window.removeEventListener('resize', updateHighlightPosition)
      window.removeEventListener('scroll', updateHighlightPosition)
    }
  }, [currentStep])

  const updateHighlightPosition = () => {
    const target = currentTutorialStep.target
    if (target === 'body') {
      setHighlightPosition({ top: 0, left: 0, width: 0, height: 0 })
      return
    }

    const element = document.querySelector(target)
    if (element) {
      const rect = element.getBoundingClientRect()
      setHighlightPosition({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16
      })
    }
  }

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getTooltipPosition = () => {
    const { position } = currentTutorialStep
    const { top, left, width, height } = highlightPosition
    
    const tooltipWidth = 320
    const tooltipHeight = 200 // Approximate
    const padding = 16
    
    switch (position) {
      case 'top':
        return {
          top: top - tooltipHeight - padding,
          left: left + (width / 2) - (tooltipWidth / 2)
        }
      case 'bottom':
        return {
          top: top + height + padding,
          left: left + (width / 2) - (tooltipWidth / 2)
        }
      case 'left':
        return {
          top: top + (height / 2) - (tooltipHeight / 2),
          left: left - tooltipWidth - padding
        }
      case 'right':
        return {
          top: top + (height / 2) - (tooltipHeight / 2),
          left: left + width + padding
        }
      default:
        return { top: 100, left: 100 }
    }
  }

  if (!isVisible) return null

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === tutorialSteps.length - 1
  const tooltipPosition = getTooltipPosition()

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] pointer-events-none">
        {/* Backdrop with cutout */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="tutorial-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {currentTutorialStep.target !== 'body' && (
                <rect
                  x={highlightPosition.left}
                  y={highlightPosition.top}
                  width={highlightPosition.width}
                  height={highlightPosition.height}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.8)"
            mask="url(#tutorial-mask)"
            className="pointer-events-auto"
            onClick={onSkip}
          />
        </svg>

        {/* Highlight border */}
        {currentTutorialStep.target !== 'body' && highlightPosition.width > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute pointer-events-none"
            style={{
              top: highlightPosition.top,
              left: highlightPosition.left,
              width: highlightPosition.width,
              height: highlightPosition.height
            }}
          >
            <div className="absolute inset-0 rounded-lg ring-4 ring-purple-400 ring-opacity-75 animate-pulse" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <MousePointer className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute bg-slate-900 border border-purple-400/50 rounded-lg shadow-2xl p-6 w-80 pointer-events-auto"
          style={{
            top: currentTutorialStep.target === 'body' ? '50%' : tooltipPosition.top,
            left: currentTutorialStep.target === 'body' ? '50%' : tooltipPosition.left,
            transform: currentTutorialStep.target === 'body' ? 'translate(-50%, -50%)' : 'none',
            maxWidth: '90vw'
          }}
        >
          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-3">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-purple-400'
                    : index < currentStep
                    ? 'w-4 bg-purple-400/60'
                    : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2">
            {currentTutorialStep.title}
          </h3>
          <p className="text-sm text-white/80 mb-6">
            {currentTutorialStep.description}
          </p>

          {/* Action hint */}
          {currentTutorialStep.action === 'search' && (
            <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-300 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Try searching for "Ed Sheeran" or your favorite artist
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`
                text-sm transition-colors
                ${isFirstStep 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white/60 hover:text-white'
                }
              `}
            >
              {!isFirstStep && '← Previous'}
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  Get Started
                  <Check className="w-4 h-4" />
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

        {/* Animated helper elements */}
        {currentTutorialStep.id === 'drag-drop' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none"
            style={{
              top: highlightPosition.top + highlightPosition.height / 2 - 20,
              left: highlightPosition.left - 100
            }}
          >
            <motion.div
              animate={{ x: [0, 80, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="flex items-center gap-2"
            >
              <Hand className="w-8 h-8 text-purple-400" />
              <div className="w-16 h-0.5 bg-purple-400/50" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}