import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PoundSterling, Users, Music, MapPin, Star, ChevronRight, CheckCircle, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Band Cost UK 2025: Pricing Guide & Tips | UpTune',
  description: 'How much does a wedding band cost in the UK? Complete 2025 pricing guide with regional costs, band types, and money-saving tips. Plan your perfect live music.',
  keywords: 'wedding band cost uk, wedding band prices uk, live wedding music cost, wedding band budget uk',
  openGraph: {
    title: 'Wedding Band Cost UK - Complete 2025 Pricing Guide',
    description: 'Detailed breakdown of wedding band costs across the UK. Compare prices by band size, genre, and location.',
    images: ['/images/lp/wedding-band-cost-uk-guide.jpg'],
  },
}

export default function UKBandCostsPage() {
  const bandTypes = [
    {
      type: "4-Piece Function Band",
      price: "£1,200-£2,500",
      description: "Most popular choice - vocals, guitar, bass, drums",
      includes: ["3 x 45min sets", "DJ service between sets", "PA & lighting", "Learn first dance"]
    },
    {
      type: "6-Piece Party Band",
      price: "£2,000-£4,000",
      description: "Fuller sound with keys and extra vocals/brass",
      includes: ["3 x 45min sets", "Enhanced sound system", "Professional lighting", "Wide repertoire"]
    },
    {
      type: "Acoustic Duo/Trio",
      price: "£600-£1,500",
      description: "Perfect for intimate venues or afternoon reception",
      includes: ["2-3 hours performance", "Background music", "Small PA system", "Request songs"]
    },
    {
      type: "Jazz/Swing Band",
      price: "£1,500-£3,500",
      description: "Sophisticated option for vintage-themed weddings",
      includes: ["Cocktail hour music", "Dinner sets", "Dance floor classics", "Period costumes"]
    },
    {
      type: "Ceilidh Band",
      price: "£800-£2,000",
      description: "Traditional Scottish/Irish dancing with caller",
      includes: ["Caller/instructor", "All equipment", "2-3 hours dancing", "Guest participation"]
    },
    {
      type: "Tribute Band",
      price: "£1,000-£3,000",
      description: "Dedicated to specific artist or era",
      includes: ["Authentic costumes", "Full production", "Hit songs", "Themed performance"]
    }
  ]

  const regionalPricing = [
    { region: "London", range: "£2,000-£5,000", note: "Highest demand, premium pricing" },
    { region: "South East", range: "£1,800-£4,000", note: "High demand areas" },
    { region: "South West", range: "£1,500-£3,500", note: "Popular wedding destination" },
    { region: "Midlands", range: "£1,200-£3,000", note: "UK average pricing" },
    { region: "North England", range: "£1,000-£2,800", note: "Competitive pricing" },
    { region: "Scotland", range: "£1,200-£3,200", note: "Varies by location" },
    { region: "Wales", range: "£1,000-£2,500", note: "Good value options" },
    { region: "Northern Ireland", range: "£900-£2,200", note: "Most affordable region" }
  ]

  const additionalCosts = [
    { item: "Travel expenses", cost: "£0.45/mile + accommodation", when: "Over 50 miles" },
    { item: "Extra sets", cost: "£200-£500 per set", when: "Beyond standard 3 sets" },
    { item: "Ceremony music", cost: "£300-£600", when: "Same band for ceremony" },
    { item: "Learning special songs", cost: "£50-£150 per song", when: "Not in repertoire" },
    { item: "Extended lineup", cost: "£200-£400 per musician", when: "Adding horn section etc" },
    { item: "Premium dates", cost: "+20-30%", when: "NYE, Bank Holidays" }
  ]

  const moneySavingTips = [
    "Book 12-18 months ahead for best availability and prices",
    "Consider Sunday-Thursday weddings for 10-20% discount",
    "Book ceremony and reception music together for package deals",
    "Choose local bands to minimize travel costs",
    "Reduce the number of sets and use DJ/playlist between",
    "Book directly with bands rather than through agencies"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black to-pink-900/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Live Band Pricing Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              UK Wedding Band Costs
              <span className="block gradient-text">2025 Complete Guide</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Everything you need to know about wedding band costs in the UK. 
              Compare prices, understand what's included, and plan your perfect live music within budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Plan Your Live Music
                <Music className="w-5 h-5" />
              </Link>
              <Link href="#band-types" className="btn-glass">
                View Band Pricing
                <PoundSterling className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Average Costs Overview */}
      <section className="py-12 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">UK Wedding Band Costs at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">£2,200</div>
                <p className="text-white/70 text-sm">Average 4-piece band</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">3-4hrs</div>
                <p className="text-white/70 text-sm">Typical performance</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">12-18m</div>
                <p className="text-white/70 text-sm">Book in advance</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">200+</div>
                <p className="text-white/70 text-sm">Songs in repertoire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Band Types and Pricing */}
      <section id="band-types" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Wedding Band Types & Pricing</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Choose the perfect band style for your wedding and budget
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {bandTypes.map((band, index) => (
                <div key={index} className="glass rounded-xl p-6 hover:scale-[1.01] transition-transform">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{band.type}</h3>
                      <p className="text-white/70 text-sm mt-1">{band.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">{band.price}</div>
                      <p className="text-xs text-white/60">Typical range</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white/80 mb-2">Usually includes:</p>
                    {band.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/70">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Regional Pricing Table */}
            <div className="mt-16 glass-gradient rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-center mb-8">Regional Price Variations</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Region</th>
                      <th className="text-center py-3 px-4">Typical Range</th>
                      <th className="text-left py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalPricing.map((region, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-3 px-4 font-medium">{region.region}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-purple-400">{region.range}</span>
                        </td>
                        <td className="py-3 px-4 text-white/70 text-sm">{region.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-8">Additional Costs to Consider</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalCosts.map((cost, index) => (
                  <div key={index} className="glass rounded-lg p-6">
                    <h4 className="font-semibold mb-2">{cost.item}</h4>
                    <div className="text-xl font-bold text-purple-400 mb-2">{cost.cost}</div>
                    <p className="text-sm text-white/60">{cost.when}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Breakdown */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What You Get for Your Money</h2>
              <p className="text-xl text-white/70">
                Understanding the value of professional wedding bands
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6">Professional Equipment</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">High-quality PA system</span>
                      <p className="text-sm text-white/60">£5,000-15,000 worth of sound equipment</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Professional lighting</span>
                      <p className="text-sm text-white/60">Stage and dance floor illumination</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Backup equipment</span>
                      <p className="text-sm text-white/60">Redundancy for reliability</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="glass rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6">Experience & Service</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Years of training</span>
                      <p className="text-sm text-white/60">Professional musicians with extensive experience</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Crowd management</span>
                      <p className="text-sm text-white/60">Reading the room and keeping energy high</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Full insurance</span>
                      <p className="text-sm text-white/60">Public liability and equipment coverage</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Money Saving Tips */}
            <div className="mt-16 glass rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Smart Ways to Save on Band Costs</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {moneySavingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews/Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Why Live Bands Are Worth the Investment</h2>
            <p className="text-xl text-white/70 mb-12">
              What couples say about their wedding band experience
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="glass rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-3">"The band made our wedding! Worth every penny for the atmosphere they created."</p>
                <p className="text-xs text-white/60">Emma & James, Surrey</p>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-3">"Our guests are still talking about how amazing the band was months later!"</p>
                <p className="text-xs text-white/60">Sophie & Mark, Manchester</p>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-3">"The energy a live band brings is incomparable. Best decision we made!"</p>
                <p className="text-xs text-white/60">Rachel & Tom, Edinburgh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Plan Your Perfect Wedding Band Experience</h2>
            <p className="text-xl text-white/70 mb-8">
              Use UpTune to organize your music timeline and connect with the best UK wedding bands
            </p>

            <div className="glass-gradient rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Find Local Bands</h4>
                  <p className="text-white/70 text-sm">Connect with bands in your area</p>
                </div>
                <div>
                  <Music className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Plan Your Music</h4>
                  <p className="text-white/70 text-sm">Create the perfect setlist</p>
                </div>
                <div>
                  <PoundSterling className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Stay on Budget</h4>
                  <p className="text-white/70 text-sm">Track costs and compare quotes</p>
                </div>
              </div>

              <Link href="/auth/signup" className="btn-primary">
                Start Planning Your Band
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-sm text-white/60 mt-6">
              Free to use • Works with all UK bands • No booking fees
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}