-- =====================================================
-- Uptune Platform - Multi-App Database Schema
-- =====================================================
-- This schema supports the entire Uptune ecosystem:
-- - Weddings (weddings.uptune.xyz)
-- - Main Platform (uptune.xyz)
-- - Funerals (funerals.uptune.xyz)
-- - Events, Games, Social features, etc.
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI similarity search later

-- =====================================================
-- CORE SHARED TABLES (Used by all Uptune apps)
-- =====================================================

-- User profiles (shared across all apps)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  username TEXT UNIQUE, -- For social features
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- External connections
  spotify_connected BOOLEAN DEFAULT false,
  spotify_user_id TEXT,
  spotify_refresh_token TEXT,
  apple_music_connected BOOLEAN DEFAULT false,
  
  -- Platform settings
  privacy_settings JSONB DEFAULT '{"profile_public": false, "playlists_public": false}',
  notification_settings JSONB DEFAULT '{}',
  
  -- Subscription (platform-wide)
  stripe_customer_id TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, pro, business
  subscription_status TEXT DEFAULT 'active',
  
  -- Stats
  total_playlists INT DEFAULT 0,
  total_followers INT DEFAULT 0,
  total_following INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track which apps each user has used
CREATE TABLE IF NOT EXISTS public.user_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL, -- 'wedding', 'funeral', 'uptune', 'events'
  first_accessed TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  app_settings JSONB DEFAULT '{}',
  usage_count INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(user_id, app_name)
);

-- Master songs table (shared by ALL apps)
CREATE TABLE IF NOT EXISTS public.songs (
  id TEXT PRIMARY KEY, -- Spotify track ID
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  album_art TEXT,
  preview_url TEXT,
  spotify_uri TEXT NOT NULL,
  apple_music_id TEXT,
  youtube_id TEXT,
  
  -- Musical properties
  duration INT, -- in seconds
  energy INT CHECK (energy BETWEEN 1 AND 5),
  bpm INT,
  key TEXT, -- Musical key
  mode TEXT, -- Major/Minor
  valence DECIMAL(3,2), -- happiness 0-1
  danceability DECIMAL(3,2), -- 0-1
  acousticness DECIMAL(3,2), -- 0-1
  instrumentalness DECIMAL(3,2), -- 0-1
  speechiness DECIMAL(3,2), -- 0-1
  loudness DECIMAL(4,1), -- in dB
  
  -- Categorization (universal)
  genres TEXT[], -- ['pop', 'rock', 'jazz']
  moods TEXT[], -- ['happy', 'romantic', 'energetic', 'melancholic']
  contexts TEXT[], -- ['wedding', 'funeral', 'party', 'workout']
  tags TEXT[], -- User-generated tags
  
  -- Metadata
  explicit BOOLEAN DEFAULT false,
  popularity INT DEFAULT 50, -- 0-100
  release_date DATE,
  added_by UUID REFERENCES public.profiles(id),
  
  -- Platform stats
  play_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  playlist_count INT DEFAULT 0,
  
  -- External data
  spotify_data JSONB,
  audio_features JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlists (can be created from any app)
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  
  -- Origin and type
  source_app TEXT NOT NULL, -- 'wedding', 'funeral', 'uptune', etc.
  source_id TEXT, -- Reference to wedding_id, funeral_id, etc.
  playlist_type TEXT, -- 'wedding_timeline', 'memorial', 'party', 'personal'
  
  -- Privacy and sharing
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  share_code TEXT UNIQUE,
  
  -- Stats
  song_count INT DEFAULT 0,
  total_duration INT DEFAULT 0, -- in seconds
  play_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  
  -- Platform integration
  spotify_playlist_id TEXT,
  apple_music_playlist_id TEXT,
  
  -- Metadata
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlist songs (junction table)
CREATE TABLE IF NOT EXISTS public.playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id TEXT REFERENCES public.songs(id) ON DELETE CASCADE,
  
  -- Order and organization
  position INT NOT NULL,
  added_by UUID REFERENCES public.profiles(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Optional metadata
  custom_note TEXT, -- Personal notes about why this song
  custom_timing TEXT, -- For event-specific timing
  
  UNIQUE(playlist_id, position),
  UNIQUE(playlist_id, song_id)
);

-- Social connections
CREATE TABLE IF NOT EXISTS public.social_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  followed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Activity feed (cross-app activities)
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Activity details
  app_name TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'playlist_created', 'wedding_shared', 'song_liked'
  title TEXT NOT NULL,
  description TEXT,
  
  -- References
  reference_type TEXT, -- 'playlist', 'wedding', 'song'
  reference_id TEXT,
  
  -- Privacy
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WEDDING APP SPECIFIC TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.wedding_weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  -- Couple information
  couple_names TEXT NOT NULL,
  partner1_name TEXT,
  partner2_name TEXT,
  partner1_email TEXT,
  partner2_email TEXT,
  
  -- Wedding details
  wedding_date DATE,
  venue_name TEXT,
  venue_address TEXT,
  venue_type TEXT,
  guest_count INT,
  ceremony_time TIME,
  reception_time TIME,
  
  -- Ownership
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  co_owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  planner_id UUID REFERENCES public.profiles(id),
  
  -- Access codes
  co_owner_code TEXT UNIQUE,
  vendor_code TEXT UNIQUE,
  guest_code TEXT UNIQUE,
  
  -- Customization
  theme JSONB DEFAULT '{"primary_color": "#8B5CF6", "secondary_color": "#EC4899", "font": "elegant"}',
  
  -- Features & Settings
  settings JSONB DEFAULT '{
    "allow_guest_submissions": true,
    "require_song_approval": false,
    "explicit_filter": false,
    "max_songs_per_guest": 5
  }',
  
  -- Music preferences
  music_preferences JSONB DEFAULT '{
    "genres": [],
    "excluded_genres": [],
    "energy_range": [2, 5],
    "no_explicit": false,
    "special_songs": []
  }',
  
  -- Payment (wedding-specific tier)
  payment_tier TEXT DEFAULT 'free', -- free, starter, professional, ultimate
  payment_status TEXT DEFAULT 'active',
  stripe_subscription_id TEXT,
  
  -- Associated playlist
  main_playlist_id UUID REFERENCES public.playlists(id),
  
  -- Stats
  total_songs INT DEFAULT 0,
  guest_submissions INT DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'planning', -- planning, upcoming, completed, archived
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wedding timeline (moments and songs)
CREATE TABLE IF NOT EXISTS public.wedding_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.wedding_weddings(id) ON DELETE CASCADE,
  
  -- Moment details
  moment_id TEXT NOT NULL, -- 'ceremony', 'cocktails', 'first-dance', etc.
  moment_name TEXT NOT NULL,
  moment_order INT NOT NULL,
  start_time TIME,
  duration INT, -- in minutes
  
  -- Song assignments
  song_ids TEXT[], -- Array of song IDs for this moment
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(wedding_id, moment_id)
);

-- Guest song submissions
CREATE TABLE IF NOT EXISTS public.wedding_guest_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.wedding_weddings(id) ON DELETE CASCADE,
  
  -- Guest info
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  table_number TEXT,
  
  -- Song details
  song_id TEXT REFERENCES public.songs(id),
  song_title TEXT NOT NULL, -- Denormalized for quick display
  song_artist TEXT NOT NULL,
  spotify_id TEXT,
  
  -- Submission details
  moment_suggestion TEXT, -- Which moment they suggest it for
  dedication TEXT, -- Personal message
  special_memory TEXT, -- Why this song is special
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wedding vendors (DJ, band, photographer needing access)
CREATE TABLE IF NOT EXISTS public.wedding_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.wedding_weddings(id) ON DELETE CASCADE,
  vendor_email TEXT NOT NULL,
  vendor_name TEXT,
  vendor_type TEXT, -- 'dj', 'band', 'photographer', 'planner'
  
  -- Access control
  can_view_timeline BOOLEAN DEFAULT true,
  can_edit_timeline BOOLEAN DEFAULT false,
  can_export_playlist BOOLEAN DEFAULT true,
  
  -- Status
  invite_status TEXT DEFAULT 'pending', -- pending, accepted, declined
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  
  UNIQUE(wedding_id, vendor_email)
);

-- =====================================================
-- FUNERAL APP SPECIFIC TABLES (Future)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.funeral_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  -- Deceased information
  deceased_name TEXT NOT NULL,
  birth_date DATE,
  passing_date DATE,
  
  -- Service details
  service_date DATE,
  service_time TIME,
  venue_name TEXT,
  venue_address TEXT,
  
  -- Ownership
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Associated playlist
  memorial_playlist_id UUID REFERENCES public.playlists(id),
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- UPTUNE MAIN APP TABLES (Future)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.uptune_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  event_type TEXT, -- 'party', 'club_night', 'festival', 'private'
  event_date TIMESTAMPTZ,
  location TEXT,
  
  -- Music
  playlist_id UUID REFERENCES public.playlists(id),
  allow_requests BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.uptune_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL, -- 'guess_the_song', 'music_trivia', 'playlist_battle'
  host_id UUID REFERENCES public.profiles(id),
  
  -- Game data
  game_data JSONB NOT NULL,
  player_count INT DEFAULT 0,
  status TEXT DEFAULT 'waiting', -- waiting, active, completed
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User and auth indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_apps_user ON public.user_apps(user_id, app_name);

-- Songs indexes
CREATE INDEX IF NOT EXISTS idx_songs_genres ON public.songs USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_songs_moods ON public.songs USING GIN(moods);
CREATE INDEX IF NOT EXISTS idx_songs_contexts ON public.songs USING GIN(contexts);
CREATE INDEX IF NOT EXISTS idx_songs_energy ON public.songs(energy);
CREATE INDEX IF NOT EXISTS idx_songs_search ON public.songs USING GIN(
  to_tsvector('english', title || ' ' || artist)
);

-- Playlist indexes
CREATE INDEX IF NOT EXISTS idx_playlists_owner ON public.playlists(owner_id);
CREATE INDEX IF NOT EXISTS idx_playlists_public ON public.playlists(is_public);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist ON public.playlist_songs(playlist_id);

-- Wedding indexes
CREATE INDEX IF NOT EXISTS idx_wedding_slug ON public.wedding_weddings(slug);
CREATE INDEX IF NOT EXISTS idx_wedding_owner ON public.wedding_weddings(owner_id);
CREATE INDEX IF NOT EXISTS idx_wedding_codes ON public.wedding_weddings(guest_code, vendor_code, co_owner_code);
CREATE INDEX IF NOT EXISTS idx_wedding_submissions ON public.wedding_guest_submissions(wedding_id, status);

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_social_follower ON public.social_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_social_following ON public.social_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON public.activity_feed(user_id, created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_guest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (
    (privacy_settings->>'profile_public')::boolean = true
    OR auth.uid() = id
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User apps policies
CREATE POLICY "Users can view own app usage" ON public.user_apps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can track app usage" ON public.user_apps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Songs policies (everyone can view, authenticated can add)
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add songs" ON public.songs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Playlist policies
CREATE POLICY "Public playlists are viewable by everyone" ON public.playlists
  FOR SELECT USING (
    is_public = true
    OR owner_id = auth.uid()
    OR id IN (
      SELECT main_playlist_id FROM public.wedding_weddings 
      WHERE owner_id = auth.uid() OR co_owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create playlists" ON public.playlists
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own playlists" ON public.playlists
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own playlists" ON public.playlists
  FOR DELETE USING (auth.uid() = owner_id);

-- Wedding policies
CREATE POLICY "Wedding owners have full access" ON public.wedding_weddings
  FOR ALL USING (
    auth.uid() = owner_id 
    OR auth.uid() = co_owner_id
  );

CREATE POLICY "Public weddings are viewable" ON public.wedding_weddings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Guest code allows viewing" ON public.wedding_weddings
  FOR SELECT USING (true); -- We'll check guest_code in the query

-- Guest submission policies
CREATE POLICY "Anyone can submit songs" ON public.wedding_guest_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Wedding owners can manage submissions" ON public.wedding_guest_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.wedding_weddings 
      WHERE wedding_weddings.id = wedding_guest_submissions.wedding_id 
      AND (wedding_weddings.owner_id = auth.uid() OR wedding_weddings.co_owner_id = auth.uid())
    )
  );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at BEFORE UPDATE ON public.wedding_weddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Track initial app if provided in metadata
  IF new.raw_user_meta_data->>'initial_app' IS NOT NULL THEN
    INSERT INTO public.user_apps (user_id, app_name)
    VALUES (new.id, new.raw_user_meta_data->>'initial_app');
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Track app usage
CREATE OR REPLACE FUNCTION public.track_app_usage(
  p_app_name TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_apps (user_id, app_name)
  VALUES (auth.uid(), p_app_name)
  ON CONFLICT (user_id, app_name) DO UPDATE
  SET 
    last_accessed = NOW(),
    usage_count = user_apps.usage_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Upsert song with enrichment
CREATE OR REPLACE FUNCTION public.upsert_song(
  p_id TEXT,
  p_title TEXT,
  p_artist TEXT,
  p_album TEXT DEFAULT NULL,
  p_album_art TEXT DEFAULT NULL,
  p_preview_url TEXT DEFAULT NULL,
  p_spotify_uri TEXT DEFAULT NULL,
  p_duration INT DEFAULT NULL,
  p_energy INT DEFAULT NULL,
  p_genres TEXT[] DEFAULT NULL,
  p_moods TEXT[] DEFAULT NULL,
  p_contexts TEXT[] DEFAULT NULL,
  p_explicit BOOLEAN DEFAULT false,
  p_spotify_data JSONB DEFAULT NULL
) RETURNS public.songs AS $$
DECLARE
  v_song public.songs;
BEGIN
  INSERT INTO public.songs (
    id, title, artist, album, album_art, preview_url, 
    spotify_uri, duration, energy, genres, moods, contexts,
    explicit, spotify_data, added_by
  ) VALUES (
    p_id, p_title, p_artist, p_album, p_album_art, p_preview_url,
    p_spotify_uri, p_duration, p_energy, p_genres, p_moods, p_contexts,
    p_explicit, p_spotify_data, auth.uid()
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    artist = EXCLUDED.artist,
    album = COALESCE(EXCLUDED.album, songs.album),
    album_art = COALESCE(EXCLUDED.album_art, songs.album_art),
    preview_url = COALESCE(EXCLUDED.preview_url, songs.preview_url),
    duration = COALESCE(EXCLUDED.duration, songs.duration),
    energy = COALESCE(EXCLUDED.energy, songs.energy),
    genres = COALESCE(EXCLUDED.genres, songs.genres),
    moods = COALESCE(EXCLUDED.moods, songs.moods),
    contexts = CASE 
      WHEN EXCLUDED.contexts IS NOT NULL THEN
        ARRAY(SELECT DISTINCT unnest(songs.contexts || EXCLUDED.contexts))
      ELSE songs.contexts
    END,
    explicit = COALESCE(EXCLUDED.explicit, songs.explicit),
    spotify_data = COALESCE(EXCLUDED.spotify_data, songs.spotify_data),
    updated_at = NOW()
  RETURNING * INTO v_song;
  
  RETURN v_song;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create activity feed entry
CREATE OR REPLACE FUNCTION public.create_activity(
  p_app_name TEXT,
  p_activity_type TEXT,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id TEXT DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT true
) RETURNS void AS $$
BEGIN
  INSERT INTO public.activity_feed (
    user_id, app_name, activity_type, title, description,
    reference_type, reference_id, is_public
  ) VALUES (
    auth.uid(), p_app_name, p_activity_type, p_title, p_description,
    p_reference_type, p_reference_id, p_is_public
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA (Optional)
-- =====================================================

-- Insert common moods
INSERT INTO public.songs (id, title, artist, spotify_uri, moods, contexts) 
VALUES ('__placeholder__', '__placeholder__', '__placeholder__', 'spotify:track:placeholder', 
  ARRAY['romantic', 'energetic', 'melancholic', 'uplifting', 'peaceful', 'nostalgic', 'celebratory', 'solemn'], 
  ARRAY['wedding', 'funeral', 'party', 'dinner', 'workout', 'study', 'relaxation'])
ON CONFLICT DO NOTHING;

-- Clean up placeholder
DELETE FROM public.songs WHERE id = '__placeholder__';