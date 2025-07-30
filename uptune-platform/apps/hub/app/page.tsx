import Link from 'next/link'
import { Music, Users, PartyPopper, Heart, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const products = [
    {
      name: 'Weddings',
      icon: Heart,
      description: 'Create the perfect soundtrack for your special day',
      features: ['Collaborate with partner', 'Guest song requests', 'Professional timeline'],
      url: 'https://weddings.uptune.xyz',
      color: 'from-purple-600 to-pink-600',
      status: 'live'
    },
    {
      name: 'Teams',
      icon: Users,
      description: 'Build company culture through music',
      features: ['Team preferences survey', 'Office playlists', 'Culture insights'],
      url: 'https://teams.uptune.xyz',
      color: 'from-blue-600 to-green-600',
      status: 'coming-soon'
    },
    {
      name: 'Memorials',
      icon: Heart,
      description: 'Honor loved ones with meaningful music',
      features: ['Funeral service music', 'Family collaboration', 'Memory sharing'],
      url: 'https://memorials.uptune.xyz',
      color: 'from-slate-600 to-slate-800',
      status: 'coming-soon'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">UpTune</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#products" className="text-gray-600 hover:text-gray-900">Products</Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="https://weddings.uptune.xyz/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Music for Life&apos;s{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Best Moments
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            From weddings to workplace, celebrations to ceremonies - UpTune helps you create the perfect soundtrack for every occasion.
          </p>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Choose Your Experience</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <div key={product.name} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className={`h-2 bg-gradient-to-r ${product.color}`} />
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${product.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold">
                        UpTune for {product.name}
                      </h4>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    
                    <ul className="space-y-2 mb-8">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-gray-600">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {product.status === 'live' ? (
                      <a
                        href={product.url}
                        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${product.color} text-white font-medium rounded-lg hover:shadow-lg transition-all`}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-500 font-medium rounded-lg">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">One Platform, Endless Possibilities</h3>
          <p className="text-lg text-gray-600 mb-8">
            UpTune started with weddings, but we believe music enhances every aspect of life. 
            Our platform uses advanced algorithms and human curation to create perfect playlists 
            for any occasion, bringing people together through the universal language of music.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Couples</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600">Songs Curated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Perfect Moments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-600">&copy; 2025 UpTune. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}