'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Clock, ArrowLeft, BookOpen, 
  Lightbulb, Music, ChevronRight,
  Sparkles, Heart, Star
} from 'lucide-react'
import { WeddingGuide, getRelatedGuides, getGuidesByMoment } from '@/data/weddingGuides'

interface GuideViewerProps {
  guide?: WeddingGuide
  momentId?: string
  onClose: () => void
  onSelectGuide: (guide: WeddingGuide) => void
}

export default function GuideViewer({ 
  guide: initialGuide, 
  momentId, 
  onClose, 
  onSelectGuide 
}: GuideViewerProps) {
  const [currentGuide, setCurrentGuide] = useState<WeddingGuide | undefined>(initialGuide)
  const [viewHistory, setViewHistory] = useState<WeddingGuide[]>([])

  // If no guide selected, show moment-specific guides
  const momentGuides = momentId ? getGuidesByMoment(momentId) : []
  const relatedGuides = currentGuide ? getRelatedGuides(currentGuide.id) : []

  const handleSelectGuide = (guide: WeddingGuide) => {
    if (currentGuide) {
      setViewHistory([...viewHistory, currentGuide])
    }
    setCurrentGuide(guide)
    onSelectGuide(guide)
  }

  const handleBack = () => {
    if (viewHistory.length > 0) {
      const previousGuide = viewHistory[viewHistory.length - 1]
      setViewHistory(viewHistory.slice(0, -1))
      setCurrentGuide(previousGuide)
    } else {
      setCurrentGuide(undefined)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {currentGuide && viewHistory.length > 0 && (
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 text-white/60 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}

          <div className="text-center">
            {currentGuide ? (
              <>
                <div className="text-4xl mb-3">{currentGuide.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-2">{currentGuide.title}</h2>
                <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentGuide.readTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {currentGuide.category}
                  </span>
                </div>
              </>
            ) : (
              <>
                <BookOpen className="w-12 h-12 text-white/60 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white mb-2">Wedding Music Guides</h2>
                <p className="text-white/60">Expert advice for every moment of your celebration</p>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentGuide ? (
            <div className="prose prose-invert max-w-none">
              {/* Summary */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-white/80 leading-relaxed">{currentGuide.summary}</p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {currentGuide.sections.map((section, index) => (
                  <motion.section
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      {section.title}
                    </h3>
                    
                    <p className="text-white/80 leading-relaxed mb-4">
                      {section.content}
                    </p>

                    {section.tips && section.tips.length > 0 && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-purple-300 mb-2">Pro Tips:</p>
                            <ul className="space-y-1">
                              {section.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-sm text-white/70 flex items-start gap-2">
                                  <span className="text-purple-400 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {section.examples && section.examples.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Music className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
                          <div className="w-full">
                            <p className="font-medium text-white/80 mb-2">Examples:</p>
                            <div className="space-y-2">
                              {section.examples.map((example, exampleIndex) => (
                                <div key={exampleIndex} className="flex items-center gap-2 text-sm text-white/60">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span>{example}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.section>
                ))}
              </div>

              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Related Guides</h3>
                  <div className="grid gap-3">
                    {relatedGuides.map((relatedGuide) => (
                      <button
                        key={relatedGuide.id}
                        onClick={() => handleSelectGuide(relatedGuide)}
                        className="w-full text-left p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{relatedGuide.icon}</span>
                            <div>
                              <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                                {relatedGuide.title}
                              </h4>
                              <p className="text-sm text-white/60">{relatedGuide.readTime} min read</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Guide Selection View
            <div>
              {momentGuides.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-400" />
                    Guides for This Moment
                  </h3>
                  <div className="grid gap-3">
                    {momentGuides.map((guide) => (
                      <button
                        key={guide.id}
                        onClick={() => handleSelectGuide(guide)}
                        className="w-full text-left p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{guide.icon}</span>
                            <div>
                              <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                                {guide.title}
                              </h4>
                              <p className="text-sm text-white/60">{guide.summary}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">All Guides</h3>
                <div className="grid gap-6">
                  {['moments', 'planning', 'tips', 'traditions'].map((category) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                        {category}
                      </h4>
                      <div className="grid gap-3">
                        {weddingGuides
                          .filter(g => g.category === category as any)
                          .map((guide) => (
                            <button
                              key={guide.id}
                              onClick={() => handleSelectGuide(guide)}
                              className="w-full text-left p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{guide.icon}</span>
                                  <div>
                                    <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                                      {guide.title}
                                    </h4>
                                    <p className="text-sm text-white/60">{guide.readTime} min read</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Import the weddingGuides at the top of the file
import { weddingGuides } from '@/data/weddingGuides'