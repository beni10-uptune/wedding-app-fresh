'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

interface GoogleTagManagerProps {
  gtmId: string
}

export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize GTM
  useEffect(() => {
    if (!gtmId) return

    // Check for cookie consent
    const consent = localStorage.getItem('cookieConsent')
    if (consent !== 'true') {
      console.log('GTM initialization blocked - no cookie consent')
      return
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    
    // GTM script
    const script = document.createElement('script')
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `
    document.head.appendChild(script)

    // GTM noscript iframe
    const noscript = document.createElement('noscript')
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.appendChild(noscript)
  }, [gtmId])

  // Track page views
  useEffect(() => {
    if (!window.dataLayer) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    window.dataLayer.push({
      event: 'pageview',
      page: {
        url,
        title: document.title,
        path: pathname,
      },
    })
  }, [pathname, searchParams])

  return null
}

// Helper function to push events to dataLayer
export function pushToDataLayer(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    // Check consent before pushing events
    const consent = localStorage.getItem('cookieConsent')
    if (consent === 'true') {
      window.dataLayer.push({
        event,
        ...data,
      })
    }
  }
}

// Common GTM events for wedding app
export const GTMEvents = {
  // User Events
  signUp: (method: string) => pushToDataLayer('sign_up', { method }),
  login: (method: string) => pushToDataLayer('login', { method }),
  logout: () => pushToDataLayer('logout'),

  // Wedding Events
  createWedding: (weddingId: string) => pushToDataLayer('create_wedding', { wedding_id: weddingId }),
  inviteGuest: (count: number) => pushToDataLayer('invite_guest', { guest_count: count }),
  inviteCoOwner: () => pushToDataLayer('invite_co_owner'),

  // Music Events
  searchSong: (query: string) => pushToDataLayer('search_song', { search_term: query }),
  addSong: (songTitle: string, moment: string) => pushToDataLayer('add_song', { 
    song_title: songTitle,
    wedding_moment: moment 
  }),
  removeSong: (songTitle: string, moment: string) => pushToDataLayer('remove_song', { 
    song_title: songTitle,
    wedding_moment: moment 
  }),
  exportPlaylist: (platform: string) => pushToDataLayer('export_playlist', { platform }),

  // Payment Events
  beginCheckout: (price: number) => pushToDataLayer('begin_checkout', { 
    value: price / 100, // Convert from pence to pounds
    currency: 'GBP',
    items: [{
      item_name: 'UpTune Wedding Music Platform',
      price: price / 100,
      quantity: 1
    }]
  }),
  purchase: (weddingId: string, price: number) => pushToDataLayer('purchase', {
    transaction_id: weddingId,
    value: price / 100,
    currency: 'GBP',
    items: [{
      item_name: 'UpTune Wedding Music Platform',
      price: price / 100,
      quantity: 1
    }]
  }),
  refund: (weddingId: string, amount: number) => pushToDataLayer('refund', {
    transaction_id: weddingId,
    value: amount / 100,
    currency: 'GBP'
  }),

  // Blog Events
  readArticle: (title: string, category: string) => pushToDataLayer('read_article', {
    content_type: 'blog',
    article_title: title,
    article_category: category
  }),
  newsletterSignup: (source: string) => pushToDataLayer('newsletter_signup', { source }),

  // Feature Usage
  useFeature: (featureName: string) => pushToDataLayer('feature_use', { feature_name: featureName }),
  tutorialComplete: (tutorialName: string) => pushToDataLayer('tutorial_complete', { tutorial_name: tutorialName }),
}