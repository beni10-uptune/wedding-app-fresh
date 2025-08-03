import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Music, Sparkles, Heart, Users, Clock, ChevronRight, CheckCircle, Play } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Playlist Maker: Create Perfect Music for Every Moment | UpTune',
  description: 'Build your perfect wedding playlist with our smart playlist maker. Organize songs for ceremony, reception, and every special moment. Free to start!',
  keywords: 'wedding playlist maker, wedding music app, create wedding playlist, wedding songs organizer',
  openGraph: {
    title: 'Wedding Playlist Maker - Smart Music Planning for Your Big Day',
    description: 'Create the perfect wedding soundtrack with our smart playlist maker. Organize music for every moment from ceremony to last dance.',
    images: ['/images/lp/wedding-playlist-maker-hero.jpg'],
  },
}

export default function PlaylistMakerPage() {
  const features = [
    {
      icon: Sparkles,
      title: "Curated Song Collections",
      description: "Browse expert-curated playlists for every wedding moment and style"
    },
    {
      icon: Clock,
      title: "Timeline Organization",
      description: "Arrange music perfectly for ceremony, cocktails, dinner, and dancing"
    },
    {
      icon: Users,
      title: "Guest Collaboration",
      description: "Let guests suggest songs and vote on favorites before your big day"
    },
    {
      icon: Music,
      title: "Multi-Platform Export",
      description: "Export to Spotify, Apple Music, or PDF for any DJ or band"
    },
    {
      icon: Heart,
      title: "Moment Matching",
      description: "Perfect songs for processional, first dance, parent dances, and more"
    },
    {
      icon: Play,
      title: "Preview & Test",
      description: "Listen to full playlists and test transitions before the wedding"
    }
  ]

  const testimonials = [
    {
      quote: "UpTune made organizing our wedding music so easy! The curated playlists were perfect for us.",
      author: "Sarah & Michael",
      location: "New York, NY",
      rating: 5
    },
    {
      quote: "Our DJ loved the detailed timeline we created. Everything flowed perfectly!",
      author: "Jessica & David",
      location: "Los Angeles, CA",
      rating: 5
    },
    {
      quote: "The guest request feature was a hit! Everyone felt involved in our special day.",
      author: "Emily & James",
      location: "Chicago, IL",
      rating: 5
    }
  ]

  const steps = [
    "Sign up for free and create your wedding profile",
    "Add your favorite songs or browse curated collections",
    "Organize music by wedding moments",
    "Share with guests for requests",
    "Export for your DJ or band"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black to-pink-900/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">#1 Wedding Music App</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                  The Smart
                  <span className="block gradient-text">Wedding Playlist Maker</span>
                </h1>
                
                <p className="text-xl text-white/80 mb-8">
                  Create your perfect wedding soundtrack in minutes. Curated collections, 
                  timeline planning, and seamless collaboration with guests and vendors.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/auth/signup" className="btn-primary">
                    Start Making Your Playlist
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link href="#how-it-works" className="btn-glass">
                    See How It Works
                    <Play className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>15,000+ couples</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 glass rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 glass rounded-lg">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">Ceremony Music</div>
                        <div className="text-sm text-white/60">12 songs • 45 mins</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 glass rounded-lg">
                      <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">First Dance</div>
                        <div className="text-sm text-white/60">Perfect - Ed Sheeran</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 glass rounded-lg">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">Reception Dancing</div>
                        <div className="text-sm text-white/60">68 songs • 4 hours</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 glass-darker">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">15,000+</div>
              <p className="text-white/70 text-sm">Happy Couples</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">50,000+</div>
              <p className="text-white/70 text-sm">Playlists Created</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">4.9/5</div>
              <p className="text-white/70 text-sm">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">24/7</div>
              <p className="text-white/70 text-sm">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Everything You Need for Perfect Wedding Music</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Our wedding playlist maker includes all the tools to create, organize, and share your perfect soundtrack
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How Our Playlist Maker Works</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Create your perfect wedding playlist in 5 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>

            {/* Visual Demo */}
            <div className="glass-gradient rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">See It In Action</h3>
                  <p className="text-white/70 mb-6">
                    Watch how easy it is to create your wedding playlist with our smart tools. 
                    From AI suggestions to timeline planning, we make it simple.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Add songs by searching or scanning Spotify</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Organize by wedding moments automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Get suggestions from curated collections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Share with vendors in any format</span>
                    </li>
                  </ul>
                  <Link href="/auth/signup" className="btn-primary inline-flex">
                    Try It Free
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="glass rounded-xl p-6">
                  <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Loved by Couples Everywhere</h2>
              <p className="text-xl text-white/70">
                Join thousands who've created their perfect wedding soundtrack with UpTune
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="glass rounded-xl p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-lg mb-6">"{testimonial.quote}"</p>
                  <div className="text-sm">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-white/60">{testimonial.location}</div>
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
              Start Creating Your Perfect Wedding Playlist Today
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join 15,000+ couples who've made their wedding music planning stress-free and fun
            </p>
            
            <div className="glass-gradient rounded-2xl p-8 md:p-12 mb-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">Free</div>
                  <p className="text-white/70">Start with 50 songs</p>
                  <p className="text-sm text-white/50 mt-1">Perfect for trying it out</p>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">£25</div>
                  <p className="text-white/70">One-time payment</p>
                  <p className="text-sm text-white/50 mt-1">Unlimited songs forever</p>
                </div>
              </div>
              
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 inline-flex">
                Create Your Wedding Playlist Now
                <Sparkles className="w-6 h-6" />
              </Link>
            </div>

            <p className="text-sm text-white/60">
              No credit card required • Works with Spotify, Apple Music & more • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}