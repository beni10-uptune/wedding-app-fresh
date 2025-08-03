import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PoundSterling, Disc, Music, Clock, Star, ChevronRight, CheckCircle, Headphones } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding DJ Cost UK 2025: Complete Pricing Guide | UpTune',
  description: 'How much does a wedding DJ cost in the UK? Detailed 2025 pricing guide covering DJ packages, what\'s included, and how to get the best value for your wedding.',
  keywords: 'wedding dj cost uk, wedding dj prices uk, mobile dj cost, wedding disco prices',
  openGraph: {
    title: 'Wedding DJ Cost UK - 2025 Pricing & Package Guide',
    description: 'Everything you need to know about UK wedding DJ costs. Compare packages, understand pricing, and plan your perfect wedding entertainment.',
    images: ['/images/lp/wedding-dj-cost-uk-guide.jpg'],
  },
}

export default function UKDJCostsPage() {
  const djPackages = [
    {
      package: "Basic DJ Package",
      price: "£400-£700",
      hours: "5-6 hours",
      description: "Essential DJ service for smaller weddings",
      includes: [
        "Professional DJ & equipment",
        "Basic lighting setup",
        "Music consultation",
        "Wireless microphone"
      ],
      ideal: "Intimate weddings under 80 guests"
    },
    {
      package: "Standard Package",
      price: "£700-£1,200",
      hours: "6-8 hours",
      description: "Most popular choice for UK weddings",
      includes: [
        "Everything in Basic",
        "Dance floor lighting",
        "Uplighting (4-6 lights)",
        "Online planning portal",
        "Backup equipment"
      ],
      ideal: "Traditional weddings 80-150 guests"
    },
    {
      package: "Premium Package",
      price: "£1,200-£2,000",
      hours: "8-12 hours",
      description: "Full day coverage with enhanced production",
      includes: [
        "Everything in Standard",
        "Ceremony music system",
        "LED dance floor option",
        "Photo booth bundle",
        "Video screens",
        "Dedicated coordinator"
      ],
      ideal: "Large weddings 150+ guests"
    },
    {
      package: "Luxury Package",
      price: "£2,000-£3,500+",
      hours: "Full day",
      description: "Premium entertainment experience",
      includes: [
        "Celebrity/specialist DJs",
        "Live musician hybrid",
        "Custom staging",
        "Pyrotechnics/effects",
        "Multiple sound zones",
        "Full production team"
      ],
      ideal: "High-end venues & productions"
    }
  ]

  const additionalServices = [
    { service: "Ceremony music system", price: "£150-£300", description: "Separate setup for outdoor ceremonies" },
    { service: "Uplighting package", price: "£200-£500", description: "8-16 LED uplights around venue" },
    { service: "LED dance floor", price: "£400-£800", description: "Illuminated floor sections" },
    { service: "Photo booth", price: "£300-£600", description: "Props, prints, and digital copies" },
    { service: "Live saxophone/percussion", price: "£300-£600", description: "DJ with live musician sets" },
    { service: "Monogram projection", price: "£150-£250", description: "Names/date on wall or floor" }
  ]

  const costFactors = [
    {
      factor: "Day of the week",
      impact: "Save 20-30%",
      details: "Sunday-Thursday significantly cheaper"
    },
    {
      factor: "Time of year",
      impact: "Save 15-25%",
      details: "Off-peak season (Nov-March) discounts"
    },
    {
      factor: "Location",
      impact: "±30% variance",
      details: "London/South East premium pricing"
    },
    {
      factor: "Experience level",
      impact: "£200-£1000 difference",
      details: "Established DJs charge more"
    },
    {
      factor: "Travel distance",
      impact: "£0.45/mile",
      details: "Plus accommodation if needed"
    },
    {
      factor: "Equipment quality",
      impact: "Affects base price",
      details: "Premium brands cost more"
    }
  ]

  const whatToAsk = [
    "Is PAT testing and public liability insurance included?",
    "What's your backup plan if you're ill?",
    "Can we see you perform at another wedding?",
    "Do you take requests on the night?",
    "What's included in your lighting package?",
    "How do you handle the music between sets?",
    "Can you provide music for our ceremony?",
    "Do you offer any package deals?"
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
              <Disc className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">DJ Pricing Guide 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Wedding DJ Costs
              <span className="block gradient-text">UK Price Guide</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Complete breakdown of wedding DJ costs across the UK. Understand packages, 
              compare prices, and find the perfect DJ for your budget and style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Plan Your DJ Music
                <Headphones className="w-5 h-5" />
              </Link>
              <Link href="#packages" className="btn-glass">
                View DJ Packages
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">£950</div>
                <p className="text-white/70 text-sm">Average UK DJ cost</p>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">6-8hrs</div>
                <p className="text-white/70 text-sm">Typical coverage</p>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">70%</div>
                <p className="text-white/70 text-sm">Choose DJ over band</p>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">6-9m</div>
                <p className="text-white/70 text-sm">Book in advance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DJ Packages */}
      <section id="packages" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Wedding DJ Packages & Pricing</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                From basic disco to full production - find the right package for your wedding
              </p>
            </div>

            <div className="space-y-8">
              {djPackages.map((pkg, index) => (
                <div key={index} className="glass rounded-xl overflow-hidden">
                  <div className="p-8">
                    <div className="grid md:grid-cols-[2fr,1fr] gap-8">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold">{pkg.package}</h3>
                            <p className="text-white/70">{pkg.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold gradient-text">{pkg.price}</div>
                            <p className="text-sm text-white/60">{pkg.hours}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold mb-3">What's included:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pkg.includes.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-white/80">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass rounded-lg p-6 text-center">
                        <Music className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <p className="text-sm font-semibold mb-2">Ideal for:</p>
                        <p className="text-sm text-white/70">{pkg.ideal}</p>
                      </div>
                    </div>
                  </div>
                  
                  {index === 1 && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-center">
                      <span className="text-sm font-semibold">Most Popular Choice</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Services */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-8">Popular Add-On Services</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalServices.map((service, index) => (
                  <div key={index} className="glass rounded-lg p-6">
                    <h4 className="font-semibold mb-2">{service.service}</h4>
                    <div className="text-xl font-bold text-blue-400 mb-2">{service.price}</div>
                    <p className="text-sm text-white/60">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Affects DJ Pricing?</h2>
              <p className="text-xl text-white/70">
                Understanding the factors that influence wedding DJ costs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {costFactors.map((factor, index) => (
                <div key={index} className="glass rounded-lg p-6">
                  <h4 className="font-semibold mb-2">{factor.factor}</h4>
                  <div className="text-lg font-bold text-purple-400 mb-2">{factor.impact}</div>
                  <p className="text-sm text-white/70">{factor.details}</p>
                </div>
              ))}
            </div>

            {/* Value Comparison */}
            <div className="mt-16 glass-gradient rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-center mb-8">DJ vs Band: Cost Comparison</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Disc className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-3">Wedding DJ</h4>
                  <div className="text-3xl font-bold gradient-text mb-3">£600-£1,500</div>
                  <ul className="text-left space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Any genre, any era</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Continuous music all night</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Takes requests easily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>MC announcements included</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-3">Live Band</h4>
                  <div className="text-3xl font-bold gradient-text mb-3">£1,500-£4,000</div>
                  <ul className="text-left space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Live performance energy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Visual entertainment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Unique arrangements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Premium feel</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions to Ask */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Questions to Ask Your Wedding DJ</h2>
              <p className="text-xl text-white/70">
                Get these answers before booking to ensure the perfect fit
              </p>
            </div>

            <div className="glass rounded-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6">
                {whatToAsk.map((question, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-white/80">{question}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="glass rounded-lg p-6 text-center">
                <div className="flex gap-1 justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-3">"Our DJ was worth every penny. The dance floor was packed all night!"</p>
                <p className="text-xs text-white/60">Sarah & Mike, Birmingham</p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="flex gap-1 justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-3">"Professional setup, great music selection, and fantastic MC skills."</p>
                <p className="text-xs text-white/60">Lucy & James, Leeds</p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="flex gap-1 justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-3">"The lighting transformed our venue. So glad we chose the premium package!"</p>
                <p className="text-xs text-white/60">Emma & David, London</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Plan Your Perfect Wedding Music</h2>
            <p className="text-xl text-white/70 mb-8">
              Use UpTune to create your playlist and share it with any DJ
            </p>

            <div className="glass-gradient rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Timeline Builder</h4>
                  <p className="text-white/70 text-sm">Plan music for every moment</p>
                </div>
                <div>
                  <Disc className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">DJ Export</h4>
                  <p className="text-white/70 text-sm">Share your must-play list</p>
                </div>
                <div>
                  <PoundSterling className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Budget Tools</h4>
                  <p className="text-white/70 text-sm">Track all music costs</p>
                </div>
              </div>

              <Link href="/auth/signup" className="btn-primary">
                Start Planning Free
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-sm text-white/60 mt-6">
              Works with all DJs • No credit card required • Free forever plan
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}