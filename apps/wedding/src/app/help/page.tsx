import Link from 'next/link'
import { ArrowLeft, Music, Mail, MessageCircle } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export default function HelpPage() {
  const faqs = [
    {
      question: "How does UpTune for Weddings work?",
      answer: "Create your wedding, build playlists for each moment of your special day, invite guests to suggest songs, and export everything for your DJ or band."
    },
    {
      question: "Is it really a one-time payment?",
      answer: "Yes! For £25, you get lifetime access to all features. No subscriptions, no hidden fees."
    },
    {
      question: "Can guests add songs without creating an account?",
      answer: "Absolutely! Guests can suggest songs using just the link you share with them - no account needed."
    },
    {
      question: "How do I export my playlists?",
      answer: "You can export to Spotify, download as PDF, or get a formatted list for your DJ. All export options are available in your wedding dashboard."
    },
    {
      question: "What if I need to make changes after paying?",
      answer: "You have unlimited access to edit your playlists, add songs, and manage guests even after your wedding day."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, all payments are processed securely through Stripe. We never store your payment information."
    }
  ]

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

        <div className="glass rounded-2xl p-8 md:p-12 mb-8">
          <h1 className="text-4xl font-serif font-bold text-white mb-6">Help Center</h1>
          <p className="text-xl text-white/70">
            Everything you need to know about creating your perfect wedding soundtrack
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link href="/auth/signup" className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform">
            <Music className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Getting Started</h3>
            <p className="text-sm text-white/60">Create your wedding and start building playlists</p>
          </Link>
          
          <Link href="#contact" className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform">
            <MessageCircle className="w-8 h-8 text-pink-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Contact Support</h3>
            <p className="text-sm text-white/60">We're here to help with any questions</p>
          </Link>
          
          <Link href="/contact" className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform">
            <Mail className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Send Message</h3>
            <p className="text-sm text-white/60">Get in touch with our team</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-serif font-bold text-white mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/10 pb-6 last:border-0">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-white/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="glass rounded-2xl p-8 md:p-12 mt-8">
          <h2 className="text-2xl font-serif font-bold text-white mb-6">Still Need Help?</h2>
          <p className="text-white/70 mb-6">
            We're here to make your wedding music planning as smooth as possible. Send us a message and we'll get back to you within 24 hours.
          </p>
          <div className="glass-darker rounded-xl p-6">
            <ContactForm category="support" subject="Help Request" />
          </div>
        </div>
      </div>
    </div>
  )
}