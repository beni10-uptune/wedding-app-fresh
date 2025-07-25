'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Music, Heart, MapPin, Users, Crown, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { playlistTemplates } from '@/data/playlistTemplates'

interface WeddingData {
  coupleName1: string
  coupleName2: string
  weddingDate: string
  venue: string
  city: string
  guestCount: number
  weddingStyle: string
  moments: string[]
  playlistTemplate?: string
}

export default function CreateWeddingPage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkingExisting, setCheckingExisting] = useState(true)
  const [weddingData, setWeddingData] = useState<WeddingData>({
    coupleName1: '',
    coupleName2: '',
    weddingDate: '',
    venue: '',
    city: '',
    guestCount: 50,
    weddingStyle: '',
    moments: ['ceremony', 'cocktail', 'dinner', 'dancing'],
    playlistTemplate: ''
  })
  const router = useRouter()

  useEffect(() => {
    checkExistingWedding()
  }, [user])

  const checkExistingWedding = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      // Check if user already has a wedding
      const weddingsQuery = query(
        collection(db, 'weddings'),
        where('owners', 'array-contains', user.uid)
      )
      const snapshot = await getDocs(weddingsQuery)
      
      if (!snapshot.empty) {
        // User already has a wedding, redirect to dashboard
        router.push('/dashboard')
        return
      }
    } catch (error) {
      console.error('Error checking existing wedding:', error)
    } finally {
      setCheckingExisting(false)
    }
  }

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
    if (!user) {
      console.error('No user found')
      alert('Please sign in to create a wedding')
      return
    }
    
    // Validate required fields
    if (!weddingData.coupleName1 || !weddingData.coupleName2) {
      alert('Please enter both partner names')
      return
    }
    
    if (!weddingData.weddingDate) {
      alert('Please select a wedding date')
      return
    }
    
    console.log('Creating wedding with data:', weddingData)
    setLoading(true)
    
    try {
      // Create wedding document
      const weddingRef = await addDoc(collection(db, 'weddings'), {
        title: `${weddingData.coupleName1} & ${weddingData.coupleName2}'s Wedding`,
        coupleNames: [weddingData.coupleName1, weddingData.coupleName2],
        weddingDate: Timestamp.fromDate(new Date(weddingData.weddingDate)),
        venue: weddingData.venue || '',
        city: weddingData.city || '',
        guestCount: weddingData.guestCount || 50,
        weddingStyle: weddingData.weddingStyle || '',
        owners: [user.uid],
        userId: user.uid,
        partnerEmails: [],
        collaborators: [],
        status: 'planning',
        paymentStatus: 'pending',
        subscriptionTier: 'free',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      console.log('Wedding created with ID:', weddingRef.id)

      // Create playlists based on template or custom selection
      let playlistPromises: Promise<any>[] = []
      
      if (weddingData.playlistTemplate && weddingData.playlistTemplate !== 'custom') {
        // Use template playlists
        const template = playlistTemplates.find(t => t.id === weddingData.playlistTemplate)
        if (template) {
          playlistPromises = template.playlists.map(playlist => {
            return addDoc(collection(db, 'weddings', weddingRef.id, 'playlists'), {
              name: playlist.name,
              description: playlist.description,
              moment: playlist.moment,
              targetSongCount: playlist.targetSongCount,
              suggestedGenres: playlist.suggestedGenres || [],
              suggestedMood: playlist.suggestedMood || [],
              songs: [],
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              createdBy: user.uid
            })
          })
        }
      } else {
        // Create default playlists for selected moments
        playlistPromises = weddingData.moments.map(momentId => {
          const moment = weddingMoments.find(m => m.id === momentId)
          return addDoc(collection(db, 'weddings', weddingRef.id, 'playlists'), {
            name: moment?.label || momentId,
            description: moment?.description || '',
            moment: momentId,
            targetSongCount: 20, // Default target
            songs: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: user.uid
          })
        })
      }

      await Promise.all(playlistPromises)
      
      // Mark onboarding as complete
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          onboardingCompleted: true,
          updatedAt: serverTimestamp()
        })
      }

      // Redirect to dashboard (freemium model - payment comes later)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error creating wedding:', error)
      alert(`Failed to create wedding: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (checkingExisting) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Checking your account...</p>
        </div>
      </div>
    )
  }

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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
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
                Step {currentStep} of 5
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(step => (
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
          
          {/* Free Plan Banner */}
          <div className="glass-darker rounded-lg p-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-white/80">
              <span className="font-semibold">Start Free:</span> 25 songs and 5 guest invites included. Upgrade anytime for unlimited access!
            </p>
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

            {/* Step 5: Playlist Template */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    Choose Your Musical Style
                  </h2>
                  <p className="text-white/60">
                    Start with a curated template or build from scratch
                  </p>
                </div>

                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      weddingData.playlistTemplate === 'custom'
                        ? 'border-purple-500 bg-purple-500/20 glass'
                        : 'border-white/20 hover:border-purple-400 glass'
                    }`}
                    onClick={() => handleInputChange('playlistTemplate', 'custom')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">✨</span>
                          <div className="font-semibold text-white">Start from Scratch</div>
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          Create your own unique playlists
                        </div>
                      </div>
                      {weddingData.playlistTemplate === 'custom' && (
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                  </div>

                  {playlistTemplates.map(template => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        weddingData.playlistTemplate === template.id
                          ? 'border-purple-500 bg-purple-500/20 glass'
                          : 'border-white/20 hover:border-purple-400 glass'
                      }`}
                      onClick={() => handleInputChange('playlistTemplate', template.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{template.icon}</span>
                            <div className="font-semibold text-white">{template.name}</div>
                          </div>
                          <div className="text-sm text-white/60">{template.description}</div>
                          <div className="text-xs text-purple-400 mt-2">
                            {template.playlists.length} playlists • {template.style}
                          </div>
                        </div>
                        {weddingData.playlistTemplate === template.id && (
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

              {currentStep === 5 ? (
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