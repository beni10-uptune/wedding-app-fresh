'use client'

import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import Link from 'next/link'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [hasConsented, setHasConsented] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (consent === null) {
      setShowBanner(true)
      setHasConsented(null)
    } else {
      setHasConsented(consent === 'true')
      // Initialize GTM if consented
      if (consent === 'true' && typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'consent_given',
          consent_type: 'all'
        })
      }
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setHasConsented(true)
    setShowBanner(false)
    
    // Enable GTM
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'consent_given',
        consent_type: 'all'
      })
      // Reload to initialize GTM
      window.location.reload()
    }
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false')
    setHasConsented(false)
    setShowBanner(false)
    
    // Disable tracking
    if (typeof window !== 'undefined') {
      (window as any)['ga-disable-GA_MEASUREMENT_ID'] = true
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'consent_denied',
        consent_type: 'all'
      })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="w-6 h-6 text-purple-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                We use cookies to enhance your experience
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We use cookies and similar technologies to analyze site usage, 
                remember your preferences, and improve our services. This includes 
                Google Analytics to understand how you use our site.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
                >
                  Reject Non-Essential
                </button>
                <Link
                  href="/privacy"
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
            
            <button
              onClick={() => setShowBanner(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}