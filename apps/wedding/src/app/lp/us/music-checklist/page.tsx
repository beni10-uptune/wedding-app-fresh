import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Music, Clock, Download, Heart, ChevronRight, List, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Music Checklist: Complete Planning Guide 2025 | UpTune',
  description: 'Never miss a musical moment with our comprehensive wedding music checklist. Free downloadable PDF guide covers ceremony, reception, and everything in between.',
  keywords: 'wedding music checklist, wedding planning checklist, wedding song list, wedding music planning guide',
  openGraph: {
    title: 'Complete Wedding Music Checklist - Plan Every Musical Moment',
    description: 'Free comprehensive checklist to plan all your wedding music. From processional to last dance, ensure nothing is forgotten.',
    images: ['/images/lp/wedding-music-checklist-guide.jpg'],
  },
}

export default function MusicChecklistPage() {
  const checklistSections = [
    {
      title: "Pre-Ceremony Music",
      items: [
        "Guest arrival playlist (30-45 minutes)",
        "Seating music for early arrivals",
        "Special songs for VIP seating",
        "Volume and mood considerations"
      ]
    },
    {
      title: "Ceremony Music",
      items: [
        "Processional songs (family, wedding party)",
        "Bride's entrance song",
        "Unity ceremony music",
        "Recessional celebration song"
      ]
    },
    {
      title: "Cocktail Hour",
      items: [
        "Upbeat background playlist (60-90 minutes)",
        "Genre variety for all guests",
        "Transition from ceremony mood",
        "No repeating songs from pre-ceremony"
      ]
    },
    {
      title: "Reception Entrance",
      items: [
        "Wedding party introduction songs",
        "Couple's grand entrance",
        "Energy-building tracks",
        "Clear pronunciation list for DJ"
      ]
    },
    {
      title: "Dinner Music",
      items: [
        "Background dining playlist (90-120 minutes)",
        "Conversation-friendly volume",
        "Multi-generational appeal",
        "Special dietary moment songs"
      ]
    },
    {
      title: "Special Dances",
      items: [
        "First dance song and timing",
        "Parent dances (mother-son, father-daughter)",
        "Wedding party dance",
        "Anniversary dance song"
      ]
    },
    {
      title: "Dance Floor",
      items: [
        "Opening dance set (high energy)",
        "Mixed genres for all ages",
        "Guest request handling",
        "Last dance selection"
      ]
    },
    {
      title: "Don't Forget",
      items: [
        "Do-not-play list",
        "Cake cutting song",
        "Bouquet/garter toss music",
        "Send-off song"
      ]
    }
  ]

  const timeline = [
    { time: "12 Months Before", task: "Start creating music vision and preferences" },
    { time: "9 Months Before", task: "Book DJ/band and discuss style" },
    { time: "6 Months Before", task: "Begin building playlists" },
    { time: "3 Months Before", task: "Finalize special dance songs" },
    { time: "1 Month Before", task: "Complete all playlists and share with vendors" },
    { time: "1 Week Before", task: "Final review and backup plans" }
  ]

  const stats = [
    { number: "150+", label: "Songs Needed" },
    { number: "8", label: "Key Moments" },
    { number: "6-7", label: "Hours of Music" },
    { number: "Free", label: "PDF Download" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-black to-purple-900/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6">
              <List className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Complete Planning Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Your Complete
              <span className="block gradient-text">Wedding Music Checklist</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Plan every musical moment of your wedding day with our comprehensive checklist. 
              Never miss a song or special moment with this detailed planning guide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Get Your Free Checklist
                <Download className="w-5 h-5" />
              </Link>
              <Link href="#checklist" className="btn-glass">
                View Full Checklist
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 glass-darker">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.number}</div>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Checklist */}
      <section id="checklist" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Master Wedding Music Checklist</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Every song and musical moment you need to plan for your perfect wedding day
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {checklistSections.map((section, index) => (
                <div key={index} className="glass rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5 text-blue-400" />
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Timeline Section */}
            <div className="glass-gradient rounded-2xl p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Music Planning Timeline</h2>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-32 flex-shrink-0 text-right">
                      <span className="text-sm font-semibold text-blue-400">{item.time}</span>
                    </div>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-white/80">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="glass rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Buffer Time</h4>
                <p className="text-white/70 text-sm">Add 20% more songs than you think you need</p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Personal Touch</h4>
                <p className="text-white/70 text-sm">Include songs meaningful to your relationship</p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Early Planning</h4>
                <p className="text-white/70 text-sm">Start your music planning 6-12 months out</p>
              </div>
            </div>

            {/* Download CTA */}
            <div className="glass-gradient rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Get Your Free PDF Checklist</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Download our complete wedding music checklist with bonus planning tips, 
                timeline templates, and vendor communication guides.
              </p>
              
              <div className="glass rounded-xl p-8 max-w-md mx-auto mb-8">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400"
                  />
                  <button className="btn-primary w-full">
                    Send Me The Checklist
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-white/60">
                We'll also send you weekly wedding planning tips. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UpTune Features */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">More Than Just a Checklist</h2>
            <p className="text-xl text-white/70 mb-12">
              UpTune helps you turn this checklist into reality with smart planning tools
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="glass rounded-lg p-6">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Interactive Planning</h4>
                <p className="text-white/70 text-sm">Check off items as you complete them</p>
              </div>
              <div className="glass rounded-lg p-6">
                <Music className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Song Suggestions</h4>
                <p className="text-white/70 text-sm">AI-powered recommendations for each moment</p>
              </div>
              <div className="glass rounded-lg p-6">
                <Download className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Export Options</h4>
                <p className="text-white/70 text-sm">Share with DJ, band, or wedding planner</p>
              </div>
            </div>

            <Link href="/auth/signup" className="btn-primary">
              Start Planning with UpTune
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}