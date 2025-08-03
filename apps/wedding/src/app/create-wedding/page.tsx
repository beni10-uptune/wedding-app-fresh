'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Music, Heart, MapPin, Users, Crown, CheckCircle, Sparkles, Globe, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { playlistTemplates } from '@/data/playlistTemplates'
import { ProgressBar } from '@/components/onboarding/ProgressBar'
import { WeddingCreatedSuccess } from '@/components/WeddingCreatedSuccess'
import { generateSlugFromNames, isValidSlug, isSlugAvailable, generateUniqueSlug, sanitizeSlug } from '@/lib/slug-utils'

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
  slug?: string
}

export default function CreateWeddingPage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkingExisting, setCheckingExisting] = useState(true)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdWeddingId, setCreatedWeddingId] = useState('')
  const [createdWeddingSlug, setCreatedWeddingSlug] = useState('')
  const [slugError, setSlugError] = useState('')
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [weddingData, setWeddingData] = useState<WeddingData>({
    coupleName1: '',
    coupleName2: '',
    weddingDate: '',
    venue: '',
    city: '',
    guestCount: 50,
    weddingStyle: '',
    moments: ['ceremony', 'cocktail', 'dinner', 'dancing'],
    playlistTemplate: '',
    slug: ''
  })
  const router = useRouter()

  useEffect(() => {
    checkExistingWedding()
  }, [user])

  // Load user data to pre-populate names
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            // Pre-populate names from signup
            const name1 = userData.displayName || ''
            const name2 = userData.partnerName || ''
            
            setWeddingData(prev => ({
              ...prev,
              coupleName1: name1,
              coupleName2: name2
            }))
            
            // Generate initial slug from names
            if (name1 && name2) {
              const generatedSlug = generateSlugFromNames([name1, name2])
              setWeddingData(prev => ({ ...prev, slug: generatedSlug }))
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
    }
    loadUserData()
  }, [user])

  // Auto-generate slug when names change
  useEffect(() => {
    if (weddingData.coupleName1 && weddingData.coupleName2 && !weddingData.slug) {
      const generatedSlug = generateSlugFromNames([weddingData.coupleName1, weddingData.coupleName2])
      setWeddingData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [weddingData.coupleName1, weddingData.coupleName2])

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

  const handleSlugChange = async (value: string) => {
    const sanitized = sanitizeSlug(value)
    setWeddingData(prev => ({ ...prev, slug: sanitized }))
    setSlugError('')
    
    if (sanitized.length < 3) {
      setSlugError('URL must be at least 3 characters')
      return
    }
    
    if (!isValidSlug(sanitized)) {
      setSlugError('URL can only contain lowercase letters, numbers, and hyphens')
      return
    }
    
    setIsCheckingSlug(true)
    try {
      const available = await isSlugAvailable(sanitized)
      if (!available) {
        setSlugError('This URL is already taken')
      }
    } catch (error) {
      console.error('Error checking slug:', error)
    } finally {
      setIsCheckingSlug(false)
    }
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
    setError('')
    
    if (!user) {
      console.error('No user found')
      setError('Please sign in to create a wedding')
      return
    }
    
    // Validate required fields
    if (!weddingData.weddingDate) {
      setError('Please select a wedding date')
      return
    }
    
    // Validate slug
    if (slugError) {
      setError('Please fix the URL errors before continuing')
      return
    }
    
    console.log('Creating wedding with data:', weddingData)
    setLoading(true)
    
    try {
      // Generate unique slug if not provided or if there's a conflict
      let finalSlug = weddingData.slug || generateSlugFromNames([weddingData.coupleName1, weddingData.coupleName2])
      finalSlug = await generateUniqueSlug(finalSlug)
      
      // Create wedding document
      const weddingRef = await addDoc(collection(db, 'weddings'), {
        title: `${weddingData.coupleName1} & ${weddingData.coupleName2}'s Wedding`,
        slug: finalSlug,
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

      // Show success modal instead of immediate redirect
      setCreatedWeddingId(weddingRef.id)
      setCreatedWeddingSlug(finalSlug)
      setShowSuccess(true)
    } catch (error: any) {
      console.error('Error creating wedding:', error)
      // Check for specific Firebase errors
      if (error.code === 'permission-denied') {
        setError('Unable to create wedding. Please make sure you are logged in and try again.')
      } else if (error.message?.includes('permission')) {
        setError('Permission error. Please refresh the page and try again.')
      } else {
        setError(`Failed to create wedding: ${error.message || 'Please try again'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
          </div>
          
          {/* Free Plan Banner */}
          <div className="glass-darker rounded-lg p-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-white/80">
              <span className="font-semibold">Start Free:</span> Add up to 10 songs and invite 3 guests. Upgrade anytime for unlimited access!
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-8">
            {/* Progress Bar */}
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={5}
              stepLabels={[
                'Basic Details',
                'Venue & Date',
                'Wedding Style',
                'Musical Moments',
                'Choose Template'
              ]}
            />
            
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    {weddingData.coupleName1 && weddingData.coupleName2 
                      ? `Welcome ${weddingData.coupleName1} & ${weddingData.coupleName2}!`
                      : "Let's Create Your Perfect Wedding Music"
                    }
                  </h2>
                  <p className="text-white/60">
                    Tell us about your special day
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Partner 1's Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.coupleName1}
                      onChange={(e) => handleInputChange('coupleName1', e.target.value)}
                      className="input"
                      placeholder="First name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Partner 2's Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.coupleName2}
                      onChange={(e) => handleInputChange('coupleName2', e.target.value)}
                      className="input"
                      placeholder="First name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    When is your big day?
                  </label>
                  <input
                    type="date"
                    value={weddingData.weddingDate}
                    onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Choose your wedding URL
                  </label>
                  <p className="text-xs text-white/60 mb-2">
                    This is the link you'll share with guests to submit song requests
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white/60">weddings.uptune.xyz/</span>
                    <input
                      type="text"
                      value={weddingData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="input flex-1"
                      placeholder={generateSlugFromNames([weddingData.coupleName1, weddingData.coupleName2]) || "your-wedding-name"}
                    />
                  </div>
                  {slugError && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {slugError}
                    </p>
                  )}
                  {isCheckingSlug && (
                    <p className="text-sm text-white/60">Checking availability...</p>
                  )}
                  {!slugError && weddingData.slug && !isCheckingSlug && (
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      This URL is available!
                    </p>
                  )}
                  <p className="text-xs text-white/60 mt-1">
                    Use lowercase letters, numbers, and hyphens only
                  </p>
                </div>

                <div className="glass-darker rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/80 font-medium mb-1">
                        What we&apos;ll help you with:
                      </p>
                      <ul className="text-sm text-white/60 space-y-1">
                        <li>• Collaborative playlist creation with your partner</li>
                        <li>• Guest song requests and voting</li>
                        <li>• Music for every wedding moment</li>
                        <li>• Easy export to Spotify</li>
                      </ul>
                    </div>
                  </div>
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

                {/* Value Preview - Show what they'll get */}
                {weddingData.weddingStyle && (
                  <div className="mt-8 p-6 glass-darker rounded-xl">
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Great choice! We'll create playlists perfect for {weddingData.weddingStyle.toLowerCase()} weddings
                        </h4>
                        <p className="text-white/70 text-sm mb-3">
                          Based on your style, we'll suggest songs that match your vibe:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {weddingData.weddingStyle === 'Classic & Traditional' && (
                            <>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Frank Sinatra</span>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Etta James</span>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Nat King Cole</span>
                            </>
                          )}
                          {weddingData.weddingStyle === 'Modern & Contemporary' && (
                            <>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Ed Sheeran</span>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">John Legend</span>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Bruno Mars</span>
                            </>
                          )}
                          {weddingData.weddingStyle === 'Fun & Casual' && (
                            <>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Uptown Funk</span>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Shut Up and Dance</span>
                              <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Can't Stop the Feeling</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

      {/* Success Modal */}
      {showSuccess && (
        <WeddingCreatedSuccess
          weddingId={createdWeddingId}
          weddingSlug={createdWeddingSlug}
          coupleName1={weddingData.coupleName1}
          coupleName2={weddingData.coupleName2}
          selectedMoments={weddingData.moments.length}
          onClose={() => router.push(`/wedding/${createdWeddingId}/builder`)}
        />
      )}
    </div>
  )
}