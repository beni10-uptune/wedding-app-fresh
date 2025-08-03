import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Smartphone, Music, Users, Heart, Download, ChevronRight, CheckCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Best Wedding Music App 2025: Plan, Organize & Share | UpTune',
  description: 'The #1 wedding music app for modern couples. Create playlists, collaborate with guests, and organize your perfect soundtrack. Works with Spotify, Apple Music & more.',
  keywords: 'wedding music app, wedding playlist app, wedding song app, wedding music planner',
  openGraph: {
    title: 'UpTune - The Ultimate Wedding Music App',
    description: 'Plan your perfect wedding soundtrack with the app trusted by 15,000+ couples. Smart features, easy sharing, works with all music services.',
    images: ['/images/lp/wedding-music-app-hero.jpg'],
  },
}

export default function WeddingMusicAppPage() {
  const appFeatures = [
    {
      icon: Music,
      title: "Smart Playlist Builder",
      description: "AI-powered suggestions based on your music taste and wedding style"
    },
    {
      icon: Users,
      title: "Guest Collaboration",
      description: "Let guests request songs and vote on favorites through your custom link"
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description: "Access on any device - phone, tablet, or computer. No downloads needed"
    },
    {
      icon: Heart,
      title: "Moment Planning",
      description: "Organize music for ceremony, cocktails, dinner, and dancing"
    },
    {
      icon: Download,
      title: "Universal Export",
      description: "Share with any DJ or band - works with Spotify, Apple Music, YouTube"
    },
    {
      icon: Star,
      title: "Premium Features",
      description: "Unlimited songs, advanced analytics, priority support"
    }
  ]

  const comparison = [
    { feature: "Create wedding playlists", uptune: true, spotify: true, others: false },
    { feature: "Guest song requests", uptune: true, spotify: false, others: false },
    { feature: "Timeline organization", uptune: true, spotify: false, others: false },
    { feature: "Works without streaming", uptune: true, spotify: false, others: false },
    { feature: "DJ/Band export", uptune: true, spotify: false, others: false },
    { feature: "AI recommendations", uptune: true, spotify: true, others: false },
    { feature: "Multi-platform support", uptune: true, spotify: true, others: true },
    { feature: "Wedding-specific features", uptune: true, spotify: false, others: false }
  ]

  const reviews = [
    {
      name: "Rachel & Tom",
      location: "San Francisco, CA",
      rating: 5,
      text: "This app saved us so much time! The AI suggestions were perfect and our DJ loved the detailed timeline."
    },
    {
      name: "Maria & Carlos",
      location: "Miami, FL",
      rating: 5,
      text: "Being able to organize music by wedding moments was a game-changer. So much better than just Spotify!"
    },
    {
      name: "Ashley & Ben",
      location: "Austin, TX",
      rating: 5,
      text: "The guest request feature was amazing - everyone felt involved in our big day!"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-black to-purple-900/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-6">
                  <Star className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">Rated 4.9/5 by 15,000+ Couples</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                  The Only
                  <span className="block gradient-text">Wedding Music App</span>
                  You'll Ever Need
                </h1>
                
                <p className="text-xl text-white/80 mb-8">
                  Plan, organize, and share your perfect wedding soundtrack. Works with every music service 
                  and makes collaboration with guests and vendors effortless.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/auth/signup" className="btn-primary">
                    Try UpTune Free
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link href="#features" className="btn-glass">
                    See All Features
                    <Smartphone className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-black"></div>
                    ))}
                  </div>
                  <p className="text-sm text-white/70">Join 15,000+ happy couples</p>
                </div>
              </div>

              <div>
                <div className="relative mx-auto max-w-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] blur-xl opacity-50"></div>
                  <div className="relative bg-black rounded-[3rem] p-4 border-8 border-gray-800">
                    <div className="bg-gray-900 rounded-[2rem] p-6 h-[600px] overflow-hidden">
                      <div className="space-y-4">
                        <div className="glass rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <Music className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">Ceremony</div>
                              <div className="text-xs text-white/60">12 songs</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-white/10 rounded-full"></div>
                            <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                          </div>
                        </div>
                        
                        <div className="glass rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                              <Heart className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">First Dance</div>
                              <div className="text-xs text-white/60">Perfect - Ed Sheeran</div>
                            </div>
                          </div>
                        </div>

                        <div className="glass rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">Guest Requests</div>
                              <div className="text-xs text-white/60">24 pending</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Features */}
      <section id="features" className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why UpTune is the Best Wedding Music App</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Built specifically for weddings with features you won't find anywhere else
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {appFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                )
              })}
            </div>

            {/* Comparison Table */}
            <div className="glass-gradient rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-center mb-8">UpTune vs Other Options</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">
                        <div className="font-semibold">UpTune</div>
                        <div className="text-xs text-white/60">Wedding App</div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="font-semibold">Spotify</div>
                        <div className="text-xs text-white/60">Music Only</div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="font-semibold">Others</div>
                        <div className="text-xs text-white/60">Generic Apps</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-4 px-4 text-white/80">{row.feature}</td>
                        <td className="text-center py-4 px-4">
                          {row.uptune ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-white/20">—</span>
                          )}
                        </td>
                        <td className="text-center py-4 px-4">
                          {row.spotify ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-white/20">—</span>
                          )}
                        </td>
                        <td className="text-center py-4 px-4">
                          {row.others ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-white/20">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Loved by Couples Nationwide</h2>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-xl text-white/70">4.9/5 average rating from 15,000+ reviews</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div key={index} className="glass rounded-xl p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg mb-6">"{review.text}"</p>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-white/60">{review.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Experience the Best Wedding Music App?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of couples who've simplified their wedding music planning with UpTune
            </p>

            <div className="glass-gradient rounded-2xl p-8 md:p-12">
              <div className="mb-8">
                <div className="text-5xl font-bold gradient-text mb-2">Start Free</div>
                <p className="text-white/70">No credit card required</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm">50 songs free</p>
                </div>
                <div>
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm">Guest requests</p>
                </div>
                <div>
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm">Timeline builder</p>
                </div>
              </div>

              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
                Download UpTune Now
                <Smartphone className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}