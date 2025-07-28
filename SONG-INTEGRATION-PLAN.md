# Wedding Song Integration Plan 🎵

## Phase 1: Enhanced Data Collection (Week 1)
### Fetch Additional Spotify Data
- [ ] Popularity scores for ranking
- [ ] Release dates for generational filtering  
- [ ] Artist genres for better categorization
- [ ] Audio features (if API permits):
  - Tempo/BPM for processional timing
  - Energy levels for moment matching
  - Danceability for party songs

### Update Import Script
```typescript
// Add to import script:
- track.popularity
- track.album.release_date
- artist.genres (separate API call)
- track.audio_features (if available)
```

## Phase 2: Smart Categorization (Week 1-2)
### Improve Moment Assignment
- Use tempo for processionals (60-80 BPM)
- Use energy for dance floor (>0.7)
- Use acousticness for dinner (>0.5)
- Use release date for generational appeal

### Create Curated Collections
```typescript
const collections = {
  "Modern Romance": songs.filter(s => s.year > 2020 && s.valence > 0.6),
  "Timeless Classics": songs.filter(s => s.popularity > 70 && s.year < 2000),
  "Indie Wedding": songs.filter(s => s.genres.includes('indie')),
  "Country Wedding": songs.filter(s => s.genres.includes('country')),
  // etc
}
```

## Phase 3: UI/UX Enhancements (Week 2-3)

### A. Song Discovery Page
```typescript
interface SongFilters {
  era: Decade[]
  energy: Range<0,1>
  popularity: Range<0,100>
  genres: string[]
  explicit: boolean
  searchQuery: string
}
```

### B. Song Card Component
- Album artwork
- 30-second preview player
- Popularity indicator
- "Add to moment" quick action
- "Why this song?" AI tooltip

### C. Moment Builder Enhancement
- Drag & drop between moments
- Tempo/BPM display
- Energy flow visualization
- Auto-suggestions based on current selections

## Phase 4: Intelligent Recommendations (Week 3-4)

### A. Recommendation Engine
```typescript
function getRecommendations(wedding: Wedding) {
  return {
    basedOnVenue: getVenueMoodSongs(wedding.venueType),
    basedOnAge: getGenerationalHits(wedding.coupleAge),
    basedOnCurrent: getSimilarSongs(wedding.currentSongs),
    trending: getTrendingWeddingSongs(wedding.date),
    regional: getRegionalFavorites(wedding.location)
  }
}
```

### B. Contextual Suggestions
- "Your processional is 45 seconds, try these songs"
- "Add some 80s hits for the parents"
- "Energy dip detected - add a crowd pleaser"
- "Missing: Last dance song"

## Phase 5: Blog Integration (Week 4)

### Dynamic Blog Content
- Auto-generate "Top 10" lists from real data
- Create seasonal playlists
- Regional wedding music guides
- Generation-specific recommendations

### SEO-Optimized Templates
```markdown
# Top [N] [Moment] Songs for [Location] Weddings [Year]
Based on [X] real weddings, these are the most popular...
```

## Phase 6: Analytics & Learning (Ongoing)

### Track Usage Metrics
- Which songs get added vs removed
- Play count at actual weddings
- Guest feedback ratings
- Skip rates
- Regional preferences

### Feedback Loop
```typescript
// After each wedding
- Collect DJ feedback
- Track actual play data
- Guest song ratings
- Update popularity scores
```

## Quick Wins to Implement Now

1. **Better Search** - Include album in search
2. **Sort by Popularity** - Add to UI
3. **Era Filtering** - Use release dates
4. **Preview Player** - Add play buttons
5. **Curated Playlists** - Create 5-10 collections

## Success Metrics
- Song discovery time: <2 min per moment
- Songs per wedding: 40-60
- User satisfaction: >90%
- Blog traffic: +50% from song content
- Conversion rate: +20% from better UX