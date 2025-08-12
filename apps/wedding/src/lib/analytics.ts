/**
 * Analytics and Conversion Tracking
 * 
 * Centralized analytics for tracking user behavior and conversions
 */

type EventName = 
  // Funnel events
  | 'page_view'
  | 'builder_opened'
  | 'timeline_populated'
  | 'song_added'
  | 'song_removed'
  | 'first_export_attempt'
  | 'upgrade_prompt_shown'
  | 'upgrade_prompt_clicked'
  | 'checkout_started'
  | 'checkout_completed'
  | 'payment_succeeded'
  
  // Feature usage
  | 'spotify_auth_started'
  | 'spotify_auth_completed'
  | 'playlist_exported'
  | 'guest_invited'
  | 'coowner_added'
  | 'ai_suggest_used'
  | 'pdf_downloaded'
  
  // Engagement
  | 'guide_opened'
  | 'tutorial_started'
  | 'tutorial_completed'
  | 'welcome_flow_completed'
  | 'share_clicked'
  
  // Lead generation
  | 'email_captured'
  | 'email_capture_skipped'
  
  // Errors
  | 'export_failed'
  | 'payment_failed'
  | 'spotify_auth_failed'

interface EventProperties {
  // Common properties
  wedding_id?: string
  user_id?: string
  tier?: 'free' | 'paid'
  
  // Page properties
  page_path?: string
  page_title?: string
  referrer?: string
  
  // Conversion properties
  trigger?: string
  product?: string
  price?: number
  currency?: string
  
  // Feature properties
  moment_id?: string
  song_count?: number
  guest_count?: number
  
  // Error properties
  error_message?: string
  error_code?: string
  
  // Custom properties
  [key: string]: any
}

class Analytics {
  private gtag: any
  private userId: string | null = null
  private sessionId: string
  
  constructor() {
    // Generate session ID
    this.sessionId = this.generateSessionId()
    
    // Initialize gtag if available
    if (typeof window !== 'undefined') {
      this.gtag = (window as any).gtag
    }
  }
  
  /**
   * Set the user ID for all subsequent events
   */
  setUserId(userId: string | null) {
    this.userId = userId
    
    if (this.gtag && userId) {
      this.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        user_id: userId
      })
    }
  }
  
  /**
   * Track an event
   */
  track(eventName: EventName, properties?: EventProperties) {
    const eventData = {
      ...properties,
      user_id: this.userId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    }
    
    // Send to Google Analytics
    if (this.gtag) {
      this.gtag('event', eventName, eventData)
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, eventData)
    }
    
    // Store critical events in localStorage for recovery
    if (this.isCriticalEvent(eventName)) {
      this.storeCriticalEvent(eventName, eventData)
    }
  }
  
  /**
   * Track page view
   */
  pageView(path?: string, title?: string) {
    this.track('page_view', {
      page_path: path || window.location.pathname,
      page_title: title || document.title,
      referrer: document.referrer
    })
  }
  
  /**
   * Track conversion funnel
   */
  trackFunnel(step: string, properties?: EventProperties) {
    const funnelEvents: Record<string, EventName> = {
      'builder_open': 'builder_opened',
      'populate': 'timeline_populated',
      'add_song': 'song_added',
      'export_attempt': 'first_export_attempt',
      'upgrade_shown': 'upgrade_prompt_shown',
      'upgrade_click': 'upgrade_prompt_clicked',
      'checkout_start': 'checkout_started',
      'checkout_complete': 'checkout_completed'
    }
    
    const eventName = funnelEvents[step]
    if (eventName) {
      this.track(eventName, properties)
    }
  }
  
  /**
   * Track revenue event
   */
  trackRevenue(amount: number, currency: string, product: string) {
    this.track('payment_succeeded', {
      price: amount,
      currency,
      product
    })
    
    // Also send purchase event for Google Ads
    if (this.gtag) {
      this.gtag('event', 'purchase', {
        value: amount,
        currency: currency,
        transaction_id: this.generateTransactionId(),
        items: [{
          item_id: product,
          item_name: product,
          price: amount,
          quantity: 1
        }]
      })
    }
  }
  
  /**
   * Helper methods
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private isCriticalEvent(eventName: EventName): boolean {
    const criticalEvents: EventName[] = [
      'checkout_started',
      'checkout_completed',
      'payment_succeeded',
      'payment_failed'
    ]
    return criticalEvents.includes(eventName)
  }
  
  private storeCriticalEvent(eventName: EventName, data: any) {
    try {
      const events = JSON.parse(localStorage.getItem('critical_events') || '[]')
      events.push({ event: eventName, data, timestamp: Date.now() })
      
      // Keep only last 50 events
      if (events.length > 50) {
        events.shift()
      }
      
      localStorage.setItem('critical_events', JSON.stringify(events))
    } catch (error) {
      console.error('Failed to store critical event:', error)
    }
  }
  
  /**
   * Recover and send stored critical events
   */
  recoverCriticalEvents() {
    try {
      const events = JSON.parse(localStorage.getItem('critical_events') || '[]')
      events.forEach((event: any) => {
        if (this.gtag) {
          this.gtag('event', event.event, event.data)
        }
      })
      
      // Clear after sending
      localStorage.removeItem('critical_events')
    } catch (error) {
      console.error('Failed to recover critical events:', error)
    }
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Export for use in components
export const trackEvent = analytics.track.bind(analytics)
export const trackPageView = analytics.pageView.bind(analytics)
export const trackFunnel = analytics.trackFunnel.bind(analytics)
export const trackRevenue = analytics.trackRevenue.bind(analytics)
export const setUserId = analytics.setUserId.bind(analytics)