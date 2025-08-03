import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Music, Disc, Radio, Users, Download, CheckCircle, ChevronRight, Headphones } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Music Without Spotify: Alternative Solutions | UpTune',
  description: 'Plan perfect wedding music without Spotify. Explore DJ-friendly formats, live music options, and alternative streaming platforms for your big day.',
  keywords: 'wedding music without spotify, wedding dj, live wedding music, wedding playlist alternatives',
  openGraph: {
    title: 'Wedding Music Without Spotify: Complete Guide',
    description: 'Discover how to create the perfect wedding soundtrack without relying on Spotify. Professional alternatives for every budget.',
    images: ['/images/blog/wedding-music-without-spotify-guide-hero.jpg'],
  },
}

export default function NoSpotifyPage() {
  const alternatives = [
    {
      icon: Disc,
      title: "Professional DJ Services",
      description: "Experienced DJs bring their own music libraries and equipment",
      benefits: ["No internet required", "Professional mixing", "Read the room", "Request handling"]
    },
    {
      icon: Radio,
      title: "Live Bands & Musicians",
      description: "Create unforgettable moments with live performances",
      benefits: ["Unique atmosphere", "Personal touch", "Guest interaction", "Memorable experience"]
    },
    {
      icon: Download,
      title: "Offline Playlists",
      description: "Download music from various sources for offline playback",
      benefits: ["Total control", "No streaming issues", "Works anywhere", "One-time purchase"]
    },
    {
      icon: Headphones,
      title: "Alternative Platforms",
      description: "Use Apple Music, YouTube Music, or Amazon Music",
      benefits: ["Similar features", "Offline options", "Wide selection", "DJ-compatible"]
    }
  ]

  const features = [
    "Export song lists as PDF for any DJ or band",
    "Works with all music services and formats",
    "Timeline planning for perfect flow",
    "Guest request management system",
    "No vendor lock-in",
    "Professional documentation"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/blog/wedding-music-without-spotify-guide-hero.jpg"
            alt="Wedding music setup without Spotify"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-6">
              <Music className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Spotify-Free Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Perfect Wedding Music
              <span className="block gradient-text">Without Spotify</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Create your dream wedding soundtrack without relying on streaming services. 
              Professional alternatives that work with any DJ, band, or venue sound system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Start Planning Your Music
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="#alternatives" className="btn-glass">
                Explore Alternatives
                <Music className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* UpTune Works With Everything */}
      <section className="py-16 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">UpTune Works With Everything</h2>
            <p className="text-lg text-white/70 mb-8">
              Our platform helps you plan and organize your wedding music, regardless of how you choose to play it
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alternatives Section */}
      <section id="alternatives" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Professional Alternatives to Spotify</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Choose the perfect solution for your wedding style and budget
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {alternatives.map((alt, index) => {
                const Icon = alt.icon
                return (
                  <div key={index} className="glass rounded-xl p-8 hover:scale-[1.02] transition-transform">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{alt.title}</h3>
                        <p className="text-white/70">{alt.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {alt.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-white/80">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Visual Sections */}
            <div className="space-y-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4">Work with Any DJ or Band</h3>
                  <p className="text-white/70 mb-6">
                    UpTune creates professional documentation that any music professional can use. 
                    Export detailed PDFs with song information, timing notes, and special requests.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Complete song lists with artist and duration info</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Timeline with specific moments and transitions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Do-not-play lists and special instructions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <Image
                    src="/images/blog/wedding-music-without-spotify-guide-alternative-options.jpg"
                    alt="DJ using UpTune documentation"
                    width={600}
                    height={400}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <Image
                    src="/images/blog/wedding-music-without-spotify-guide-live-music-options.jpg"
                    alt="Live wedding band performing"
                    width={600}
                    height={400}
                    className="rounded-xl"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-3xl font-bold mb-4">Perfect for Live Music</h3>
                  <p className="text-white/70 mb-6">
                    Planning live music? UpTune helps you coordinate with bands and musicians by providing 
                    clear documentation of your musical preferences and timeline.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Share reference songs for style and tempo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Coordinate special moments like first dance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Mix live performances with recorded music</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-20 glass-gradient rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center mb-12">How UpTune Works Without Spotify</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Build Your List</h4>
                  <p className="text-white/70 text-sm">Search and add songs from our database</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Plan Timeline</h4>
                  <p className="text-white/70 text-sm">Organize music for each moment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Export PDF</h4>
                  <p className="text-white/70 text-sm">Professional docs for any vendor</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">4</span>
                  </div>
                  <h4 className="font-semibold mb-2">Enjoy!</h4>
                  <p className="text-white/70 text-sm">Perfect music on your big day</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold mb-4">Start Planning Your Wedding Music Today</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of couples who use UpTune to plan their perfect wedding soundtrack, 
                with or without streaming services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="btn-primary">
                  Try UpTune Free
                  <Music className="w-5 h-5" />
                </Link>
                <Link href="/" className="btn-glass">
                  See All Features
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