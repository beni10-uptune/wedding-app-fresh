# US/UK Wedding Song Database Expansion Plan 🎵

## Current Status
- ~150-200 songs total
- Mostly generic/universal songs
- Limited regional specificity

## Target: 2,000+ High-Quality Wedding Songs

### Phase 1: Spotify Import (Week 1)
**Goal**: Import 1,000+ verified wedding songs

1. **Run the import script** with these playlists:
   ```bash
   npm run import-songs
   ```

2. **Expected yield**:
   - UK: ~300 songs
   - US: ~400 songs  
   - Europe: ~200 songs
   - Universal: ~200 songs

### Phase 2: Manual Curation (Week 2)
**Goal**: Add 500+ must-have songs with metadata

#### UK Must-Haves:
```typescript
// Classic British Wedding Songs
{
  id: 'spotify:track:xxx',
  title: "Angels",
  artist: "Robbie Williams",
  popularIn: ['uk'],
  weddingMoments: ['first-dance', 'last-dance'],
  yearPeak: 1997,
  stillPopular: true
}

// Modern UK Favorites
- Ed Sheeran: "Perfect", "Thinking Out Loud"
- Adele: "Make You Feel My Love"
- Ellie Goulding: "How Long Will I Love You"
- Coldplay: "Yellow", "Fix You"
- One Direction: "Little Things"
```

#### US Must-Haves:
```typescript
// American Classics
{
  id: 'spotify:track:xxx',
  title: "At Last",
  artist: "Etta James",
  popularIn: ['us'],
  weddingMoments: ['first-dance'],
  yearPeak: 1960,
  stillPopular: true
}

// Modern US Favorites
- John Legend: "All of Me"
- Bruno Mars: "Marry You"
- Train: "Marry Me"
- Christina Perri: "A Thousand Years"
- Jason Mraz: "I'm Yours"

// Country (US South)
- Dan + Shay: "Speechless"
- Blake Shelton: "God Gave Me You"
- Tim McGraw: "It's Your Love"
```

### Phase 3: Genre Diversity (Week 3)
**Goal**: Ensure coverage across all demographics

#### By Generation:
- **Boomers**: Motown, Classic Rock, Standards
- **Gen X**: 80s/90s hits, Soft Rock
- **Millennials**: 2000s Pop, Indie
- **Gen Z**: Current hits, TikTok viral

#### By Genre (US/UK Focus):
```typescript
const GENRE_TARGETS = {
  pop: 400,        // Mainstream appeal
  rock: 200,       // Classic & modern
  country: 150,    // US essential
  soul_rnb: 150,   // Universal appeal
  indie: 100,      // UK/hipster weddings
  electronic: 100, // Modern weddings
  jazz: 100,       // Sophisticated events
  folk: 50,        // Intimate weddings
  classical: 50    // Traditional ceremonies
}
```

### Phase 4: Data Enrichment (Week 4)
**Goal**: Add intelligence to each song

```typescript
interface EnrichedSong extends Song {
  // Regional popularity
  popularityByRegion: {
    uk: number    // 0-100
    us: number    // 0-100
    europe: number // 0-100
  }
  
  // Wedding-specific data
  weddingStats: {
    timesUsedCeremony: number
    timesUsedFirstDance: number
    timesUsedParty: number
    avgGuestRating: number
  }
  
  // Cultural fit
  culturalTags: string[] // ['british-classic', 'us-country', 'euro-dance']
  
  // DJ notes
  djTips?: string // "Great for getting grandparents dancing"
}
```

## Data Sources

### 1. **Spotify Playlists** (Automated)
- Search: "wedding songs UK 2024"
- Search: "wedding songs US 2024"
- DJ-curated playlists
- Venue playlists

### 2. **Wedding Websites** (Manual research)
- The Knot (US): Top 200 wedding songs
- Hitched (UK): British wedding playlist
- WeddingWire: Regional favorites
- BBC Music: UK wedding classics

### 3. **DJ Databases**
- DJ Intelligence: Song popularity by region
- WeddingDJ.com: Most requested songs
- Local DJ associations

### 4. **Streaming Charts**
- Spotify Wedding Hub data
- Apple Music wedding playlists
- YouTube wedding song views

## Quick Win: Top 100 Essential Songs

### UK Top 50
1. Ed Sheeran - Perfect
2. Elton John - Your Song  
3. Ellie Goulding - How Long Will I Love You
4. The Beatles - Here Comes the Sun
5. Adele - Make You Feel My Love
[... continue list]

### US Top 50
1. John Legend - All of Me
2. Ed Sheeran - Thinking Out Loud
3. Bruno Mars - Marry You
4. Etta James - At Last
5. Elvis Presley - Can't Help Falling in Love
[... continue list]

## Implementation Steps

1. **This Week**: 
   - Run Spotify import script
   - Manually add top 100 US/UK songs
   - Fix placeholder IDs in existing data

2. **Next Week**:
   - Add genre diversity
   - Include cultural tags
   - Add DJ tips for popular songs

3. **Ongoing**:
   - Track which songs users actually add
   - Build recommendation engine
   - Create "trending in your area" feature

## Success Metrics
- 2,000+ total songs
- 90% with real Spotify IDs
- Regional coverage: 40% US, 40% UK, 20% Europe
- All major genres represented
- Every wedding moment covered