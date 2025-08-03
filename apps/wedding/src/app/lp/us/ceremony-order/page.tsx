import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Music, Clock, Heart, Users, ArrowDown, ChevronRight, CheckCircle, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Ceremony Music Order: Perfect Timing Guide | UpTune',
  description: 'Master your wedding ceremony music order with our complete timing guide. From processional to recessional, plan every musical moment perfectly.',
  keywords: 'wedding ceremony music order, ceremony music timeline, processional music, wedding music sequence',
  openGraph: {
    title: 'Wedding Ceremony Music Order - Complete Planning Guide',
    description: 'Plan the perfect musical flow for your wedding ceremony. Expert guide for processional, ceremony, and recessional music.',
    images: ['/images/lp/wedding-ceremony-music-order.jpg'],
  },
}

export default function CeremonyOrderPage() {
  const ceremonyFlow = [
    {
      phase: "Pre-Ceremony",
      duration: "20-30 minutes",
      description: "Guest arrival and seating",
      songs: "5-8 instrumental pieces",
      examples: ["Canon in D - Pachelbel", "Clair de Lune - Debussy", "Somewhere Over the Rainbow - IZ"]
    },
    {
      phase: "Processional",
      duration: "5-10 minutes",
      description: "Wedding party entrance",
      songs: "2-3 songs",
      examples: ["Bridal Chorus - Wagner", "Here Comes the Sun - Beatles", "A Thousand Years - Christina Perri"]
    },
    {
      phase: "Bride's Entrance",
      duration: "1-2 minutes",
      description: "The moment everyone waits for",
      songs: "1 special song",
      examples: ["Canon in D - Pachelbel", "Marry Me - Train", "All of Me - John Legend"]
    },
    {
      phase: "Ceremony",
      duration: "15-30 minutes",
      description: "Vows, rings, and rituals",
      songs: "1-3 songs (optional)",
      examples: ["The Wedding Song - Kenny G", "Ave Maria - Schubert", "Make You Feel My Love - Adele"]
    },
    {
      phase: "Recessional",
      duration: "2-3 minutes",
      description: "Joyful exit as newlyweds",
      songs: "1 upbeat song",
      examples: ["Signed, Sealed, Delivered - Stevie Wonder", "Walking on Sunshine - Katrina & The Waves", "Happy - Pharrell"]
    },
    {
      phase: "Post-Ceremony",
      duration: "10-15 minutes",
      description: "Guest exit and transition",
      songs: "3-5 upbeat songs",
      examples: ["Love on Top - Beyoncé", "I'm Yours - Jason Mraz", "Best Day of My Life - American Authors"]
    }
  ]

  const tips = [
    {
      title: "Test Your Timing",
      description: "Practice walking to your processional song to ensure it's the right length"
    },
    {
      title: "Consider Acoustics",
      description: "Choose songs that sound good in your venue's acoustic environment"
    },
    {
      title: "Backup Plans",
      description: "Have extra songs ready in case any part runs longer than expected"
    },
    {
      title: "Volume Matters",
      description: "Ensure music is audible but not overwhelming during vows"
    }
  ]

  const commonMistakes = [
    "Choosing processional songs that are too short",
    "Not coordinating music cues with officiant",
    "Forgetting post-ceremony exit music",
    "Playing vocal music during vows",
    "Not testing sound equipment beforehand"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/90 via-black to-purple-900/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 mb-6">
              <Music className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-300">Ceremony Music Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Perfect Your
              <span className="block gradient-text">Ceremony Music Order</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Create the ideal musical flow for your wedding ceremony. From guest arrival 
              to your grand exit, plan every note with our expert timing guide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Plan Your Ceremony Music
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="#ceremony-flow" className="btn-glass">
                See Complete Timeline
                <Clock className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Typical Ceremony Timeline</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {ceremonyFlow.map((phase, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-sm font-medium">{phase.phase}</div>
                  {index < ceremonyFlow.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Ceremony Flow */}
      <section id="ceremony-flow" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Complete Ceremony Music Order</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Follow this detailed timeline to create the perfect musical atmosphere for your ceremony
              </p>
            </div>

            <div className="space-y-8">
              {ceremonyFlow.map((phase, index) => (
                <div key={index} className="glass rounded-xl overflow-hidden">
                  <div className="p-8">
                    <div className="grid md:grid-cols-[1fr,2fr] gap-8">
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{phase.phase}</h3>
                            <p className="text-white/60">{phase.duration}</p>
                          </div>
                        </div>
                        <p className="text-white/80 mb-4">{phase.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Music className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-300">{phase.songs}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Popular Song Choices:</h4>
                        <div className="space-y-2">
                          {phase.examples.map((example, idx) => (
                            <div key={idx} className="flex items-center gap-2 glass rounded-lg p-3">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-white/80">{example}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < ceremonyFlow.length - 1 && (
                    <div className="flex justify-center pb-4">
                      <ArrowDown className="w-6 h-6 text-white/40" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Visual Timeline */}
            <div className="mt-16 glass-gradient rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-center mb-8">Visual Timeline</h3>
              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-600 to-purple-600 transform -translate-x-1/2"></div>
                <div className="space-y-8">
                  {ceremonyFlow.slice(0, 4).map((phase, index) => (
                    <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        <h4 className="font-semibold">{phase.phase}</h4>
                        <p className="text-sm text-white/60">{phase.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-12">Expert Tips for Perfect Timing</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {tips.map((tip, index) => (
                  <div key={index} className="glass rounded-lg p-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      {tip.title}
                    </h4>
                    <p className="text-white/70">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="mt-12 glass rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Avoid These Common Mistakes</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {commonMistakes.map((mistake, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span className="text-white/80">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Builder CTA */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Build Your Ceremony Timeline with UpTune</h2>
            <p className="text-xl text-white/70 mb-8">
              Our interactive timeline builder helps you plan every musical moment of your ceremony
            </p>

            <div className="glass-gradient rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Clock className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Smart Timing</h4>
                  <p className="text-white/70 text-sm">Calculate exact song lengths for each moment</p>
                </div>
                <div>
                  <Music className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Song Library</h4>
                  <p className="text-white/70 text-sm">Browse ceremony-appropriate songs by moment</p>
                </div>
                <div>
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Vendor Ready</h4>
                  <p className="text-white/70 text-sm">Export timeline for musicians and coordinators</p>
                </div>
              </div>

              <Link href="/auth/signup" className="btn-primary">
                Start Planning Your Ceremony
                <Heart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}