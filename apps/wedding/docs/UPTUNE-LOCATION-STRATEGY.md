# Uptune Location Strategy: Production-Ready Architecture

## 🎯 The Recommended Approach: Hybrid Smart Detection

### Best Solution: Single Domain + Smart Detection + Manual Override

```
weddings.uptune.xyz (single domain)
         ↓
Auto-detect location (IP + browser)
         ↓
Show regional content automatically
         ↓
Allow manual override (visible selector)
```

**URL Structure:**
- `weddings.uptune.xyz` - Main domain (auto-detects)
- `weddings.uptune.xyz?region=uk-north` - Override via params
- `/blog/uk/manchester-wedding-songs` - Regional blog content
- `/blog/us/texas-wedding-traditions` - US regional content

---

## 🌍 Why NOT Separate Domains/Subdomains

### ❌ Problems with uptune.co.uk, uptune.com approach:
- **Cost**: Multiple domains ($15-50 each/year)
- **Maintenance**: Multiple deployments
- **SEO**: Split domain authority
- **Complexity**: SSL certs, DNS, redirects
- **User confusion**: Which site to visit?

### ❌ Problems with uk.weddings.uptune.xyz approach:
- **SEO**: Subdomains treated as separate sites
- **Sharing**: Links break across regions
- **Maintenance**: Multiple deployments
- **Analytics**: Fragmented data

---

## ✅ The Production-Ready Architecture

### 1. Auto-Detection Layer

```typescript
// middleware.ts (Next.js Edge Function)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check for manual override
  const overrideRegion = request.cookies.get('region')?.value;
  if (overrideRegion) {
    return NextResponse.next({
      headers: { 'x-user-region': overrideRegion }
    });
  }

  // 2. Auto-detect from IP
  const country = request.geo?.country || 'US';
  const region = request.geo?.region || '';
  
  // 3. Map to music regions (not just countries)
  const musicRegion = getMusicRegion(country, region);
  
  // 4. Set header for use in app
  return NextResponse.next({
    headers: { 'x-user-region': musicRegion }
  });
}

function getMusicRegion(country: string, region: string): string {
  // Music regions don't match political boundaries
  const mapping = {
    'GB': {
      'ENG-North': 'uk-north', // Manchester, Liverpool, Leeds
      'ENG-London': 'uk-london',
      'SCT': 'uk-scotland',
      'WLS': 'uk-wales',
    },
    'US': {
      'TX': 'us-texas', // Texas is its own thing
      'CA': 'us-west-coast',
      'NY': 'us-northeast',
      'TN': 'us-south', // Nashville country
    },
    'IE': 'ireland',
    'AU': 'australia',
    'CA': 'canada',
  };
  
  return mapping[country]?.[region] || `${country.toLowerCase()}-general`;
}
```

### 2. UI Implementation

```typescript
// components/RegionalContent.tsx
export function RegionalContent() {
  const detectedRegion = useDetectedRegion(); // from headers
  const [selectedRegion, setSelectedRegion] = useState(detectedRegion);
  
  return (
    <>
      {/* Subtle region selector in header */}
      <div className="text-sm text-gray-600">
        Music for: 
        <button 
          onClick={() => setShowRegionModal(true)}
          className="underline ml-1"
        >
          {getRegionName(selectedRegion)} 🌍
        </button>
      </div>
      
      {/* Content changes based on region */}
      <WeddingPlaylist region={selectedRegion} />
    </>
  );
}
```

### 3. Regional Music Database

```typescript
// data/regional-music.ts
export const REGIONAL_MUSIC = {
  'uk-north': {
    essentials: ['Wonderwall', 'Mr. Brightside', 'Chelsea Dagger'],
    avoid: ['Sweet Home Alabama', 'Country Roads'],
    genres: ['indie', 'rock', 'manchester'],
    cultural: ['ceilidh', 'northern-soul'],
    pricePoint: '£39',
    currency: 'GBP',
  },
  'uk-london': {
    essentials: ['Waterloo Sunset', 'Blue Monday'],
    genres: ['grime', 'garage', 'indie', 'jazz'],
    pricePoint: '£49', // Higher for London
    currency: 'GBP',
  },
  'us-texas': {
    essentials: ['Friends in Low Places', 'Boot Scootin\' Boogie'],
    genres: ['country', 'tejano', 'red-dirt'],
    cultural: ['two-step', 'line-dance'],
    pricePoint: '$49',
    currency: 'USD',
  },
  'us-northeast': {
    essentials: ['Sweet Caroline', 'Living on a Prayer'],
    genres: ['rock', 'pop', 'hip-hop'],
    pricePoint: '$49',
    currency: 'USD',
  },
};
```

---

## 📍 Smart Region Detection Flow

### Initial Visit:
```
User lands on weddings.uptune.xyz
         ↓
Detect: IP shows Manchester, UK
         ↓
Show: UK-North playlist template
         ↓
Display: "🌍 Showing Manchester favorites"
         ↓
Option: "Not in Manchester? [Change location]"
```

### Benefits:
- **Instant relevance** - They see local music immediately
- **No friction** - No questions before value
- **Easy override** - Wrong? One click to fix
- **Remembers choice** - Cookie saves preference

---

## 💰 Pricing & Currency Localization

### Dynamic Pricing by Region:

```typescript
const REGIONAL_PRICING = {
  'uk-*': { 
    price: 39, 
    currency: 'GBP', 
    symbol: '£',
    comparison: 'vs £1,500 UK DJ'
  },
  'us-*': { 
    price: 49, 
    currency: 'USD', 
    symbol: '$',
    comparison: 'vs $2,000 US DJ'
  },
  'au-*': { 
    price: 69, 
    currency: 'AUD', 
    symbol: '$',
    comparison: 'vs $2,500 Aussie DJ'
  },
  'eu-*': { 
    price: 45, 
    currency: 'EUR', 
    symbol: '€',
    comparison: 'vs €1,800 EU DJ'
  },
};

// Stripe automatically handles currency conversion
const checkout = await stripe.checkout.sessions.create({
  price_data: {
    currency: REGIONAL_PRICING[region].currency,
    unit_amount: REGIONAL_PRICING[region].price * 100,
  },
  // Stripe adjusts payment methods by country
});
```

---

## 📝 Content & SEO Strategy

### Blog Structure:
```
/blog/
  /uk/
    /manchester-wedding-songs
    /london-wedding-venues-music
    /scottish-ceilidh-playlist
  /us/
    /texas-country-wedding-songs
    /nyc-wedding-dj-alternatives
    /california-beach-wedding-music
  /guides/
    /indian-wedding-music-guide
    /jewish-wedding-traditions
    /caribbean-wedding-playlist
```

### SEO Benefits:
- **Single domain authority** - All links build one site
- **Regional content** - `/blog/uk/` ranks in UK
- **Hreflang tags** - Tell Google about regional versions
- **Local keywords** - "Manchester wedding DJ" in UK content

### Implementation:
```html
<!-- Hreflang tags for regional SEO -->
<link rel="alternate" hreflang="en-GB" href="https://weddings.uptune.xyz?region=uk" />
<link rel="alternate" hreflang="en-US" href="https://weddings.uptune.xyz?region=us" />
<link rel="alternate" hreflang="x-default" href="https://weddings.uptune.xyz" />
```

---

## 🚀 Technical Implementation

### 1. Edge Detection (Fast):
```typescript
// Runs at edge, no latency
export const config = {
  matcher: '/',
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add region to headers for client
  response.headers.set(
    'x-user-region',
    detectRegion(request)
  );
  
  return response;
}
```

### 2. Client Hydration:
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  const region = headers().get('x-user-region') || 'us-general';
  
  return (
    <html>
      <body>
        <RegionProvider initialRegion={region}>
          {children}
        </RegionProvider>
      </body>
    </html>
  );
}
```

### 3. API Routes:
```typescript
// app/api/playlist/route.ts
export async function POST(request: Request) {
  const { region, preferences } = await request.json();
  
  // Generate playlist with regional music
  const playlist = await generatePlaylist({
    ...preferences,
    regionalMusic: REGIONAL_MUSIC[region],
  });
  
  return Response.json(playlist);
}
```

---

## 📊 Analytics & Tracking

### Unified Analytics:
```javascript
// Single GA4 property with regional segments
gtag('event', 'generate_playlist', {
  region: 'uk-north',
  detected_region: 'uk-north',
  override: false,
});

// Segment users by region in GA4
// Create audiences: UK Users, US Users, etc.
```

### Benefits:
- **Single dashboard** - All metrics in one place
- **Regional comparison** - UK vs US conversion rates
- **User flows** - See if people change regions
- **Unified reporting** - Total revenue across regions

---

## 🎯 Migration Path

### Phase 1: Detection Only (Week 1)
- Add IP detection
- Show detected region
- Log but don't change content

### Phase 2: Soft Launch (Week 2)
- 10% of users see regional content
- A/B test conversion impact
- Gather feedback

### Phase 3: Full Launch (Week 3)
- All users get regional content
- Manual override available
- Monitor metrics

### Phase 4: Optimization (Ongoing)
- Refine regional boundaries
- Add more granular regions
- Optimize music selections

---

## ✅ Why This Architecture Wins

### For Users:
- **Instant relevance** - See their music immediately
- **No confusion** - Single site to remember
- **Easy sharing** - Links work globally
- **Fair pricing** - Regional pricing parity

### For Business:
- **Lower costs** - Single domain, deployment
- **Better SEO** - Unified domain authority  
- **Simpler ops** - One codebase
- **Clear analytics** - Everything in one place

### For Development:
- **Single codebase** - Easy to maintain
- **Feature parity** - All regions get updates
- **Simple testing** - Override region with param
- **Fast iteration** - Deploy once globally

---

## 🚨 Critical Decisions

### Use Detection For:
- Initial playlist template
- Currency/pricing
- Default music genres
- Cultural moments
- Blog content shown

### Always Let Users:
- Override detection
- See other regions
- Share across regions
- Access all features

### Never:
- Lock users to regions
- Hide content based on location
- Require VPN to access
- Create separate accounts per region

---

## 💡 The Bottom Line

**One site, smart detection, user control.**

`weddings.uptune.xyz` that knows you're in Manchester, shows Manchester music, prices in pounds, but lets you change it if wrong.

Simple. Scalable. User-friendly.

---

*"Build once, serve globally, personalize locally."*