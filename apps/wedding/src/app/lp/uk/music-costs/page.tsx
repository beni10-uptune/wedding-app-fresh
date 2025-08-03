import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PoundSterling, Music, Users, TrendingUp, ChevronRight, CheckCircle, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Music Cost UK 2025: Complete Budget Guide | UpTune',
  description: 'How much does wedding music cost in the UK? Complete 2025 pricing guide for DJs, bands, and musicians. Save money with our expert budgeting tips.',
  keywords: 'wedding music cost uk, wedding dj prices uk, wedding band cost uk, wedding music budget',
  openGraph: {
    title: 'Wedding Music Cost UK - 2025 Pricing Guide',
    description: 'Detailed breakdown of UK wedding music costs. Compare DJs, bands, and musicians with real 2025 prices.',
    images: ['/images/blog/wedding-music-cost-uk-complete-budget-guide-hero.jpg'],
  },
}

export default function UKMusicCostsPage() {
  const costBreakdown = [
    {
      type: "Wedding DJ",
      avgCost: "£600-£1,500",
      description: "Professional DJ with equipment and lighting",
      factors: ["Experience level", "Duration of service", "Equipment quality", "Travel distance"]
    },
    {
      type: "Live Band",
      avgCost: "£1,500-£4,000",
      description: "4-6 piece wedding band for evening reception",
      factors: ["Number of musicians", "Repertoire size", "Duration of sets", "Equipment provided"]
    },
    {
      type: "String Quartet",
      avgCost: "£500-£1,200",
      description: "Classical music for ceremony and drinks",
      factors: ["Duration of performance", "Travel costs", "Special requests", "Venue acoustics"]
    },
    {
      type: "Solo Musician",
      avgCost: "£300-£800",
      description: "Guitarist, pianist, or vocalist",
      factors: ["Instrument type", "Performance length", "PA system needs", "Song requests"]
    },
    {
      type: "Ceremony Music",
      avgCost: "£200-£600",
      description: "Organist or recorded music setup",
      factors: ["Live vs recorded", "Equipment rental", "Venue requirements", "Song licensing"]
    }
  ]

  const regionPricing = [
    { region: "London & South East", modifier: "+20-40%" },
    { region: "South West", modifier: "+10-20%" },
    { region: "Midlands", modifier: "Average" },
    { region: "North England", modifier: "-10-20%" },
    { region: "Scotland", modifier: "-5-15%" },
    { region: "Wales", modifier: "-10-15%" }
  ]

  const savingTips = [
    {
      tip: "Book early for better rates",
      savings: "Save 10-20%",
      description: "Many vendors offer early booking discounts"
    },
    {
      tip: "Consider off-peak dates",
      savings: "Save 15-30%",
      description: "Weekday and off-season weddings cost less"
    },
    {
      tip: "Reduce performance hours",
      savings: "Save £200-500",
      description: "Use playlists during dinner or cocktails"
    },
    {
      tip: "Bundle services",
      savings: "Save 10-15%",
      description: "Book ceremony and reception music together"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/blog/wedding-music-cost-uk-complete-budget-guide-hero.jpg"
            alt="UK wedding music costs guide"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
              <PoundSterling className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">2025 UK Pricing Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Wedding Music Costs
              <span className="block gradient-text">UK 2025 Guide</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Complete breakdown of wedding music costs across the UK. Compare prices for DJs, bands, 
              and musicians to plan your perfect wedding soundtrack within budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary">
                Plan Your Music Budget
                <Calculator className="w-5 h-5" />
              </Link>
              <Link href="#cost-breakdown" className="btn-glass">
                View Cost Breakdown
                <ChevronRight className="w-5 h-5" />
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
              <div className="text-3xl font-bold gradient-text mb-1">£950</div>
              <p className="text-white/70 text-sm">Average DJ Cost</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">£2,500</div>
              <p className="text-white/70 text-sm">Average Band Cost</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">15%</div>
              <p className="text-white/70 text-sm">Music Budget Portion</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">£32k</div>
              <p className="text-white/70 text-sm">UK Average Wedding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Cost Breakdown */}
      <section id="cost-breakdown" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">2025 Wedding Music Costs by Type</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Detailed pricing for different music options across the UK
              </p>
            </div>

            <div className="space-y-8">
              {costBreakdown.map((item, index) => (
                <div key={index} className="glass rounded-xl p-8">
                  <div className="grid md:grid-cols-[1fr,auto] gap-6 items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{item.type}</h3>
                      <p className="text-white/70">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold gradient-text">{item.avgCost}</div>
                      <p className="text-sm text-white/60">Average UK price</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Price factors:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {item.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-white/80">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Regional Variations */}
            <div className="mt-16 glass-gradient rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-center mb-8">Regional Price Variations</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regionPricing.map((region, index) => (
                  <div key={index} className="glass rounded-lg p-6 text-center">
                    <h4 className="font-semibold mb-2">{region.region}</h4>
                    <div className="text-2xl font-bold text-emerald-400">{region.modifier}</div>
                    <p className="text-sm text-white/60 mt-2">vs UK average</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Calculator */}
            <div className="mt-16 glass rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Quick Budget Calculator</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Wedding Budget</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                      <input
                        type="text"
                        placeholder="25,000"
                        className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Music Budget %</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-emerald-400">
                      <option>10% - Conservative</option>
                      <option selected>15% - Recommended</option>
                      <option>20% - Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Music Budget</label>
                    <div className="text-3xl font-bold gradient-text">£3,750</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Money Saving Tips */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-12">Smart Ways to Save</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {savingTips.map((tip, index) => (
                  <div key={index} className="glass rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold">{tip.tip}</h4>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                        {tip.savings}
                      </span>
                    </div>
                    <p className="text-white/70">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 glass-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What's Typically Included</h2>
              <p className="text-xl text-white/70">
                Understanding what you get for your money
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Music className="w-6 h-6 text-purple-400" />
                  DJ Package Usually Includes
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Professional sound system and microphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Dance floor lighting and effects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Pre-event consultation and planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>MC services for announcements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Backup equipment and contingency plans</span>
                  </li>
                </ul>
              </div>

              <div className="glass rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-pink-400" />
                  Band Package Usually Includes
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Full PA system and stage lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>2-3 sets of live music (2-3 hours)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>DJ service between sets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Learn first dance or special songs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Professional insurance and PAT testing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Plan Your Wedding Music Within Budget</h2>
            <p className="text-xl text-white/70 mb-8">
              Use UpTune to organize your music and get accurate quotes from UK vendors
            </p>

            <div className="glass-gradient rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Budget Tracking</h4>
                  <p className="text-white/70 text-sm">Monitor costs and stay on budget</p>
                </div>
                <div>
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Vendor Network</h4>
                  <p className="text-white/70 text-sm">Connect with UK music professionals</p>
                </div>
                <div>
                  <Music className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Music Planning</h4>
                  <p className="text-white/70 text-sm">Organize every musical moment</p>
                </div>
              </div>

              <Link href="/auth/signup" className="btn-primary">
                Start Planning Your Music
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-sm text-white/60 mt-6">
              Free to start • No credit card required • Works with all UK vendors
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}