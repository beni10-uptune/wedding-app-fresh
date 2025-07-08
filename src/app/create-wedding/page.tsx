'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Music, Heart, MapPin, Users, Crown, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

interface WeddingData {
  coupleName1: string
  coupleName2: string
  weddingDate: string
  venue: string
  city: string
  guestCount: number
  weddingStyle: string
  moments: string[]
}

export default function CreateWeddingPage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [weddingData, setWeddingData] = useState<WeddingData>({
    coupleName1: '',
    coupleName2: '',
    weddingDate: '',
    venue: '',
    city: '',
    guestCount: 50,
    weddingStyle: '',
    moments: ['ceremony', 'cocktail', 'dinner', 'dancing']
  })
  const router = useRouter()

  const weddingStyles = [
    'Classic & Traditional',
    'Modern & Contemporary', 
    'Rustic & Outdoor',
    'Elegant & Formal',
    'Fun & Casual',
    'Vintage & Romantic'
  ]

  const weddingMoments = [
    { id: 'ceremony', label: 'Ceremony', description: 'Processional, vows, recessional' },
    { id: 'cocktail', label: 'Cocktail Hour', description: 'Mingling and drinks' },
    { id: 'dinner', label: 'Dinner Service', description: 'Meal and speeches' },
    { id: 'dancing', label: 'Reception Dancing', description: 'Dance floor celebration' },
    { id: 'first-dance', label: 'First Dance', description: 'Special couple moment' },
    { id: 'parent-dance', label: 'Parent Dances', description: 'Traditional family dances' }
  ]

  const handleInputChange = (field: keyof WeddingData, value: string | number | string[]) => {
    setWeddingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMomentToggle = (momentId: string) => {
    setWeddingData(prev => ({
      ...prev,
      moments: prev.moments.includes(momentId)
        ? prev.moments.filter(m => m !== momentId)
        : [...prev.moments, momentId]
    }))
  }

  const handleSubmit = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Create wedding document
      const weddingRef = await addDoc(collection(db, 'weddings'), {
        title: `${weddingData.coupleName1} & ${weddingData.coupleName2}'s Wedding`,
        coupleNames: [weddingData.coupleName1, weddingData.coupleName2],
        weddingDate: new Date(weddingData.weddingDate),
        venue: weddingData.venue,
        owners: [user.uid],
        collaborators: [],
        status: 'planning',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Create default playlists for selected moments
      const playlistPromises = weddingData.moments.map(momentId => {
        const moment = weddingMoments.find(m => m.id === momentId)
        return addDoc(collection(db, 'weddings', weddingRef.id, 'playlists'), {
          name: moment?.label || momentId,
          description: moment?.description || '',
          moment: momentId,
          songs: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user.uid
        })
      })

      await Promise.all(playlistPromises)

      // Redirect to payment page
      router.push(`/wedding/${weddingRef.id}/payment`)
    } catch (error) {
      console.error('Error creating wedding:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (!user) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">
            Please Sign In
          </h2>
          <p className="text-white/60 mb-8">
            You need to be signed in to create your wedding
          </p>
          <Link href="/auth/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UpTune</h1>
              <p className="text-sm text-pink-400 font-medium">for Weddings</p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-white/60">
              Step {currentStep} of 4
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-pink-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-8">
            
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    Tell Us About Your Love Story
                  </h2>
                  <p className="text-white/60">
                    Let&apos;s start with the basics about your special day
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Partner 1 Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.coupleName1}
                      onChange={(e) => handleInputChange('coupleName1', e.target.value)}
                      className="input"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Partner 2 Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.coupleName2}
                      onChange={(e) => handleInputChange('coupleName2', e.target.value)}
                      className="input"
                      placeholder="Partner's name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    value={weddingData.weddingDate}
                    onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Venue Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    Where's the Magic Happening?
                  </h2>
                  <p className="text-white/60">
                    Tell us about your venue and guest count
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={weddingData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="input"
                    placeholder="The Grand Ballroom, City Hall, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={weddingData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="input"
                    placeholder="London, Manchester, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Expected Guest Count
                  </label>
                  <input
                    type="number"
                    value={weddingData.guestCount}
                    onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                    className="input"
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Wedding Style */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    What's Your Wedding Style?
                  </h2>
                  <p className="text-white/60">
                    This helps us curate the perfect music for your vibe
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {weddingStyles.map(style => (
                    <button
                      key={style}
                      onClick={() => handleInputChange('weddingStyle', style)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        weddingData.weddingStyle === style
                          ? 'border-purple-500 bg-purple-500/20 glass'
                          : 'border-white/20 hover:border-purple-400 glass'
                      }`}
                    >
                      <div className="font-semibold text-white">{style}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Wedding Moments */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    Choose Your Musical Moments
                  </h2>
                  <p className="text-white/60">
                    Select the parts of your wedding that need music
                  </p>
                </div>

                <div className="space-y-4">
                  {weddingMoments.map(moment => (
                    <div
                      key={moment.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        weddingData.moments.includes(moment.id)
                          ? 'border-purple-500 bg-purple-500/20 glass'
                          : 'border-white/20 hover:border-purple-400 glass'
                      }`}
                      onClick={() => handleMomentToggle(moment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{moment.label}</div>
                          <div className="text-sm text-white/60">{moment.description}</div>
                        </div>
                        {weddingData.moments.includes(moment.id) && (
                          <CheckCircle className="w-5 h-5 text-purple-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Wedding'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="btn-primary flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}