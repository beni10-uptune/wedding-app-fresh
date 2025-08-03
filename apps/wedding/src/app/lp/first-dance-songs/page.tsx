import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Music, Play, TrendingUp, Star, ChevronRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'First Dance Songs 2025: Perfect Wedding Playlist Guide | UpTune',
  description: 'Discover the perfect first dance songs for 2025. From timeless classics to modern hits, create unforgettable moments with our expert-curated wedding playlist guide.',
  keywords: 'first dance songs 2025, wedding first dance, romantic songs, wedding playlist',
  openGraph: {
    title: 'First Dance Songs 2025: Your Perfect Wedding Playlist',
    description: 'Find your perfect first dance song with our 2025 guide. Timeless classics, modern hits, and unique choices for every couple.',
    images: ['/images/blog/first-dance-songs-2025-perfect-wedding-playlist-hero.jpg'],
  },
}

export default function FirstDanceSongsPage() {
  const classicSongs = [
    { title: "At Last", artist: "Etta James", year: "1960", vibe: "Timeless Romance" },
    { title: "The Way You Look Tonight", artist: "Frank Sinatra", year: "1964", vibe: "Classic Elegance" },
    { title: "Can't Help Falling in Love", artist: "Elvis Presley", year: "1961", vibe: "Eternal Love" },
    { title: "Unchained Melody", artist: "The Righteous Brothers", year: "1965", vibe: "Passionate" },
  ]

  const modernHits = [
    { title: "Perfect", artist: "Ed Sheeran", year: "2017", vibe: "Contemporary Romance" },
    { title: "All of Me", artist: "John Legend", year: "2013", vibe: "Heartfelt" },
    { title: "Lover", artist: "Taylor Swift", year: "2019", vibe: "Dreamy" },
    { title: "Golden Hour", artist: "JVKE", year: "2022", vibe: "Trending" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/blog/first-dance-songs-2025-perfect-wedding-playlist-hero.jpg"
            alt="Couple's first dance at wedding"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">2025 Wedding Trends</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              First Dance Songs for Your
              <span className="block gradient-text">2025 Wedding</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              From timeless classics to chart-topping hits, find the perfect song to begin your journey as newlyweds. 
              Our expertly curated guide helps you choose a first dance that tells your love story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Start Building Your Playlist
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="#song-lists" className="btn-glass">
                Browse Song Ideas
                <Music className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 glass-darker">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">500+</div>
              <p className="text-white/70 text-sm">Curated Songs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">2025</div>
              <p className="text-white/70 text-sm">Latest Trends</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">15k+</div>
              <p className="text-white/70 text-sm">Happy Couples</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">4.9★</div>
              <p className="text-white/70 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="song-lists" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Classic Romance Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Timeless Classics</h2>
                  <p className="text-white/70">Songs that never go out of style</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <Image
                    src="/images/blog/first-dance-songs-2025-perfect-wedding-playlist-classic-romance.jpg"
                    alt="Classic romantic first dance"
                    width={600}
                    height={400}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-4">
                  {classicSongs.map((song, index) => (
                    <div key={index} className="glass rounded-lg p-4 hover:scale-[1.02] transition-transform">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{song.title}</h3>
                          <p className="text-white/70">{song.artist} • {song.year}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                          {song.vibe}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modern Hits Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Modern Chart-Toppers</h2>
                  <p className="text-white/70">Contemporary hits perfect for 2025</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div className="order-2 md:order-1 space-y-4">
                  {modernHits.map((song, index) => (
                    <div key={index} className="glass rounded-lg p-4 hover:scale-[1.02] transition-transform">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{song.title}</h3>
                          <p className="text-white/70">{song.artist} • {song.year}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                          {song.vibe}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-1 md:order-2">
                  <Image
                    src="/images/blog/first-dance-songs-2025-perfect-wedding-playlist-modern-hits.jpg"
                    alt="Modern first dance songs"
                    width={600}
                    height={400}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="glass-gradient rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">How to Choose Your Perfect First Dance</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Make It Personal</h3>
                  <p className="text-white/70 text-sm">Choose a song that tells your unique love story</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Consider the Tempo</h3>
                  <p className="text-white/70 text-sm">Pick a rhythm you're comfortable dancing to</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Trust Your Heart</h3>
                  <p className="text-white/70 text-sm">The best song is one that feels right to both of you</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Build Your Wedding Playlist?</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of couples using UpTune to create their perfect wedding soundtrack. 
                Works with Spotify, Apple Music, or any music service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="btn-primary">
                  Start Free Trial
                  <Sparkles className="w-5 h-5" />
                </Link>
                <Link href="/blog" className="btn-glass">
                  Read More Wedding Tips
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