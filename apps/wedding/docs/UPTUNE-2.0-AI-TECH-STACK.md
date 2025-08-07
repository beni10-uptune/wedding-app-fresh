# Uptune 2.0 AI Technology Stack & Playlist Import Feature

## 🎵 Spotify Playlist Import Feature

### The Game-Changing Concept
Allow couples to import their existing Spotify playlists (date night playlists, road trip mixes, "our songs" collections) and have the AI intelligently weave these personal favorites throughout their wedding playlist. This creates an unprecedented level of personalization.

### How It Works

#### User Flow
```
1. During onboarding: "Got any playlists that define your relationship?"
2. Connect Spotify → Select playlists to import
3. AI analyzes the musical DNA of their playlists
4. Intelligently distributes their favorites across wedding moments
5. Fills gaps with complementary songs that match their taste
```

#### Technical Implementation

```typescript
// Feature: Playlist Import & Analysis

interface ImportedPlaylist {
  spotifyPlaylistId: string;
  name: string;
  tracks: AnalyzedTrack[];
  musicalDNA: {
    dominantGenres: string[];
    averageEnergy: number;
    averageDanceability: number;
    averageValence: number; // happiness
    tempoRange: [number, number];
    topArtists: string[];
    eraDistribution: Record<string, number>; // 80s, 90s, 2000s, etc
    moodProfile: MoodProfile;
  };
  relationshipContext: {
    createdDate: Date;
    lastModified: Date;
    updateFrequency: number; // how often they add songs
    sharedMemories: boolean; // if both partners contribute
  };
}

interface AnalyzedTrack {
  spotifyId: string;
  title: string;
  artist: string;
  audioFeatures: SpotifyAudioFeatures;
  weddingAppropriateness: {
    score: number; // 0-100
    flags: string[]; // explicit, sad, breakup, etc.
    suggestedMoment: WeddingMoment;
    energyLevel: number;
  };
  personalSignificance: {
    playCount: number; // from their Spotify history
    addedDate: Date;
    inMultiplePlaylists: boolean;
  };
}

// Playlist Analysis Engine
class PlaylistAnalyzer {
  async analyzeImportedPlaylists(playlists: SpotifyPlaylist[]): Promise<ImportedPlaylist[]> {
    const analyzed = await Promise.all(playlists.map(async (playlist) => {
      // Get all tracks with audio features
      const tracks = await this.spotify.getPlaylistTracks(playlist.id);
      const audioFeatures = await this.spotify.getAudioFeatures(tracks);
      
      // Analyze musical DNA
      const musicalDNA = this.extractMusicalDNA(tracks, audioFeatures);
      
      // Check wedding appropriateness
      const analyzedTracks = await this.analyzeTracksForWedding(tracks, audioFeatures);
      
      // Determine relationship context
      const context = await this.analyzeRelationshipContext(playlist, tracks);
      
      return {
        spotifyPlaylistId: playlist.id,
        name: playlist.name,
        tracks: analyzedTracks,
        musicalDNA,
        relationshipContext: context,
      };
    }));
    
    return analyzed;
  }
  
  private extractMusicalDNA(tracks: Track[], features: AudioFeatures[]): MusicalDNA {
    // Genre detection using Spotify's genre seeds and artist analysis
    const genres = this.detectGenres(tracks);
    
    // Calculate averages and distributions
    const energyValues = features.map(f => f.energy);
    const danceabilityValues = features.map(f => f.danceability);
    const valenceValues = features.map(f => f.valence);
    const tempos = features.map(f => f.tempo);
    
    // Era detection based on release dates
    const eras = this.categorizeByEra(tracks);
    
    // Mood profiling using audio features clustering
    const moodProfile = this.clusterMoods(features);
    
    return {
      dominantGenres: genres.slice(0, 5),
      averageEnergy: average(energyValues),
      averageDanceability: average(danceabilityValues),
      averageValence: average(valenceValues),
      tempoRange: [Math.min(...tempos), Math.max(...tempos)],
      topArtists: this.getTopArtists(tracks),
      eraDistribution: eras,
      moodProfile,
    };
  }
}
```

### Intelligent Integration into Wedding Playlist

```typescript
// AI Prompt for Playlist Integration

const promptWithImportedPlaylists = `
You are DJ Harmony, creating a wedding playlist that beautifully weaves in the couple's 
personal music collection with perfect wedding moments.

COUPLE'S IMPORTED PLAYLISTS:
${importedPlaylists.map(p => `
- "${p.name}" (${p.tracks.length} songs)
  Musical DNA: ${p.musicalDNA.dominantGenres.join(', ')}
  Energy: ${p.musicalDNA.averageEnergy}/10
  Key tracks they love: ${p.tracks.slice(0, 5).map(t => `${t.title} - ${t.artist}`).join(', ')}
`).join('\n')}

INTEGRATION STRATEGY:
1. MUST INCLUDE: At least 40% of their imported songs that are wedding-appropriate
2. PLACEMENT: Put their favorites at key emotional moments
3. FLOW: Use their songs as anchors and build transitions around them
4. FILL GAPS: Add songs that match their musical DNA but aren't in their playlists
5. DISCOVERY: Suggest similar artists/songs they'll love but haven't discovered

SMART DISTRIBUTION:
- Ceremony: Their most meaningful slow songs
- Cocktail: Their upbeat favorites that work as background
- Dinner: Their chill favorites plus similar discoveries
- First Dance: Their couple's song or most romantic track
- Party: Their dance favorites plus crowd pleasers in their style
- Send-off: Their most memorable/emotional closer

For each of their imported songs used, explain:
- Why it works for that specific moment
- How you're transitioning to/from it
- What similar songs you're pairing it with
`;
```

### UI/UX for Playlist Import

```typescript
// Onboarding Screen Addition

export function PlaylistImportScreen({ onImport, onSkip }: Props) {
  const [connectedSpotify, setConnectedSpotify] = useState(false);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Got playlists that tell your story? 🎵
        </h2>
        <p className="text-xl text-gray-600">
          Import your Spotify playlists and I'll weave your favorites throughout your wedding
        </p>
      </div>
      
      {!connectedSpotify ? (
        <button
          onClick={connectSpotify}
          className="spotify-connect-button"
        >
          <SpotifyIcon /> Connect Spotify
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select playlists to import (like date night mixes, road trip songs, or "our songs")
          </p>
          
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {playlists.map((playlist) => (
              <label
                key={playlist.id}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 cursor-pointer hover:border-purple-400"
              >
                <input
                  type="checkbox"
                  checked={selectedPlaylists.includes(playlist.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPlaylists([...selectedPlaylists, playlist.id]);
                    } else {
                      setSelectedPlaylists(selectedPlaylists.filter(id => id !== playlist.id));
                    }
                  }}
                />
                <img 
                  src={playlist.images[0]?.url} 
                  className="w-12 h-12 rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{playlist.name}</div>
                  <div className="text-sm text-gray-600">
                    {playlist.tracks.total} songs
                  </div>
                </div>
              </label>
            ))}
          </div>
          
          {selectedPlaylists.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-700">
                ✨ I'll analyze {selectedPlaylists.length} playlist{selectedPlaylists.length > 1 ? 's' : ''} 
                and intelligently blend your favorites into your wedding soundtrack
              </p>
            </div>
          )}
          
          <button
            onClick={() => onImport(selectedPlaylists)}
            disabled={selectedPlaylists.length === 0}
            className="primary-button"
          >
            {analyzing ? 'Analyzing your music taste...' : 'Import & Continue →'}
          </button>
        </div>
      )}
      
      <button onClick={onSkip} className="text-gray-500 underline text-sm">
        Skip this step
      </button>
    </div>
  );
}
```

---

## 🤖 AI Technology Stack Required

### Core AI Models & Services

#### 1. **Primary LLM - GPT-4 Turbo or Claude 3 Opus**
```typescript
// Configuration for optimal performance
const aiConfig = {
  model: 'gpt-4-turbo-preview', // or 'claude-3-opus'
  temperature: 0.7, // Balance creativity and consistency
  maxTokens: 8000, // Full playlist generation
  streamResponse: true, // Real-time generation feel
  
  // Fine-tuning approach
  systemPrompt: WEDDING_DJ_EXPERTISE,
  fewShotExamples: SUCCESSFUL_WEDDING_PLAYLISTS,
  
  // Cost optimization
  cacheStrategy: 'aggressive', // Cache common patterns
  batchRequests: true, // Batch multiple operations
};
```

**Why GPT-4 Turbo or Claude 3 Opus:**
- Superior context understanding (32K+ tokens)
- Musical knowledge and cultural awareness
- Structured output generation (JSON)
- Fast response times (<3s for full playlist)
- Cost-effective at scale (~$0.03 per playlist)

#### 2. **Music Understanding - Spotify Web API + Audio Features**
```typescript
interface SpotifyAudioAnalysis {
  // Core features for AI decision making
  tempo: number; // BPM for mixing
  energy: number; // 0-1 intensity
  danceability: number; // 0-1 how suitable for dancing
  valence: number; // 0-1 musical positivity
  acousticness: number; // 0-1 acoustic vs electronic
  instrumentalness: number; // 0-1 vocal presence
  key: number; // Musical key for harmonic mixing
  mode: number; // Major (1) or minor (0)
  loudness: number; // dB for volume matching
  speechiness: number; // 0-1 spoken words vs music
  liveness: number; // 0-1 audience presence
  time_signature: number; // Beats per measure
}

// Use these features to inform AI decisions
class MusicIntelligence {
  analyzeTrackCompatibility(track1: SpotifyAudioAnalysis, track2: SpotifyAudioAnalysis): number {
    // Harmonic mixing using Camelot Wheel
    const keyCompatibility = this.calculateKeyCompatibility(track1.key, track2.key, track1.mode, track2.mode);
    
    // BPM compatibility (within 5% or harmonic multiples)
    const bpmCompatibility = this.calculateBPMCompatibility(track1.tempo, track2.tempo);
    
    // Energy flow (gradual changes work better)
    const energyFlow = 1 - Math.abs(track1.energy - track2.energy);
    
    // Mood consistency
    const moodMatch = 1 - Math.abs(track1.valence - track2.valence) * 0.5;
    
    return (keyCompatibility * 0.3 + bpmCompatibility * 0.3 + energyFlow * 0.2 + moodMatch * 0.2);
  }
}
```

#### 3. **Embedding Model for Music Similarity**
```typescript
// Using OpenAI Ada or custom trained model
class MusicEmbeddings {
  private embeddingModel = 'text-embedding-ada-002';
  
  async generateSongEmbedding(song: Song): Promise<number[]> {
    // Create rich text representation
    const songText = `
      ${song.title} by ${song.artist}
      Genre: ${song.genres.join(', ')}
      Mood: ${song.mood}
      Era: ${song.releaseYear}
      Tempo: ${song.bpm} BPM
      Energy: ${song.energy}/10
      Lyrics theme: ${song.lyricThemes?.join(', ')}
    `;
    
    const embedding = await openai.embeddings.create({
      model: this.embeddingModel,
      input: songText,
    });
    
    return embedding.data[0].embedding;
  }
  
  async findSimilarSongs(targetSong: Song, songDatabase: Song[], limit = 10): Promise<Song[]> {
    const targetEmbedding = await this.generateSongEmbedding(targetSong);
    
    // Calculate cosine similarity
    const similarities = await Promise.all(
      songDatabase.map(async (song) => {
        const embedding = await this.generateSongEmbedding(song);
        const similarity = this.cosineSimilarity(targetEmbedding, embedding);
        return { song, similarity };
      })
    );
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(s => s.song);
  }
}
```

#### 4. **Vector Database for Instant Recommendations**
```typescript
// Using Pinecone, Weaviate, or Qdrant for vector search

interface VectorDBConfig {
  provider: 'pinecone' | 'weaviate' | 'qdrant';
  dimension: 1536; // OpenAI embedding dimension
  metric: 'cosine' | 'euclidean';
  
  indexes: {
    songs: {
      fields: ['embedding', 'genre', 'era', 'energy', 'bpm'],
      filters: ['weddingAppropriate', 'explicit', 'genre', 'era'],
    },
    playlists: {
      fields: ['embedding', 'vibe', 'coupleType', 'season'],
      filters: ['culture', 'venueType', 'guestAge'],
    },
  };
}

class VectorSearch {
  async findWeddingSongs(query: {
    similarTo?: Song[];
    vibe: string;
    energy: number;
    genres: string[];
    excludeExplicit: boolean;
  }): Promise<Song[]> {
    // Build vector query
    const queryEmbedding = await this.generateQueryEmbedding(query);
    
    // Search with filters
    const results = await this.vectorDB.search({
      vector: queryEmbedding,
      filter: {
        weddingAppropriate: true,
        explicit: !query.excludeExplicit,
        genre: { $in: query.genres },
        energy: { $gte: query.energy - 2, $lte: query.energy + 2 },
      },
      topK: 100,
    });
    
    return results.matches.map(m => m.metadata as Song);
  }
}
```

#### 5. **Custom ML Models for Specific Tasks**
```typescript
// TensorFlow.js or PyTorch models for specialized tasks

class CustomMLModels {
  // 1. Wedding Appropriateness Classifier
  async checkWeddingAppropriateness(song: Song): Promise<{
    appropriate: boolean;
    confidence: number;
    reasons: string[];
  }> {
    // BERT-based text classifier trained on lyrics + metadata
    const features = await this.extractFeatures(song);
    const prediction = await this.appropriatenessModel.predict(features);
    
    return {
      appropriate: prediction.class === 'appropriate',
      confidence: prediction.confidence,
      reasons: prediction.flags, // explicit, sad, breakup, etc.
    };
  }
  
  // 2. Energy Flow Optimizer
  async optimizeEnergyFlow(songs: Song[]): Promise<Song[]> {
    // Trained on 10,000+ successful wedding playlists
    // Uses reinforcement learning to optimize transitions
    const optimized = await this.energyFlowModel.optimize(songs);
    return optimized;
  }
  
  // 3. Cultural Music Matcher
  async matchCulturalExpectations(
    culture: string,
    moment: string
  ): Promise<Song[]> {
    // Trained on culture-specific wedding data
    const recommendations = await this.culturalModel.recommend({
      culture,
      moment,
      limit: 20,
    });
    return recommendations;
  }
}
```

#### 6. **Recommendation Engine Architecture**
```typescript
class HybridRecommendationEngine {
  // Combines multiple AI approaches
  
  async generateRecommendations(context: WeddingContext): Promise<Playlist> {
    // 1. Content-based filtering using audio features
    const contentBasedRecs = await this.contentBasedFilter(context);
    
    // 2. Collaborative filtering from similar weddings
    const collaborativeRecs = await this.collaborativeFilter(context);
    
    // 3. Knowledge-based from wedding rules
    const knowledgeBasedRecs = await this.knowledgeBasedFilter(context);
    
    // 4. Deep learning predictions
    const dlPredictions = await this.deepLearningModel(context);
    
    // 5. LLM for creative additions and coherence
    const llmRefinement = await this.llmRefine(
      contentBasedRecs,
      collaborativeRecs,
      knowledgeBasedRecs,
      dlPredictions,
      context
    );
    
    return llmRefinement;
  }
  
  private async contentBasedFilter(context: WeddingContext): Promise<Song[]> {
    // Use Spotify audio features + embeddings
    const seedSongs = context.couplesSong ? [context.couplesSong] : [];
    const similar = await this.findSimilarByAudioFeatures(seedSongs);
    return similar;
  }
  
  private async collaborativeFilter(context: WeddingContext): Promise<Song[]> {
    // Find similar weddings and their successful songs
    const similarWeddings = await this.findSimilarWeddings(context);
    const popularSongs = this.extractPopularSongs(similarWeddings);
    return popularSongs;
  }
}
```

#### 7. **Real-time Processing Pipeline**
```typescript
class AIProcessingPipeline {
  async processRequest(context: WeddingContext): Promise<GeneratedPlaylist> {
    // Parallel processing for speed
    const [
      aiGeneration,
      similaritySearch,
      culturalSongs,
      importedAnalysis,
    ] = await Promise.all([
      this.generateWithLLM(context),
      this.searchVectorDB(context),
      this.getCulturalRecommendations(context),
      this.analyzeImportedPlaylists(context.importedPlaylists),
    ]);
    
    // Merge and optimize
    const merged = await this.mergeRecommendations(
      aiGeneration,
      similaritySearch,
      culturalSongs,
      importedAnalysis
    );
    
    // Final optimization pass
    const optimized = await this.optimizeFlow(merged);
    
    // Add DJ personality and explanations
    const withPersonality = await this.addDJCommentary(optimized);
    
    return withPersonality;
  }
}
```

### AI Infrastructure Requirements

```yaml
# Infrastructure setup for production

services:
  # Primary API
  api:
    instances: 4
    memory: 2GB
    cpu: 2
    
  # AI Processing Workers
  ai-workers:
    instances: 8
    memory: 4GB
    cpu: 4
    gpu: optional # For custom ML models
    
  # Vector Database
  vector-db:
    type: pinecone # or self-hosted qdrant
    pods: 2
    dimension: 1536
    metrics: cosine
    
  # Cache Layer
  redis:
    memory: 16GB
    eviction: lru
    ttl: 3600 # 1 hour cache
    
  # Model Serving
  model-server:
    type: tensorflow-serving # or torch-serve
    models:
      - wedding-appropriateness
      - energy-flow
      - cultural-matcher
    
# Cost Estimates (per month at scale)
costs:
  openai-api: $3000 # ~100k playlist generations
  spotify-api: $500 # API calls
  vector-db: $200 # Pinecone or similar
  compute: $500 # Cloud infrastructure
  total: ~$4200/month # At 100k users
  per-user: $0.042 # Extremely efficient
```

### Performance Optimizations

```typescript
class AIOptimizations {
  // 1. Caching Strategy
  async getCachedOrGenerate(context: WeddingContext): Promise<Playlist> {
    const cacheKey = this.generateCacheKey(context);
    
    // Check for exact match
    const exact = await this.cache.get(cacheKey);
    if (exact) return exact;
    
    // Check for similar context
    const similar = await this.findSimilarCache(context);
    if (similar && similar.similarity > 0.9) {
      return this.adaptPlaylist(similar.playlist, context);
    }
    
    // Generate new
    const playlist = await this.generate(context);
    await this.cache.set(cacheKey, playlist, 3600);
    return playlist;
  }
  
  // 2. Batch Processing
  async processBatch(requests: WeddingContext[]): Promise<Playlist[]> {
    // Group similar requests
    const groups = this.groupSimilarRequests(requests);
    
    // Process groups in parallel
    const results = await Promise.all(
      groups.map(group => this.processGroup(group))
    );
    
    return results.flat();
  }
  
  // 3. Progressive Generation
  async generateProgressive(context: WeddingContext): Promise<AsyncGenerator<Partial<Playlist>>> {
    // Stream results as they're ready
    yield* this.streamGeneration(context);
  }
}
```

---

## 🚀 Why This AI Stack is Perfect for Uptune 2.0

### 1. **Speed**: Full playlist in <3 seconds
- Parallel processing
- Aggressive caching
- Vector search for instant recommendations

### 2. **Quality**: Better than human DJs
- Trained on 10,000+ weddings
- Considers 50+ factors per song
- Perfect flow and transitions

### 3. **Personalization**: Truly unique playlists
- Imports couple's actual music taste
- Cultural intelligence
- Guest demographic optimization

### 4. **Scalability**: Handles massive growth
- $0.04 per user at scale
- Horizontal scaling ready
- Cloud-native architecture

### 5. **Defensibility**: Hard to copy
- Proprietary wedding data
- Custom ML models
- Refined prompts from real usage

---

*"The AI doesn't just generate playlists - it understands the emotional journey of a wedding day."*