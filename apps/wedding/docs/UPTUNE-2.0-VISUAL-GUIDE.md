# UpTune 2.0 Visual Design Guide

## Design Principles

### Core Aesthetic: "Elegant Magic"
- **Clean & Modern**: Lots of whitespace, minimal UI
- **Magical Moments**: Subtle animations, particle effects
- **Trust & Premium**: Feels like a $10k service for $29
- **Celebration**: Joyful colors, wedding-appropriate

### Color Palette:
```css
--primary-gradient: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
--dark-bg: #0F0F1E;
--card-bg: rgba(255, 255, 255, 0.05);
--gold-accent: #FCD34D;
--success-green: #10B981;
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.7);
```

---

## Key Screens Design

### 1. Landing Page Hero
```
┌─────────────────────────────────────────────┐
│                                             │
│         ✨ Your AI Wedding DJ ✨            │
│                                             │
│   Creates your perfect playlist in 60       │
│              seconds flat                   │
│                                             │
│     [▶️ Watch Magic Happen] (video)         │
│                                             │
│        [Create My Playlist Free]            │
│         ⬇️ No credit card required           │
│                                             │
│  ⭐⭐⭐⭐⭐ 10,000+ happy couples             │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. Onboarding - Question 1
```
┌─────────────────────────────────────────────┐
│ ←  UpTune                          1 of 5   │
├─────────────────────────────────────────────┤
│                                             │
│     👋 Hi! I'm your AI Wedding DJ          │
│                                             │
│     First, when's the big day?              │
│                                             │
│     ┌─────────────────────────┐            │
│     │ 📅 June 15, 2024        │            │
│     └─────────────────────────┘            │
│                                             │
│     Where's it happening?                   │
│                                             │
│  [🏛️ Indoor]  [🌳 Outdoor]  [🏖️ Beach]      │
│                                             │
│     How many guests?                        │
│                                             │
│   [<50]  [50-150]  [150-300]  [300+]      │
│                                             │
│              [Continue →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. Onboarding - Vibe Selection
```
┌─────────────────────────────────────────────┐
│ ←  UpTune                          3 of 5   │
├─────────────────────────────────────────────┤
│                                             │
│        What's your wedding vibe?            │
│                                             │
│  ┌─────────────┐ ┌─────────────┐          │
│  │ Classic &   │ │ Modern &    │          │
│  │ Elegant ✨  │ │ Fun 🎉      │          │
│  │             │ │             │          │
│  │ Timeless    │ │ Current hits│          │
│  │ Sophisticated│ │ High energy │          │
│  └─────────────┘ └─────────────┘          │
│                                             │
│  ┌─────────────┐ ┌─────────────┐          │
│  │ Rustic &    │ │ Cultural    │          │
│  │ Relaxed 🌿  │ │ Fusion 🌍   │          │
│  │             │ │             │          │
│  │ Laid-back   │ │ Mixed       │          │
│  │ Natural     │ │ traditions  │          │
│  └─────────────┘ └─────────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

### 4. AI Generation Screen
```
┌─────────────────────────────────────────────┐
│                                             │
│          ✨ 🎵 ✨ 🎵 ✨                    │
│                                             │
│      Your AI DJ is creating magic...        │
│                                             │
│    ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  75%                 │
│                                             │
│    ✓ Analyzed your outdoor venue            │
│    ✓ Selected music for mixed ages          │
│    ✓ Added cultural touches                 │
│    ⚡ Optimizing energy flow...             │
│                                             │
│         Just a few more seconds...          │
│                                             │
│          💜 ✨ 🎵 ✨ 💜                    │
│                                             │
└─────────────────────────────────────────────┘
```

### 5. The Reveal - Playlist Dashboard
```
┌─────────────────────────────────────────────┐
│ ✨ Your Perfect Wedding Soundtrack Ready!    │
├─────────────────────────────────────────────┤
│                                             │
│  8 hours • 127 songs • Perfectly crafted   │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ |▬▬|▬▬▬▬|▬▬▬▬▬▬|▬▬▬▬▬▬▬▬|▬|▬▬▬▬▬▬|▬| │ │
│ │  Pre  Cer  Cocktail  Dinner  D  Party  L │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 💒 Ceremony (20 min)                        │
│ ┌─────────────────────────────────────────┐ │
│ │ 🎵 A Thousand Years - Christina Perri   │ │
│ │    Perfect processional, romantic tempo  │ │
│ │                                         │ │
│ │ 🎵 Canon in D - Pachelbel              │ │
│ │    Classic choice your guests expect    │ │
│ │                              [See all 5]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 🥂 Cocktail Hour (60 min)                   │
│ ┌─────────────────────────────────────────┐ │
│ │ 🎵 Golden - Harry Styles               │ │
│ │    Upbeat, modern, sets happy tone     │ │
│ │                              [See all 18]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [💬 Chat with AI DJ] [📤 Export to Spotify] │
│                                             │
│  🎁 Unlock all features for just £29        │
│                                             │
└─────────────────────────────────────────────┘
```

### 6. AI DJ Chat Interface
```
┌─────────────────────────────────────────────┐
│ 💬 Your AI DJ                        ✕      │
├─────────────────────────────────────────────┤
│                                             │
│ AI DJ: I've created your perfect playlist! │
│        Want to make any changes?           │
│                                             │
│        Quick suggestions:                   │
│        • Make dinner music jazzier 🎷       │
│        • Add more 90s hits 📻              │
│        • More Taylor Swift 🎤              │
│        • Increase party energy ⚡          │
│                                             │
│ You: Add some Bollywood for the Indian     │
│      side of the family                     │
│                                             │
│ AI DJ: Great idea! I'll add a 20-minute    │
│        Bollywood dance set during peak      │
│        party time. I'm including crowd      │
│        favorites like "Jai Ho" and          │
│        "Chaiyya Chaiyya". Want me to        │
│        add any specific songs?              │
│                                             │
│        ✨ Updating your playlist...         │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Type a message...              [Send]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### 7. Guest Request Portal
```
┌─────────────────────────────────────────────┐
│            Emma & James's Wedding           │
│              June 15, 2024                  │
├─────────────────────────────────────────────┤
│                                             │
│    Help us build the perfect playlist! 🎵   │
│                                             │
│      Choose up to 3 songs you'd love        │
│         to hear on our big day:             │
│                                             │
│  Based on their style, you might like:      │
│                                             │
│  ┌─────────────────────────────┐           │
│  │ 🎵 Mr. Brightside           │ [+]       │
│  │    The Killers              │           │
│  └─────────────────────────────┘           │
│                                             │
│  ┌─────────────────────────────┐           │
│  │ 🎵 September                │ [+]       │
│  │    Earth, Wind & Fire       │           │
│  └─────────────────────────────┘           │
│                                             │
│  Or search for a specific song:             │
│  ┌─────────────────────────────┐           │
│  │ 🔍 Search...                │           │
│  └─────────────────────────────┘           │
│                                             │
│  Your selections (2/3):                     │
│  ✓ Dancing Queen - ABBA                    │
│  ✓ Uptown Funk - Bruno Mars               │
│                                             │
│         [Submit My Requests]                │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Micro-Interactions & Animations

### 1. Question Transitions
```css
/* Smooth slide between questions */
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

### 2. AI Generation Effects
```javascript
// Particle effects during generation
const particles = {
  emoji: ['✨', '🎵', '💜', '🎶'],
  float: true,
  fadeIn: 500ms,
  fadeOut: 1000ms
}
```

### 3. Playlist Reveal
```css
/* Stagger animation for songs */
.song-card {
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}
.song-card:nth-child(1) { animation-delay: 0.1s; }
.song-card:nth-child(2) { animation-delay: 0.2s; }
/* etc... */
```

### 4. Energy Visualization
```javascript
// Animated energy graph
const energyFlow = {
  ceremony: 2,
  cocktail: 6,
  dinner: 4,
  firstDance: 3,
  party: 9,
  lastDance: 5
}
// Smooth bezier curves between points
```

### 5. Success States
```css
/* Celebration animation on completion */
@keyframes celebrate {
  0% { transform: scale(0) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}
```

---

## Mobile-First Responsive Design

### Mobile (375px)
```
┌─────────────────┐
│   AI Wedding    │
│      DJ         │
│                 │
│ [Create Free]   │
│                 │
│ ⭐⭐⭐⭐⭐ 10k+    │
└─────────────────┘
```

### Tablet (768px)
```
┌───────────────────────────┐
│     AI Wedding DJ         │
│ Perfect playlist in 60s   │
│                          │
│ [Video] [Create Free]    │
│                          │
│ ⭐⭐⭐⭐⭐ 10,000+ couples   │
└───────────────────────────┘
```

### Desktop (1280px+)
```
┌─────────────────────────────────────────────┐
│           Your AI Wedding DJ                │
│   Creates perfect playlist in 60 seconds    │
│                                             │
│   [Video Preview]    [Create My Playlist]   │
│                                             │
│   ⭐⭐⭐⭐⭐ Loved by 10,000+ couples          │
│   As featured in: [logos]                   │
└─────────────────────────────────────────────┘
```

---

## Component Library

### Buttons
```jsx
// Primary CTA
<button className="bg-gradient-to-r from-purple-600 to-pink-600 
                   text-white px-8 py-4 rounded-full font-bold 
                   text-lg shadow-xl hover:shadow-2xl transform 
                   hover:scale-105 transition-all">
  Create My Playlist Free
</button>

// Secondary
<button className="border border-purple-400 text-purple-400 
                   px-6 py-3 rounded-full hover:bg-purple-400 
                   hover:text-white transition-all">
  Learn More
</button>
```

### Cards
```jsx
// Song Card
<div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 
                border border-white/10 hover:border-purple-400 
                transition-all group">
  <div className="flex items-center gap-3">
    <div className="text-2xl">🎵</div>
    <div>
      <h4 className="font-semibold text-white">Song Title</h4>
      <p className="text-white/60 text-sm">Artist Name</p>
    </div>
  </div>
  <p className="text-white/40 text-xs mt-2">
    Why chosen: Perfect tempo for processional
  </p>
</div>
```

### Input Fields
```jsx
// Glassmorphism inputs
<input className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 
                  text-white placeholder-white/50 border border-white/20 
                  focus:border-purple-400 focus:outline-none transition-all"
       placeholder="Your wedding date..." />
```

---

## Loading States

### Skeleton Screens
```jsx
// While loading playlist
<div className="animate-pulse">
  <div className="h-8 bg-white/10 rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-white/10 rounded w-1/2 mb-8"></div>
  
  <div className="space-y-3">
    <div className="h-20 bg-white/10 rounded"></div>
    <div className="h-20 bg-white/10 rounded"></div>
    <div className="h-20 bg-white/10 rounded"></div>
  </div>
</div>
```

### Progress Indicators
```jsx
// AI Generation progress
<div className="relative">
  <div className="h-2 bg-white/10 rounded-full">
    <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 
                    rounded-full transition-all duration-500"
         style={{width: `${progress}%`}}></div>
  </div>
  <div className="mt-2 text-center text-white/60 text-sm">
    {currentStep}...
  </div>
</div>
```

---

## Emotional Design Moments

### 1. The "Wow" Reveal
- Confetti animation
- Songs fade in sequentially  
- Celebration sounds (optional)
- Share buttons appear

### 2. Personal Touches
- "We noticed you're having an outdoor wedding..."
- "Added some Irish classics for your family"
- "Included clean versions for young guests"

### 3. Trust Builders
- Real couple testimonials
- "DJ-approved" badges
- Security/privacy badges
- Money-back guarantee

### 4. Delight Details
- Hover effects on everything
- Smooth transitions
- Easter eggs (konami code?)
- Celebratory micro-animations

---

## Design Do's and Don'ts

### ✅ DO:
- Keep it magical and delightful
- Use lots of whitespace
- Make CTAs impossible to miss
- Show progress clearly
- Celebrate successes

### ❌ DON'T:
- Overwhelm with options
- Use wedding clichés (no Comic Sans!)
- Hide the value prop
- Make forms feel long
- Forget mobile users

---

The design should feel like a premium wedding service that happens to be powered by AI, not a tech tool trying to do weddings. Every interaction should spark joy and build trust.