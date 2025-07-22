import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-serif font-bold text-white mb-6">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Information We Collect</h2>
            <p className="text-white/70 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              create a wedding, or contact us for support.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-white/70 mb-4">
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, and communicate with you.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Security</h2>
            <p className="text-white/70 mb-4">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-white/70">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@weddings.uptune.xyz" className="text-purple-400 hover:text-purple-300">
                hello@weddings.uptune.xyz
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}