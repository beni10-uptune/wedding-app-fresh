-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Wedding Music Knowledge Base
CREATE TABLE IF NOT EXISTS wedding_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'moment', 'genre', 'technique', 'culture', 'tips'
  subcategory TEXT, -- specific moment/genre/culture
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Expertise data
  bpm_range INT[], -- [min, max]
  energy_level INT, -- 1-10
  best_time TEXT, -- when to use this
  duration TEXT, -- how long this typically lasts
  
  -- Rich metadata
  key_points JSONB, -- bullet points of key information
  pro_tips JSONB, -- array of professional tips
  avoid_list JSONB, -- things to avoid
  transitions JSONB, -- how to transition in/out
  cultural_notes JSONB, -- culture-specific information
  technical_specs JSONB, -- technical requirements
  
  -- AI/Search (without vector for now - will add separately)
  keywords TEXT[], -- for traditional search
  related_songs TEXT[], -- song IDs that relate to this knowledge
  
  -- Tracking
  usefulness_score FLOAT DEFAULT 0, -- how helpful this has been
  times_referenced INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast retrieval
CREATE INDEX idx_knowledge_category ON wedding_knowledge(category);
CREATE INDEX idx_knowledge_subcategory ON wedding_knowledge(subcategory);
CREATE INDEX idx_knowledge_keywords ON wedding_knowledge USING GIN(keywords);

-- BPM and Energy Progression Rules
CREATE TABLE IF NOT EXISTS bpm_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase TEXT NOT NULL, -- 'ceremony', 'cocktail', 'dinner', etc.
  time_range TEXT, -- '7:00 PM - 8:00 PM'
  sequence_order INT, -- order in the day
  
  -- Musical parameters
  bpm_min INT NOT NULL,
  bpm_max INT NOT NULL,
  energy_level INT NOT NULL, -- 1-10
  
  -- Mixing guidance
  mixing_technique TEXT,
  transition_style TEXT,
  
  -- Psychology
  crowd_psychology TEXT,
  goals TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Harmonic Mixing Rules (Camelot Wheel)
CREATE TABLE IF NOT EXISTS harmonic_mixing (
  camelot_code TEXT PRIMARY KEY, -- '1A', '1B', etc.
  musical_key TEXT, -- 'Ab minor', 'B major'
  compatible_keys TEXT[], -- ['12A', '1A', '2A', '1B']
  
  -- Mixing guidance
  energy_change TEXT, -- 'boost', 'maintain', 'reduce'
  mood_shift TEXT, -- 'darker', 'brighter', 'neutral'
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Song Success Metrics
CREATE TABLE IF NOT EXISTS song_success_metrics (
  song_id TEXT PRIMARY KEY, -- Spotify ID
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  
  -- Success metrics
  success_rate FLOAT, -- 0-1 success rate on dance floor
  best_moment TEXT, -- optimal moment to play
  energy_impact INT, -- -5 to +5 energy change
  
  -- Usage stats
  times_played INT DEFAULT 0,
  times_requested INT DEFAULT 0,
  times_skipped INT DEFAULT 0,
  average_rating FLOAT,
  
  -- Crowd response
  age_groups_loved JSONB, -- {young: 0.9, middle: 0.7, older: 0.5}
  works_well_after TEXT[], -- song IDs that this follows well
  works_well_before TEXT[], -- song IDs that follow this well
  
  -- Notes
  pro_notes TEXT,
  warnings TEXT,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Interaction History (for learning)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  user_id UUID,
  
  -- Query and response
  user_query TEXT NOT NULL,
  query_intent TEXT, -- detected intent
  ai_response TEXT NOT NULL,
  
  -- What was suggested
  songs_suggested JSONB, -- array of song IDs
  knowledge_used TEXT[], -- knowledge IDs referenced
  
  -- User feedback
  songs_accepted JSONB, -- songs they actually used
  songs_rejected JSONB, -- songs they explicitly rejected
  feedback_score INT, -- 1-5 rating
  feedback_text TEXT,
  
  -- Context
  wedding_context JSONB, -- snapshot of wedding preferences
  moment_context TEXT, -- what moment they were planning
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wedding Preference Learning
CREATE TABLE IF NOT EXISTS wedding_preferences_learned (
  wedding_id UUID PRIMARY KEY REFERENCES weddings(id) ON DELETE CASCADE,
  
  -- Learned preferences
  preferred_genres JSONB, -- {pop: 0.8, rock: 0.6, country: 0.2}
  preferred_eras JSONB, -- {2020s: 0.7, 2010s: 0.5, 2000s: 0.8}
  energy_preference FLOAT, -- 0-1 (low to high energy preference)
  explicit_ok BOOLEAN DEFAULT FALSE,
  
  -- Specific insights
  loved_songs TEXT[], -- songs they definitely want
  banned_songs TEXT[], -- songs they definitely don't want
  loved_artists TEXT[],
  banned_artists TEXT[],
  
  -- Patterns detected
  prefers_familiar BOOLEAN, -- classics vs. deep cuts
  cultural_preferences JSONB,
  age_group_focus TEXT, -- 'younger', 'older', 'mixed'
  
  -- Stats
  total_interactions INT DEFAULT 0,
  last_interaction TIMESTAMP,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quick lookup for common queries
CREATE TABLE IF NOT EXISTS common_query_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_pattern TEXT NOT NULL, -- normalized query pattern
  query_hash TEXT UNIQUE, -- hash for exact match
  
  -- Cached response
  response JSONB NOT NULL,
  songs JSONB,
  knowledge_ids TEXT[],
  
  -- Usage
  times_used INT DEFAULT 1,
  last_used TIMESTAMP DEFAULT NOW(),
  avg_satisfaction FLOAT,
  
  -- TTL
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create view for most successful songs
CREATE OR REPLACE VIEW top_wedding_songs AS
SELECT 
  s.song_id,
  s.title,
  s.artist,
  s.success_rate,
  s.best_moment,
  s.times_played,
  s.average_rating
FROM song_success_metrics s
WHERE s.success_rate > 0.8
ORDER BY s.success_rate DESC, s.times_played DESC;

-- Create view for learned preferences summary
CREATE OR REPLACE VIEW wedding_taste_profile AS
SELECT 
  w.wedding_id,
  w.preferred_genres,
  w.preferred_eras,
  w.energy_preference,
  w.cultural_preferences,
  array_length(w.loved_songs, 1) as loved_songs_count,
  array_length(w.banned_songs, 1) as banned_songs_count,
  w.last_interaction
FROM wedding_preferences_learned w;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_updated_at
  BEFORE UPDATE ON wedding_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_metrics_updated_at
  BEFORE UPDATE ON song_success_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON wedding_preferences_learned
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();