# UpTune Wedding App Style Guide
## Transforming to Dark Glassmorphic Design

This guide transforms the existing wedding app from a light theme to match the sophisticated dark glassmorphic aesthetic of uptune.xyz while maintaining wedding-specific context and branding.

## 🎨 Design Philosophy

**Core Principles:**
- Dark, sophisticated backgrounds with gradient overlays
- Glass morphism effects (backdrop-blur + transparency)
- Purple-to-pink gradient accents for wedding romance
- Subtle animations and hover effects
- White text with gradient highlights
- Floating, ethereal UI elements

---

## 🌈 Color Palette

### Background Colors
```css
/* Primary Backgrounds */
.bg-slate-900      /* #0f172a - Primary dark */
.bg-purple-900     /* #581c87 - Deep purple */
.bg-slate-800      /* #1e293b - Secondary dark */

/* Gradient Backgrounds */
.bg-gradient-to-br.from-slate-900.via-purple-900.to-slate-900
.bg-gradient-to-r.from-purple-600.to-pink-600
.bg-gradient-to-r.from-purple-400.to-pink-400
```

### Text Colors
```css
/* Primary Text */
.text-white        /* Main content */
.text-white/80     /* Secondary content */
.text-white/60     /* Tertiary content */

/* Gradient Text */
.bg-gradient-to-r.from-purple-400.to-pink-400.bg-clip-text.text-transparent
```

### Glass Effects
```css
/* Transparency Levels */
.bg-white/10       /* Light glass effect */
.bg-white/20       /* Medium glass effect */
.bg-white/5        /* Subtle glass effect */

/* Borders */
.border-white/20   /* Glass borders */
.border-white/10   /* Subtle borders */
```

---

## 🎯 Component Library

### 1. Buttons

#### Primary Button (Uptune Style)
```jsx
<button className="inline-flex items-center justify-center gap-2 px-8 py-4 
                   font-semibold text-white rounded-md transition-all
                   bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-700 hover:to-pink-700
                   hover:shadow-xl hover:scale-105">
  Get Started
</button>
```

#### Glass Button
```jsx
<button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 
                   backdrop-blur-lg transition-all px-8 py-4 rounded-md font-semibold">
  Learn More
</button>
```

### 2. Cards

#### Glass Card
```jsx
<div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-6
                hover:bg-white/20 transition-all duration-300">
  {/* Card content */}
</div>
```

#### Feature Card
```jsx
<div className="rounded-2xl p-6 cursor-pointer group hover:scale-105 
                transition-all duration-300 backdrop-blur-lg
                bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                border border-white/10">
  {/* Feature content */}
</div>
```

### 3. Navigation

#### Header (Dark Theme)
```jsx
<header className="relative z-10 px-4 py-6 bg-white/5 backdrop-blur-lg border-b border-white/10">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Logo with dark theme */}
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
        <Music className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white">UpTune</h1>
        <p className="text-sm text-purple-400 font-medium">for Weddings</p>
      </div>
    </div>
    {/* Navigation items in white */}
  </div>
</header>
```

### 4. Status Indicators

#### Live Activity Badge
```jsx
<div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                bg-green-500/20 text-green-300 border border-green-500/30">
  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
  Live Activity
</div>
```

### 5. Statistics/Metrics

#### Stats Grid
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="text-center">
    <div className="text-2xl font-bold text-white mb-1">127</div>
    <div className="text-xs text-white/60">Active Weddings</div>
  </div>
  {/* More stats */}
</div>
```

---

## 🎬 Layout Patterns

### 1. Main Container with Animated Background
```jsx
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
  {/* Animated Background Orbs */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full 
                    bg-gradient-to-br from-purple-600/20 to-pink-600/20 
                    opacity-30 animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full 
                    bg-gradient-to-br from-blue-600/20 to-purple-600/20 
                    opacity-30 animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-96 h-96 rounded-full bg-gradient-to-br from-pink-600/10 to-purple-600/10 
                    opacity-20 animate-spin" style={{animationDuration: '20s'}}></div>
  </div>
  
  {/* Content */}
  <main className="relative z-10">
    {/* Your content here */}
  </main>
</div>
```

### 2. Hero Section
```jsx
<section className="relative px-4 py-20 overflow-hidden">
  <div className="max-w-7xl mx-auto text-center relative z-10">
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="inline-flex items-center rounded-full border text-xs font-semibold 
                      bg-white/10 text-white border-white/20 px-4 py-2 backdrop-blur-lg">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        Made with Love for Music
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
        Where Music 
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Brings Weddings Together
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed">
        Share your musical souls. Create playlists that tell your love story, discover what moves your guests, and celebrate the soundtrack of your perfect day.
      </p>
    </div>
  </div>
</section>
```

---

## ✨ Animation & Interaction Patterns

### Hover Effects
```css
.hover\:scale-105:hover { transform: scale(1.05); }
.transition-all { transition: all 0.3s ease; }
.hover\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
```

### Loading States
```jsx
<div className="animate-pulse">
  {/* Pulsing content */}
</div>

<div className="animate-spin">
  {/* Spinning loader */}
</div>
```

---

## 🎵 Wedding-Specific Components

### 1. Musical Moment Card
```jsx
<div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                backdrop-blur-sm border border-white/10 rounded-lg p-6">
  <div className="flex items-center gap-2 mb-4">
    <Music className="w-5 h-5 text-purple-400" />
    <span className="text-white font-medium">Ceremony Processional</span>
  </div>
  <div className="text-white/80 text-sm mb-4">
    The perfect songs for walking down the aisle
  </div>
  {/* Song list or controls */}
</div>
```

### 2. Guest Collaboration Card
```jsx
<div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-6">
  <div className="flex items-center gap-2 mb-4">
    <Users className="w-5 h-5 text-pink-400" />
    <span className="text-white font-medium">Guest Suggestions</span>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
  </div>
  <div className="text-white/80 text-sm">
    Your guests are actively suggesting songs for your special day
  </div>
</div>
```

### 3. Playlist Export Card
```jsx
<div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 
                backdrop-blur-lg rounded-xl p-6 border border-emerald-400/20">
  <div className="flex items-center gap-4 mb-4">
    <Download className="w-8 h-8 text-emerald-400" />
    <div>
      <h3 className="text-xl font-bold text-white">Export for DJ</h3>
      <p className="text-emerald-200">Professional Format</p>
    </div>
  </div>
  <p className="text-white/80 mb-6">
    Export your curated playlists in DJ-ready formats with timing notes and special instructions.
  </p>
  <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 
                     text-white hover:from-emerald-700 hover:to-teal-700 
                     py-2 px-4 rounded-md font-medium transition-all">
    Export Playlists
  </button>
</div>
```

---

## 📱 Responsive Considerations

### Mobile Adaptations
- Reduce backdrop-blur on mobile for performance
- Simplify animations
- Larger touch targets
- Stack cards vertically

```jsx
// Example responsive glass card
<div className="bg-white/10 backdrop-blur-sm md:backdrop-blur-lg 
                border border-white/10 rounded-lg p-4 md:p-6
                hover:bg-white/20 transition-all duration-300">
```

---

## 🎯 Implementation Priority

### Phase 1: Core Layout
1. Update main background with animated orbs
2. Convert navigation to dark theme
3. Transform hero section
4. Update button styles

### Phase 2: Components
1. Convert all cards to glass style
2. Update typography colors
3. Add status badges and indicators
4. Implement hover effects

### Phase 3: Wedding Features
1. Style music-specific components
2. Add collaboration indicators
3. Create export interfaces
4. Polish animations

---

## 🔧 CSS Utilities to Add

Add these custom utility classes to your globals.css:

```css
/* Uptune Wedding Theme Utilities */
@layer utilities {
  /* Glass morphism */
  .glass-light { @apply bg-white/10 backdrop-blur-sm border border-white/10; }
  .glass-medium { @apply bg-white/20 backdrop-blur-md border border-white/20; }
  .glass-strong { @apply bg-white/30 backdrop-blur-lg border border-white/30; }
  
  /* Gradient text */
  .gradient-text-purple-pink { 
    @apply bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent; 
  }
  
  /* Wedding-specific gradients */
  .bg-wedding-glass { @apply bg-gradient-to-r from-purple-500/10 to-pink-500/10; }
  .bg-ceremony-glass { @apply bg-gradient-to-r from-blue-600/20 to-cyan-600/20; }
  .bg-reception-glass { @apply bg-gradient-to-r from-emerald-600/20 to-teal-600/20; }
  .bg-music-glass { @apply bg-gradient-to-r from-amber-600/20 to-orange-600/20; }
  
  /* Animations */
  .animate-orb { 
    animation: pulse 2s ease-in-out infinite alternate; 
  }
  .animate-slow-spin { 
    animation: spin 20s linear infinite; 
  }
  
  /* Hover effects */
  .hover-lift { @apply hover:scale-105 hover:shadow-xl transition-all duration-300; }
  .hover-glow { @apply hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300; }
}
```

---

## 🎨 Brand Consistency

### Wedding Context Preservation
- Keep romantic language and wedding-specific terminology
- Maintain elegant typography (serif fonts for headings)
- Preserve pink/purple color scheme but in darker context
- Keep wedding-specific icons and imagery

### UpTune Aesthetic Integration
- Dark backgrounds with subtle gradients
- Glass morphism effects throughout
- Sophisticated hover animations
- Professional status indicators
- Live activity elements

---

This style guide provides everything needed to transform your wedding app into a sophisticated, dark-themed experience that matches UpTune's aesthetic while maintaining the romantic, wedding-focused content and functionality. 

## 💳 Stripe Integration & Multi-Currency Support

### Environment Variables Setup
Your `.env.local` file now includes:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRODUCT_ID=prod_SdbU63HfCXsuv2

# Multi-Currency Configuration
NEXT_PUBLIC_STRIPE_PRICE_GBP=2500  # £25.00
NEXT_PUBLIC_STRIPE_PRICE_USD=2500  # $25.00
NEXT_PUBLIC_STRIPE_PRICE_EUR=2500  # €25.00
```

### Currency Selection Component
```jsx
'use client'
import { useState } from 'react'

const CurrencySelector = ({ onCurrencyChange }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('GBP')
  
  const currencies = [
    { code: 'GBP', symbol: '£', price: 2500, display: '£25.00' },
    { code: 'USD', symbol: '$', price: 2500, display: '$25.00' },
    { code: 'EUR', symbol: '€', price: 2500, display: '€25.00' }
  ]

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency.code)
    onCurrencyChange(currency)
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
      <h3 className="text-white font-medium mb-3">Choose Your Currency</h3>
      <div className="grid grid-cols-3 gap-2">
        {currencies.map((currency) => (
          <button
            key={currency.code}
            onClick={() => handleCurrencyChange(currency)}
            className={`p-3 rounded-md transition-all ${
              selectedCurrency === currency.code
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/20'
            }`}
          >
            <div className="font-semibold">{currency.symbol}{currency.display.slice(1)}</div>
            <div className="text-xs opacity-75">{currency.code}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Pricing Display Component
```jsx
const PricingCard = ({ currency = 'GBP' }) => {
  const prices = {
    GBP: { amount: '£25.00', cents: 2500 },
    USD: { amount: '$25.00', cents: 2500 },
    EUR: { amount: '€25.00', cents: 2500 }
  }

  const currentPrice = prices[currency]

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <span className="text-purple-400 font-semibold text-lg">Perfect for Every Wedding</span>
        </div>
        <div className="text-6xl md:text-7xl font-bold text-white mb-4 text-center">
          {currentPrice.amount}
        </div>
        <p className="text-xl text-white/80 mb-8 text-center">per wedding, one-time payment</p>
        
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 
                           text-white hover:from-purple-700 hover:to-pink-700 
                           py-4 px-8 rounded-md font-semibold text-xl transition-all
                           hover:shadow-xl hover:scale-105">
          Start Your Musical Journey
        </button>
        
        <p className="text-white/60 mt-4 text-center">
          30-day money-back guarantee • Secure payment via Stripe
        </p>
      </div>
    </div>
  )
}
```

### Stripe Checkout Implementation
```typescript
// utils/stripe.ts
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const createCheckoutSession = async (currency: string, userEmail?: string) => {
  const prices = {
    GBP: process.env.NEXT_PUBLIC_STRIPE_PRICE_GBP,
    USD: process.env.NEXT_PUBLIC_STRIPE_PRICE_USD,
    EUR: process.env.NEXT_PUBLIC_STRIPE_PRICE_EUR
  }

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: process.env.STRIPE_PRODUCT_ID,
      currency: currency.toLowerCase(),
      price: prices[currency as keyof typeof prices],
      customerEmail: userEmail
    }),
  })

  const session = await response.json()
  
  const stripe = await stripePromise
  const { error } = await stripe!.redirectToCheckout({
    sessionId: session.id,
  })

  if (error) {
    console.error('Stripe checkout error:', error)
  }
}
```

### API Route for Checkout
```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { currency, price, customerEmail } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product: process.env.STRIPE_PRODUCT_ID,
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/`,
      customer_email: customerEmail,
      metadata: {
        product: 'wedding_music_app',
        currency: currency,
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### Usage in Components
```jsx
// Client-side (components, pages)
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const productId = process.env.STRIPE_PRODUCT_ID;

// Server-side only (API routes)
const secretKey = process.env.STRIPE_SECRET_KEY;
```

### Geographic Currency Detection
```typescript
// utils/currency.ts
export const detectUserCurrency = (): string => {
  // Try to detect from browser locale
  const locale = navigator.language || 'en-GB'
  
  if (locale.includes('US')) return 'USD'
  if (locale.includes('GB') || locale.includes('UK')) return 'GBP'
  if (locale.includes('EU') || locale.includes('DE') || locale.includes('FR') || locale.includes('IT') || locale.includes('ES')) return 'EUR'
  
  // Default to GBP for wedding app
  return 'GBP'
}

// You can also use a geolocation service
export const getCurrencyByIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    const countryToCurrency: { [key: string]: string } = {
      'US': 'USD',
      'GB': 'GBP',
      'UK': 'GBP',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'NL': 'EUR',
      // Add more as needed
    }
    
    return countryToCurrency[data.country_code] || 'GBP'
  } catch {
    return 'GBP' // Default fallback
  }
}
```

--- 