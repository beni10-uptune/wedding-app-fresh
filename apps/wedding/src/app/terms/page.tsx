import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="glass rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-serif font-bold text-white mb-6">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/70 mb-4">
              By accessing and using UpTune for Weddings, you agree to be bound by these Terms of Service.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Service Description</h2>
            <p className="text-white/70 mb-4">
              UpTune for Weddings provides a platform for creating and managing wedding playlists, 
              collaborating with guests, and exporting music for your special day.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Payment Terms</h2>
            <p className="text-white/70 mb-4">
              Access to our services requires a one-time payment of £25. All payments are processed 
              securely through Stripe. We offer a 30-day money-back guarantee.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. User Responsibilities</h2>
            <p className="text-white/70 mb-4">
              You are responsible for maintaining the confidentiality of your account and for all 
              activities that occur under your account.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-white/70 mb-4">
              The music suggestions and playlists you create remain your property. We do not claim 
              ownership over your content.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Contact Information</h2>
            <p className="text-white/70">
              For questions about these Terms, please{' '}
              <Link href="/contact" className="text-purple-400 hover:text-purple-300">
                contact our support team
              </Link>
              {' '}using our contact form.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}