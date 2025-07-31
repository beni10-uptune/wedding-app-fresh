import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Music } from 'lucide-react'

export default function ContactPage() {
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
          <h1 className="text-4xl font-serif font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-white/70 mb-12">
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
                <p className="text-white/70 mb-6">
                  Our team is here to help you create the perfect wedding soundtrack.
                </p>
              </div>

              <div className="space-y-4">
                <a 
                  href="mailto:hello@weddings.uptune.xyz" 
                  className="flex items-center gap-4 p-4 glass rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Mail className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-semibold text-white">Email Us</p>
                    <p className="text-sm text-white/60">hello@weddings.uptune.xyz</p>
                  </div>
                </a>

                <Link 
                  href="/help" 
                  className="flex items-center gap-4 p-4 glass rounded-lg hover:bg-white/5 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-pink-400" />
                  <div>
                    <p className="font-semibold text-white">Help Center</p>
                    <p className="text-sm text-white/60">Browse FAQs and guides</p>
                  </div>
                </Link>

                <a 
                  href="https://uptune.xyz" 
                  className="flex items-center gap-4 p-4 glass rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Music className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-semibold text-white">Main Website</p>
                    <p className="text-sm text-white/60">Visit UpTune</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="glass-darker rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">What to Expect</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>We typically respond within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Include your wedding ID for faster support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Check our Help Center for instant answers</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/60">
                  For urgent payment issues, please include your payment reference in your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}