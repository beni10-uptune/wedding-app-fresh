import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Music, Heart, Users, Sparkles, ChevronRight, CheckCircle, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Music Timeline Guide: Perfect Flow from Ceremony to Last Dance | UpTune',
  description: 'Master your wedding music timeline with our complete guide. Plan perfect musical moments from processional to reception finale. Free timeline template included.',
  keywords: 'wedding music timeline, wedding reception music, ceremony music timing, wedding playlist schedule',
  openGraph: {
    title: 'Wedding Music Timeline: Complete Planning Guide',
    description: 'Create the perfect musical flow for your wedding day. Expert timeline tips for ceremony, cocktail hour, dinner, and dancing.',
    images: ['/images/blog/wedding-music-timeline-complete-guide-reception-planning.jpg'],
  },
}

export default function WeddingTimelinePage() {
  const timelinePhases = [
    {
      time: "3:00 PM",
      phase: "Pre-Ceremony",
      duration: "30 mins",
      description: "Guest arrival and seating",
      songs: "8-10 songs",
      vibe: "Soft, welcoming instrumentals"
    },
    {
      time: "3:30 PM",
      phase: "Processional",
      duration: "5-10 mins",
      description: "Wedding party entrance",
      songs: "2-3 songs",
      vibe: "Emotional, building anticipation"
    },
    {
      time: "3:40 PM",
      phase: "Ceremony",
      duration: "20-30 mins",
      description: "Vows and rituals",
      songs: "1-2 songs",
      vibe: "Meaningful, personal choices"
    },
    {
      time: "4:10 PM",
      phase: "Recessional",
      duration: "3-5 mins",
      description: "Joyful exit as newlyweds",
      songs: "1 upbeat song",
      vibe: "Celebratory, energetic"
    },
    {
      time: "4:15 PM",
      phase: "Cocktail Hour",
      duration: "60 mins",
      description: "Mingling and drinks",
      songs: "15-20 songs",
      vibe: "Upbeat jazz, acoustic covers"
    },
    {
      time: "5:15 PM",
      phase: "Reception Entrance",
      duration: "5 mins",
      description: "Grand entrance",
      songs: "1-2 high energy songs",
      vibe: "Exciting, party starter"
    },
    {
      time: "5:20 PM",
      phase: "Dinner Service",
      duration: "90 mins",
      description: "Meal and speeches",
      songs: "20-25 songs",
      vibe: "Background classics, varied genres"
    },
    {
      time: "6:50 PM",
      phase: "First Dance",
      duration: "3-4 mins",
      description: "Couple's special moment",
      songs: "1 meaningful song",
      vibe: "Romantic, personal"
    },
    {
      time: "7:00 PM",
      phase: "Dance Floor Opens",
      duration: "3-4 hours",
      description: "Party time!",
      songs: "60-80 songs",
      vibe: "Mix of hits, crowd pleasers"
    }
  ]

  const proTips = [
    {
      icon: Clock,
      title: "Buffer Time",
      tip: "Add 5-10 minute buffers between major transitions"
    },
    {
      icon: Users,
      title: "Read the Room",
      tip: "Have backup options if the energy needs adjusting"
    },
    {
      icon: Heart,
      title: "Personal Touch",
      tip: "Include songs meaningful to your relationship"
    },
    {
      icon: Music,
      title: "Flow Matters",
      tip: "Transition smoothly between energy levels"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/blog/wedding-music-timeline-complete-guide-reception-planning.jpg"
            alt="Wedding reception timeline planning"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Expert Timeline Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Master Your Wedding
              <span className="block gradient-text">Music Timeline</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Create the perfect musical journey from "Here Comes the Bride" to the last dance. 
              Our complete guide ensures every moment has the right soundtrack.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Build Your Timeline
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="#timeline" className="btn-glass">
                See Example Timeline
                <Calendar className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 glass-darker">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">9</div>
              <p className="text-white/70 text-sm">Key Moments</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">150+</div>
              <p className="text-white/70 text-sm">Songs Needed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">6-7hrs</div>
              <p className="text-white/70 text-sm">Total Music Time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">Free</div>
              <p className="text-white/70 text-sm">Timeline Template</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Timeline */}
      <section id="timeline" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Your Complete Wedding Day Timeline</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                A typical 6-hour wedding timeline with music recommendations for each phase
              </p>
            </div>

            {/* Timeline Visual */}
            <div className="relative">
              {/* Vertical line for desktop */}
              <div className="hidden md:block absolute left-[100px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-pink-600"></div>
              
              <div className="space-y-8">
                {timelinePhases.map((phase, index) => (
                  <div key={index} className="relative grid md:grid-cols-[120px,1fr] gap-6 items-start">
                    {/* Time marker */}
                    <div className="hidden md:block text-right">
                      <div className="sticky top-8">
                        <div className="text-lg font-bold text-white">{phase.time}</div>
                        <div className="text-sm text-white/60">{phase.duration}</div>
                      </div>
                    </div>
                    
                    {/* Content card */}
                    <div className="glass rounded-xl p-6 hover:scale-[1.01] transition-transform">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="md:hidden text-sm text-white/60 mb-1">{phase.time} • {phase.duration}</div>
                          <h3 className="text-xl font-bold mb-2">{phase.phase}</h3>
                          <p className="text-white/70 mb-3">{phase.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-white/60">Songs needed:</span>
                              <span className="ml-2 font-medium">{phase.songs}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Vibe:</span>
                              <span className="ml-2 font-medium text-purple-400">{phase.vibe}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-20 glass-gradient rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center mb-12">Timeline Pro Tips</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {proTips.map((tip, index) => {
                  const Icon = tip.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <h4 className="font-semibold mb-2">{tip.title}</h4>
                      <p className="text-white/70 text-sm">{tip.tip}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-red-400">Common Timeline Mistakes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Not enough cocktail hour music (guests notice repeats)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Forgetting transition music between events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Playing high-energy dance music during dinner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No backup songs for extended moments</span>
                  </li>
                </ul>
              </div>

              <div className="glass rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-green-400">Timeline Best Practices</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Create 20% more playlist than needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Test transitions between different energy levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Have "crowd rescue" songs ready</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Share timeline with all vendors</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* UpTune Features */}
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold mb-4">Build Your Perfect Timeline with UpTune</h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Our timeline builder makes it easy to plan every musical moment of your wedding day
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="glass rounded-lg p-6">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Visual Timeline</h4>
                  <p className="text-white/70 text-sm">Drag and drop interface to plan your perfect flow</p>
                </div>
                <div className="glass rounded-lg p-6">
                  <Music className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Smart Suggestions</h4>
                  <p className="text-white/70 text-sm">AI-powered recommendations for each moment</p>
                </div>
                <div className="glass rounded-lg p-6">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Export & Share</h4>
                  <p className="text-white/70 text-sm">PDF timelines for DJs, bands, and planners</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="btn-primary">
                  Start Your Timeline Free
                  <Sparkles className="w-5 h-5" />
                </Link>
                <Link href="/blog/wedding-music-timeline-complete-guide" className="btn-glass">
                  Read Full Timeline Guide
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}